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
        var contentWrapElem = elements.contentWrapElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.debounce(function () {

            // offset = Math.floor(viewportElem.scrollTop / rowHeight);
            // evDataService.setVirtualScrollOffset(offset);
            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

            calculateScroll(elements, evDataService)


        }, 25);

        var scrollXHandler = function () {

            if (!columnBottomRow) {
                columnBottomRow = contentWrapElem.querySelector('.g-column-bottom-row');
            }

            columnBottomRow.style.left = -viewportElem.scrollLeft + 'px';

        };

        viewportElem.addEventListener('scroll', scrollYHandler);

        viewportElem.addEventListener('scroll', scrollXHandler);

    };

    var getClickTarget = function (event) {

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
            case clickTargets.ROW_SELECTION_OBJECT_BUTTON:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_CELL:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_OBJECT:
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

                evDataService.setData(group);

                evDataService.setGroups(groups);

                // evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            }

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        }

        // console.log('group', group);

    };

    var handleObjectActive = function (clickData, evDataService, evEventService) {

        var obj = evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService);

        var activeObject = evDataService.getActiveObject();

        if (activeObject) {
            activeObject.___is_activated = false;
            evDataService.setObject(activeObject);
        }

        if (!activeObject || activeObject && activeObject.___id !== obj.___id) {
            obj.___is_activated = true;
        }


        console.log('handleObjectActive.obj', obj);

        evDataService.setObject(obj);

        if (obj.___is_activated) {
            evDataService.setActiveObject(obj);
            evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
        } else {
            evDataService.setActiveObject(null);
        }

    };

    var handleObjectClick = function (clickData, evDataService, evEventService) {

        handleObjectActive(clickData, evDataService, evEventService);

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            console.log('clickData', clickData);

            if (clickData.___type === 'foldbutton') {

                handleFoldButtonClick(clickData, evDataService, evEventService);

            }

            if (clickData.___type === 'object') {

                handleObjectClick(clickData, evDataService, evEventService);

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

    var calculateContentWrapHeight = function (contentWrapElement, evDataService) { // Works only for contentWrap that is not from split panel

        var splitPanelIsActive = evDataService.isSplitPanelActive();

        if (splitPanelIsActive) {
            var interfaceLayout = evDataService.getInterfaceLayout();
            var contentWrapElementHeight = document.body.clientHeight - interfaceLayout.headerToolbar.height - interfaceLayout.splitPanel.height;

            contentWrapElement.style.height = contentWrapElementHeight + "px";
        } else {
            contentWrapElement.style.height = "";
        }

    };

    var calculateScroll = function (elements, evDataService) {

        rvScrollManager.setViewportElem(elements.viewportElem);
        rvScrollManager.setContentElem(elements.contentElem);
        rvScrollManager.setContentWrapElem(elements.contentWrapElem);

        var isRootEntityViewer = evDataService.isRootEntityViewer();

        var interfaceLayout = evDataService.getInterfaceLayout();

        var contentWrapElemHeight = rvScrollManager.getContentWrapElemHeight();
        var viewportTop = interfaceLayout.headerToolbar.height + interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
        var viewportWidth = document.body.clientWidth - interfaceLayout.sidebar.width - interfaceLayout.filterArea.width;
        // var viewportHeight = Math.floor(document.body.clientHeight - interfaceLayout.columnArea.top - interfaceLayout.columnArea.height);
        var viewportHeight;

        if (!isRootEntityViewer) {

            viewportTop = interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
            viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);

        } else {

            var viewportHeight = Math.floor(document.body.clientHeight - viewportTop - interfaceLayout.splitPanel.height);

        }

        // console.log('calculateScroll.viewportHeight', viewportHeight);
        // console.log('calculateScroll.viewportWidth', viewportWidth);

        rvScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            rvScrollManager.setViewportWidth(viewportWidth);
        }

        var paddingTop = calculatePaddingTop(evDataService);
        var totalHeight = calculateTotalHeight(evDataService);

        rvScrollManager.setContentElemHeight(totalHeight);
        rvScrollManager.setContentElemPaddingTop(paddingTop);

    };

    var clearDropdowns = function () {

        var dropdowns = document.querySelectorAll('.ev-dropdown');

        for (var i = 0; i < dropdowns.length; i = i + 1) {
            dropdowns[i].remove();
        }

    };

    var initContextMenuEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('contextmenu', function (ev) {

            var objectId;
            var parentGroupHashId;

            if (event.target.offsetParent.classList.contains('ev-viewport')) {

                objectId = event.target.dataset.objectId;
                parentGroupHashId = event.target.dataset.parentGroupHashId;

            } else {

                if (event.target.offsetParent.classList.contains('g-row')) {

                    objectId = event.target.offsetParent.dataset.objectId;
                    parentGroupHashId = event.target.offsetParent.dataset.parentGroupHashId;

                }

            }

            console.log('initContextMenuEventDelegation.event', event);

            console.log('initContextMenuEventDelegation.objectId', objectId);

            if (objectId) {

                ev.preventDefault();
                ev.stopPropagation();

                clearDropdowns();

                var popup = document.createElement('div');

                var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                popup.id = 'dropdown-' + objectId;
                popup.classList.add('ev-dropdown');

                popup.innerHTML = '<div>';


                if (obj['instrument.id']) {
                    popup.innerHTML = popup.innerHTML + '<div>' +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_instrument"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Instrument</div>'
                }

                if (obj['account.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_account"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Account</div>'
                }

                if (obj['portfolio.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_portfolio"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Portfolio</div>';
                }

                if (obj['instrument.id']) {
                    popup.innerHTML = popup.innerHTML +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit_price"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit Price</div>'
                }

                popup.innerHTML = popup.innerHTML + '<div class="ev-dropdown-option"' +
                    ' data-ev-dropdown-action="book_transaction"' +
                    ' data-object-id="' + objectId + '"' +
                    ' data-parent-group-hash-id="' + parentGroupHashId + '">Book Transaction</div>' +
                    '</div>';

                popup.style.position = 'absolute';
                popup.style.left = event.pageX + 'px';
                popup.style.top = event.pageY + 'px';

                document.body.appendChild(popup);

                return false;

            }

        }, false);

        window.addEventListener('contextmenu', function () {
            clearDropdowns();
        });

        window.addEventListener('click', function (event) {

            var objectId = event.target.dataset.objectId;
            var parentGroupHashId = event.target.dataset.parentGroupHashId;
            var dropdownAction = event.target.dataset.evDropdownAction;

            if (objectId && dropdownAction && parentGroupHashId) {

                var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                if (!obj) {
                    obj = {}
                }

                obj.event = event;

                evDataService.setActiveObject(obj);
                evDataService.setActiveObjectAction(dropdownAction);

                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                clearDropdowns();

            } else {

                if (!event.target.classList.contains('ev-dropdown-option')) {
                    clearDropdowns();
                }

            }

        });

    };


    module.exports = {
        initEventDelegation: initEventDelegation,
        addScrollListener: addScrollListener,
        initContextMenuEventDelegation: initContextMenuEventDelegation,
        calculateTotalHeight: calculateTotalHeight,
        calculateContentWrapHeight: calculateContentWrapHeight,
        calculateScroll: calculateScroll
    }


}());