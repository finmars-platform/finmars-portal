(function () {

    'use strict';

    var evDataHelper = require('../../helpers/ev-data.helper');
    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var EvScrollManager = require('./ev-scroll.manager');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var metaService = require('../../services/metaService');

    var clickTargets = {
        'FOLD_BUTTON': 'FOLD_BUTTON',
        'ROW_SELECTION_OBJECT_BUTTON': 'ROW_SELECTION_OBJECT_BUTTON',
        'ROW_SELECTION_GROUP_BUTTON': 'ROW_SELECTION_GROUP_BUTTON',
        'ROW_SELECTION_OBJECT_SVG': 'ROW_SELECTION_OBJECT_SVG',
        'ROW_SELECTION_GROUP_SVG': 'ROW_SELECTION_GROUP_SVG',
        'ROW_OBJECT': 'ROW_OBJECT',
        'ROW_CELL': 'ROW_CELL',
        'ROW_CELL_CONTENT': 'ROW_CELL_CONTENT',
        'ROW_GROUP': 'ROW_GROUP',
        'LOAD_MORE_BUTTON': 'LOAD_MORE_BUTTON',
        'LOAD_ALL_BUTTON': 'LOAD_ALL_BUTTON'
    };

    var evScrollManager = new EvScrollManager();

    var requestGroups = function (groupHashId, parentGroupHashId, evDataService, evEventService) {

        var oldRequestParameters = evDataService.getActiveRequestParameters();

        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);
        var currentGroupIdentifier = evDataHelper.getGroupIdentifierFromParent(groupHashId, parentGroupHashId, evDataService);

        var pagination = evDataService.getPagination();

        var event = {
            parentGroupId: parentGroupHashId,
            groupId: groupHashId,
            groupName: currentGroupName,
            groupIdentifier: currentGroupIdentifier
        };

        var newRequestParameters = {
            requestType: 'groups',
            id: groupHashId,
            event: {
                ___id: groupHashId,
                parentGroupId: parentGroupHashId,
                groupId: groupHashId,

                groupName: currentGroupName,
                groupIdentifier: currentGroupIdentifier

            },
            body: {
                groups_types: evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService),
                groups_values: evDataHelper.getGroupsValues(groupHashId, parentGroupHashId, evDataService),
                page_size: pagination.items_per_page
            }
        };

        var requestParameters = Object.assign({}, oldRequestParameters, newRequestParameters);

        console.log('requestParameters', requestParameters);

        evDataService.setRequestParameters(requestParameters);
        evDataService.setLastClickInfo(event);
        evDataService.setActiveRequestParametersId(requestParameters.id);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    };

    var requestObjects = function (groupHashId, parentGroupHashId, evDataService, evEventService) {

        console.log('Request objects');

        var requestParameters = evDataService.getRequestParameters(groupHashId);

        var groupTypes = evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService);
        var groupValues = evDataHelper.getGroupsValues(groupHashId, parentGroupHashId, evDataService);
        var pagination = evDataService.getPagination();


        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);
        var currentGroupIdentifier = evDataHelper.getGroupIdentifierFromParent(groupHashId, parentGroupHashId, evDataService);

        if (!requestParameters) {
            requestParameters = {};
        }

        requestParameters.requestType = 'objects';
        requestParameters.id = groupHashId;

        requestParameters.event = {
            ___id: groupHashId,
            parentGroupId: parentGroupHashId,
            groupId: groupHashId,

            groupName: currentGroupName,
            groupIdentifier: currentGroupIdentifier
        };

        requestParameters.body = {
            groups_types: groupTypes,
            groups_values: groupValues,
            page_size: pagination.items_per_page
        };

        evDataService.setRequestParameters(requestParameters);
        evDataService.setActiveRequestParametersId(requestParameters.id);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    };

    var foldChildGroups = function (parentGroupId, evDataService) {

        var childrens = evDataHelper.getAllChildrenGroups(parentGroupId, evDataService);

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

    var handleGroupSelection = function (clickData, evDataService, evEventService) {

        var group = evDataService.getData(clickData.___id);

        if (group) {

            group.___is_activated = !group.___is_activated;

            evDataService.setData(group);

        } else {

            var parentGroup = evDataService.getData(clickData.___parentId);

            parentGroup.results.forEach(function (item) {

                if (item.___id === clickData.___id) {
                    item.___is_activated = !item.___is_activated;
                }

            });

            evDataService.setData(parentGroup);

        }

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var handleGroupFold = function (clickData, evDataService, evEventService) {

        var group = evDataService.getData(clickData.___id);

        group.___is_open = false;

        evDataService.setData(group);

        foldChildGroups(group.___id, evDataService);

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE)

    };

    var handleObjectActive = function (clickData, evDataService, evEventService) {
        console.log("flat list handleObjectActive click");
        var obj = evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService);

        var count = evDataService.getActiveObjectsCount();

        if (clickData.isShiftPressed) {

            obj.___is_activated = true;

            count = count + 1;

            evDataService.setActiveObjectsCount(count);

            evDataService.setActiveObject(obj);
            evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

        } else if (clickData.isCtrlPressed) {

            handleControlClick(clickData, evDataService, evEventService);

        } else {

            var objects = evDataService.getObjects();
            var activeObject = evDataService.getActiveObject();

            objects.forEach(function (item) {
                item.___is_activated = false;
                evDataService.setObject(item);
            });

            if (!activeObject || activeObject && activeObject.___id !== obj.___id || count > 1) {
                obj.___is_activated = true;
            }


            // console.log('handleObjectActive.obj', obj);

            evDataService.setObject(obj);

            if (obj.___is_activated) {
                evDataService.setActiveObject(obj);
                evDataService.setActiveObjectsCount(1);
                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
            } else {

                evDataService.setActiveObjectsCount(0);
                evDataService.setActiveObject(null);
            }

        }

    };

    var handleGroupClick = function (clickData, evDataService, evEventService) {

        if (clickData.target === clickTargets.ROW_SELECTION_GROUP_BUTTON || clickData.target === clickTargets.ROW_SELECTION_GROUP_SVG) {

            handleGroupSelection(clickData, evDataService, evEventService);

        } else {

            var group = evDataService.getData(clickData.___id);

            if (group && group.___is_open) {

                handleGroupFold(clickData, evDataService, evEventService);

            } else {

                var parents = evRvCommonHelper.getParents(clickData.___parentId, evDataService);
                var groups = evDataService.getGroups();

                if (group) { // initialized only first data request

                    group.___is_open = true;

                    evDataService.setData(group);

                }

                if (parents.length < groups.length) {

                    requestGroups(clickData.___id, clickData.___parentId, evDataService, evEventService);

                } else {

                    requestObjects(clickData.___id, clickData.___parentId, evDataService, evEventService)
                }

            }

        }

    };

    var handleObjectClick = function (clickData, evDataService, evEventService) {

        handleObjectActive(clickData, evDataService, evEventService);

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var handleControlClick = function (clickData, evDataService, evEventService) {

        var groupHashId = clickData.___parentId;

        var requestParameters = evDataService.getRequestParameters(groupHashId);

        if (!requestParameters.body.page) {
            requestParameters.body.page = 1;
            requestParameters.requestedPages = [1]
        }

        if (clickData.target === clickTargets.LOAD_MORE_BUTTON) {

            requestParameters.body.page = requestParameters.body.page + 1;
            requestParameters.pagination.page = requestParameters.pagination.page + 1;
            requestParameters.requestedPages.push(requestParameters.body.page);

            evDataService.setRequestParameters(requestParameters);
            evDataService.setActiveRequestParametersId(requestParameters.id);

        }

        if (clickData.target === clickTargets.LOAD_ALL_BUTTON) {

            var totalPages = Math.ceil(requestParameters.pagination.count / requestParameters.pagination.items_per_page);

            requestParameters.requestedPages = [];

            for (var i = 1; i <= totalPages; i = i + 1) {
                requestParameters.requestedPages.push(i);
            }

            evDataService.setRequestParameters(requestParameters);
            evDataService.setActiveRequestParametersId(requestParameters.id);

        }

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

    };

    var getClickTarget = function (event) {

        var result = '';

        console.log('getClickTarget.event', event);

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

        if (event.target.classList.contains('g-cell-content')) {
            result = clickTargets.ROW_CELL_CONTENT;
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

        if (event.target.classList.contains('control-button') && event.target.classList.contains('load-more')) {
            result = clickTargets.LOAD_MORE_BUTTON;
        }

        if (event.target.classList.contains('control-button') && event.target.classList.contains('load-all')) {
            result = clickTargets.LOAD_ALL_BUTTON;
        }

        return result;
    };

    var getClickData = function (event) {

        var clickData = {};

        var clickTarget = getClickTarget(event);

        clickData.target = clickTarget;
        clickData.isShiftPressed = event.shiftKey;
        clickData.isCtrlPressed = event.ctrlKey;

        switch (clickTarget) {

            case clickTargets.ROW_CELL:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_CELL_CONTENT:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_OBJECT:
                clickData.___type = event.target.dataset.type;
                clickData.___id = event.target.dataset.objectId;
                clickData.___parentId = event.target.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_GROUP:
                clickData.___type = event.target.dataset.type;
                clickData.___id = event.target.dataset.groupHashId;
                clickData.___parentId = event.target.dataset.parentGroupHashId;
                break;
            case clickTargets.FOLD_BUTTON:

                var parentWithData = event.target.parentElement;
                var parent = event.target.parentElement;

                for (var i = 0; i < 15; i++) { // safeguard in case of endless loop
                    if (parent.classList.contains('g-group-holder')) {
                        parentWithData = parent;
                        break;
                    } else if (parent === null) {
                        break;
                    } else {
                        parent = parent.parentElement;
                    }
                }

                clickData.___type = parentWithData.dataset.type;
                clickData.___id = parentWithData.dataset.groupHashId;
                clickData.___parentId = parentWithData.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_SELECTION_OBJECT_BUTTON:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_SELECTION_GROUP_BUTTON:
                clickData.___type = event.target.parentElement.dataset.type;
                clickData.___id = event.target.parentElement.dataset.groupHashId;
                clickData.___parentId = event.target.parentElement.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_SELECTION_OBJECT_SVG:
                clickData.___type = event.target.parentElement.parentElement.dataset.type;
                clickData.___id = event.target.parentElement.parentElement.dataset.objectId;
                clickData.___parentId = event.target.parentElement.parentElement.dataset.parentGroupHashId;
                break;
            case clickTargets.ROW_SELECTION_GROUP_SVG:
                clickData.___type = event.target.parentElement.parentElement.dataset.type;
                clickData.___id = event.target.parentElement.parentElement.dataset.groupHashId;
                clickData.___parentId = event.target.parentElement.parentElement.dataset.parentGroupHashId;
                break;
            case clickTargets.LOAD_ALL_BUTTON:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
            case clickTargets.LOAD_MORE_BUTTON:
                clickData.___type = event.target.offsetParent.dataset.type;
                clickData.___id = event.target.offsetParent.dataset.objectId;
                clickData.___parentId = event.target.offsetParent.dataset.parentGroupHashId;
                break;
        }

        return clickData;

    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            console.log('clickData', clickData);

            if (clickData.___type === 'group') {

                handleGroupClick(clickData, evDataService, evEventService);

            }

            if (clickData.___type === 'control') {
                handleControlClick(clickData, evDataService, evEventService);
            }

            if (clickData.___type === 'object') {

                handleObjectClick(clickData, evDataService, evEventService);

            }

        })

    };

    var clearDropdowns = function () {

        var dropdowns = document.querySelectorAll('.ev-dropdown');

        for (var i = 0; i < dropdowns.length; i = i + 1) {
            dropdowns[i].remove();
        }

    };

    var clearActivated = function (evDataService) {

        var objects = evDataService.getObjects();

        objects.forEach(function (item) {

            item.___is_activated = false;

            evDataService.setObject(item);

        });

    };

    var initContextMenuEventDelegation = function (elem, evDataService, evEventService) {

        var entityType = evDataService.getEntityType();

        if (!metaService.isReport(entityType)) {

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

                    clearActivated(evDataService);

                    var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                    obj.___is_activated = true;

                    evDataService.setObject(obj);

                    popup.id = 'dropdown-' + objectId;
                    popup.classList.add('ev-dropdown');
                    popup.innerHTML = '<div>' +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="edit"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Edit</div>' +
                        '<div class="ev-dropdown-option"' +
                        ' data-ev-dropdown-action="delete"' +
                        ' data-object-id="' + objectId + '"' +
                        ' data-parent-group-hash-id="' + parentGroupHashId + '">Delete</div>' +
                        '</div>';

                    popup.style.position = 'absolute';
                    popup.style.left = event.pageX + 'px';
                    popup.style.top = event.pageY + 'px';

                    document.body.appendChild(popup);

                    evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

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

        }

    };

    var calculatePaddingTop = function (evDataService) {

        return evDataService.getVirtualScrollOffsetPx();

        // var rowHeight = evDataService.getRowHeight();
        // var threshold = rowHeight * 10;
        //
        // var result = evDataService.getVirtualScrollOffsetPx() - threshold;
        //
        // if (result < 0) {
        //     result = 0
        // }
        //
        // return result;

    };

    var calculateTotalHeight = function (evDataService) {

        var unfoldedGroups = evDataHelper.getUnfoldedGroups(evDataService);

        var count = 0;

        unfoldedGroups.forEach(function (group) {
            count = count + group.results.length + 1; // 1 for control row
        });

        var rowHeight = evDataService.getRowHeight();

        var extraHeight = 10 * rowHeight;

        return Math.floor(rowHeight * count) + extraHeight;

    };

    var calculateContentWrapHeight = function (contentWrapElement, evDataService) { // Works only for contentWrap that is not from split panel

        var interfaceLayout = evDataService.getInterfaceLayout();
        var contentWrapElementHeight = document.body.clientHeight - interfaceLayout.headerToolbar.height - interfaceLayout.splitPanel.height;

        contentWrapElement.style.height = contentWrapElementHeight + "px";

    };

    var calculateScroll = function (elements, evDataService) {

        evScrollManager.setViewportElem(elements.viewportElem);
        evScrollManager.setContentElem(elements.contentElem);
        evScrollManager.setContentWrapElem(elements.contentWrapElem);

        var isRootEntityViewer = evDataService.isRootEntityViewer();

        var interfaceLayout = evDataService.getInterfaceLayout();

        var contentWrapElemHeight = evScrollManager.getContentWrapElemHeight();

        var viewportTop = interfaceLayout.headerToolbar.height + interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
        var viewportWidth = document.body.clientWidth - interfaceLayout.sidebar.width - interfaceLayout.filterArea.width;
        // var viewportHeight = Math.floor(document.body.clientHeight - interfaceLayout.columnArea.top - interfaceLayout.columnArea.height - interfaceLayout.splitPanel.height);
        var viewportHeight;

        if (!isRootEntityViewer) {

            viewportTop = interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
            viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);

        } else {

            viewportHeight = Math.floor(document.body.clientHeight - viewportTop - interfaceLayout.splitPanel.height);

        }

        evScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            evScrollManager.setViewportWidth(viewportWidth);
        }

        var paddingTop = calculatePaddingTop(evDataService);
        var totalHeight = calculateTotalHeight(evDataService);

        evScrollManager.setContentElemHeight(totalHeight);
        evScrollManager.setContentElemPaddingTop(paddingTop);

    };

    var calculateVirtualStep = function (elements, evDataService) {

        var viewportHeight;
        var isRootEntityViewer = evDataService.isRootEntityViewer();
        var contentWrapElemHeight = evScrollManager.getContentWrapElemHeight();
        var rowHeight = evDataService.getRowHeight();
        var interfaceLayout = evDataService.getInterfaceLayout();

        var viewportTop = interfaceLayout.headerToolbar.height + interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;


        if (!isRootEntityViewer) {
            viewportTop = interfaceLayout.groupingArea.height + interfaceLayout.columnArea.height + interfaceLayout.progressBar.height;
            viewportHeight = Math.floor(contentWrapElemHeight - viewportTop);
        } else {
            viewportHeight = Math.floor(document.body.clientHeight - viewportTop - interfaceLayout.splitPanel.height);
        }

        var step = Math.round(viewportHeight / rowHeight);

        evDataService.setVirtualScrollStep(step);


    };

    var addScrollListener = function (elements, evDataService, evEventService) {

        var viewportElem = elements.viewportElem;
        var contentWrapElem = elements.contentWrapElem;

        var columnBottomRow;

        // var lastScrollTop = 0;
        // var direction;

        var paddingTop;

        var scrollYHandler = utilsHelper.throttle(function () {

            // if (lastScrollTop && lastScrollTop > viewportElem.scrollTop) {
            //     direction = 'top'
            // }
            //
            // if (lastScrollTop && lastScrollTop < viewportElem.scrollTop) {
            //     direction = 'bottom'
            // }

            // evDataService.setVirtualScrollDirection(direction);
            // evDataService.setVirtualScrollPreviousOffsetPx(lastScrollTop);
            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);


            // calculateScroll(elements, evDataService);

            paddingTop = calculatePaddingTop(evDataService);
            evScrollManager.setContentElemPaddingTop(paddingTop);
            evEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);

            // lastScrollTop = viewportElem.scrollTop;

        }, 10);

        var scrollXHandler = function () {

            if (!columnBottomRow) {
                columnBottomRow = contentWrapElem.querySelector('.g-column-bottom-row');
            }

            columnBottomRow.style.left = -viewportElem.scrollLeft + 'px';

        };

        viewportElem.addEventListener('scroll', scrollYHandler);
        viewportElem.addEventListener('scroll', scrollXHandler);

    };

    module.exports = {
        initEventDelegation: initEventDelegation,
        initContextMenuEventDelegation: initContextMenuEventDelegation,
        calculateContentWrapHeight: calculateContentWrapHeight,
        calculateVirtualStep: calculateVirtualStep,
        calculateScroll: calculateScroll,
        addScrollListener: addScrollListener
    }


}());