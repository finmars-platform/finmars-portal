(function () {

    'use strict';

    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');

    var RvScrollManager = require('./rv-scroll.manager');

    var rvScrollManager = new RvScrollManager();

    var clickTargets = {
        'FOLD_BUTTON': 'FOLD_BUTTON',
        'ROW_SELECTION_OBJECT_BUTTON': 'ROW_SELECTION_OBJECT_BUTTON',
        'ROW_SELECTION_GROUP_BUTTON': 'ROW_SELECTION_GROUP_BUTTON',
        'ROW_SELECTION_OBJECT_SVG': 'ROW_SELECTION_OBJECT_SVG',
        'ROW_SELECTION_GROUP_SVG': 'ROW_SELECTION_GROUP_SVG',
        'ROW_OBJECT': 'ROW_OBJECT',
        'ROW_CELL': 'ROW_CELL',
        'ROW_GROUP': 'ROW_GROUP'
    };

    var calculateTotalHeight = function (evDataService) {

        var count = evDataService.getFlatList().filter(function (item) {

            if (item.___type === 'subtotal' && item.___subtotal_type === 'proxyline') {
                return false;
            }

            return true;

        }).length;

        var rowHeight = evDataService.getRowHeight();

        var extraHeight = 20 * rowHeight;

        return Math.floor(rowHeight * count) + extraHeight;

    };

    var addScrollListener = function (elements, evDataService, evEventService) {

        var offset;
        var rowHeight = evDataService.getRowHeight();
        var viewportElem = elements.viewportElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.debounce(function () {

            offset = Math.floor(viewportElem.scrollTop / rowHeight);
            evDataService.setVirtualScrollOffset(offset);
            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

            calculateScroll(elements, evDataService)


        }, 25);

        var scrollXHandler = function () {

            if (!columnBottomRow) {
                columnBottomRow = document.querySelector('.g-column-bottom-row');
            }

            columnBottomRow.style.left = -viewportElem.scrollLeft + 'px';

        };

        viewportElem.addEventListener('scroll', scrollYHandler);

        viewportElem.addEventListener('scroll', scrollXHandler);

    };

    var getClickTarget = function (event) {

        console.log('getClickTarget.event', event);

        var result = '';

        if (event.target.classList.contains('g-group-holder')) {
            result = clickTargets.ROW_GROUP;
        }

        if (event.target.classList.contains('ev-fold-button')) {
            result = clickTargets.FOLD_BUTTON;
        }

        if (event.target.classList.contains('g-row')) {
            result = clickTargets.ROW_OBJECT;
        }

        if (event.target.classList.contains('g-cell')) {
            result = clickTargets.ROW_CELL;
        }

        if (event.target.classList.contains('g-row-selection') && event.target.parentElement.classList.contains('g-row')) {
            result = clickTargets.ROW_SELECTION_OBJECT_BUTTON;
        }

        if (event.target.tagName === 'svg' && event.target.parentElement.parentElement.classList.contains('g-row')) {
            result = clickTargets.ROW_SELECTION_OBJECT_SVG;
        }

        if (event.target.classList.contains('g-row-selection') && event.target.parentElement.classList.contains('g-group-holder')) {
            result = clickTargets.ROW_SELECTION_GROUP_BUTTON;
        }

        if (event.target.tagName === 'svg' && event.target.parentElement.parentElement.classList.contains('g-group-holder')) {
            result = clickTargets.ROW_SELECTION_GROUP_SVG;
        }

        return result;
    };

    var getClickData = function (event) {

        var clickData = {};

        var clickTarget = getClickTarget(event);

        switch (clickTarget) {

            case clickTargets.FOLD_BUTTON:
                clickData.___type = event.target.dataset.type;
                clickData.___id = event.target.dataset.objectId;
                clickData.___parentId = event.target.dataset.parentGroupHashId;
                break;
        }

        clickData.target = clickTarget;

        return clickData;

    };

    var foldChildGroups = function (parentGroupId, evDataService) {

        var childrens = evDataHelper.getAllChildrenGroups(parentGroupId, evDataService);

        console.log('foldChildGroups.childrens', childrens);

        var item;

        childrens.forEach(function (children) {

            if (children.___type === 'group') {

                item = evDataService.getData(children.___id);

                if (item) {
                    item.___is_open = false;
                    evDataService.setData(item);
                } else {
                    children.___is_open = false;
                    evDataService.setData(children);
                }


            }

        })

    };

    var handleFoldButtonClick = function (clickData, evDataService, evEventService) {

        var group = evDataService.getData(clickData.___id);

        // console.log('group', group);

        if (group) { // initialized only first data request

            var groups = evDataService.getGroups();

            // console.log('group.___is_open', group.___is_open);

            console.log('handleFoldButtonClick.group type', groups[group.___level - 1])

            groups[group.___level - 1].report_settings.is_level_folded = null;

            if (group.___is_open) {

                group.___is_open = false;

                evDataService.setData(group);

                // console.log('folld?');

                foldChildGroups(group.___id, evDataService);

            } else {

                group.___is_open = true;

                console.log('Unfold Group');

                evDataService.setData(group);

                evDataService.setGroups(groups);

                // evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            }

            console.log('handleFoldButtonClick.clicked group', group);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }

        // console.log('group', group);

    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            console.log('clickData', clickData);

            if (clickData.___type === 'foldbutton') {

                handleFoldButtonClick(clickData, evDataService, evEventService);

            }

        })

    };

    var calculatePaddingTop = function (evDataService) {

        // var offset = evDataService.getVirtualScrollOffset();
        // var rowHeight = evDataService.getRowHeight();
        // var reserveTop = evDataService.getVirtualScrollReserveTop();
        //
        // var reservePadding = 0;
        //
        // if (offset > reserveTop) {
        //     reservePadding = reserveTop * rowHeight;
        // }
        //
        // // console.log('calculatePaddingTop.reservePadding', reservePadding);
        //
        // var fullPaddingTop = Math.floor(offset * rowHeight);
        //
        // return fullPaddingTop - reservePadding;

        return evDataService.getVirtualScrollOffsetPx();

    };

    var calculateScroll = function (elements, evDataService) {

        rvScrollManager.setViewportElem(elements.viewportElem);
        rvScrollManager.setContentElem(elements.contentElem);

        var interfaceLayout = evDataService.getInterfaceLayout();

        var viewportWidth = document.body.clientWidth - interfaceLayout.sidebar.width - interfaceLayout.filterArea.width;
        var viewportHeight = Math.floor(document.body.clientHeight - interfaceLayout.columnArea.top - interfaceLayout.columnArea.height);

        console.log('calculateScroll.viewportHeight', viewportHeight);
        console.log('calculateScroll.viewportWidth', viewportWidth);

        rvScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            rvScrollManager.setViewportWidth(viewportWidth);
        }

        var paddingTop = calculatePaddingTop(evDataService);
        var totalHeight = calculateTotalHeight(evDataService);

        rvScrollManager.setContentElemHeight(totalHeight);
        rvScrollManager.setContentElemPaddingTop(paddingTop);

    };

    module.exports = {
        initEventDelegation: initEventDelegation,
        addScrollListener: addScrollListener,
        calculateTotalHeight: calculateTotalHeight,
        calculateScroll: calculateScroll
    }


}());