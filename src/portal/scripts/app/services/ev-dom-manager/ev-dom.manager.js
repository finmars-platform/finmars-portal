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
        'ROW_GROUP': 'ROW_GROUP'
    };

    var evScrollManager = new EvScrollManager();

    var requestGroups = function (groupHashId, parentGroupHashId, evDataService, evEventService) {

        var oldRequestParameters = evDataService.getActiveRequestParameters();

        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);
        var currentGroupId = evDataHelper.getGroupIdFromParent(groupHashId, parentGroupHashId, evDataService); // for classifiers

        var event = {
            parentGroupId: parentGroupHashId,
            groupName: currentGroupName,
            groupId: groupHashId
        };

        var newRequestParameters = {
            requestType: 'groups',
            id: groupHashId,
            event: {
                ___id: groupHashId,
                parentGroupId: parentGroupHashId,
                groupName: currentGroupName,
                groupId: currentGroupId // for classifiers, nullable
            },
            body: {
                groups_types: evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService),
                groups_values: evDataHelper.getGroupsValues(groupHashId, parentGroupHashId, evDataService)
            }
        };

        var requestParameters = Object.assign({}, oldRequestParameters, newRequestParameters);

        evDataService.setRequestParameters(requestParameters);
        evDataService.setLastClickInfo(event);
        evDataService.setActiveRequestParametersId(requestParameters.id);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    };

    var requestObjects = function (groupHashId, parentGroupHashId, evDataService, evEventService) {

        console.log('Request objects');

        var requestParameters = evDataService.getRequestParameters(groupHashId);

        var groups = evDataService.getGroups();
        var parents = evRvCommonHelper.getParents(parentGroupHashId, evDataService);
        // var currentGroup = groups[parents.length + 1];
        var currentGroup = groups[parents.length - 1]; // +1 from root group
        var currentGroupIdentifier = currentGroup.hasOwnProperty('key') ? currentGroup.key : currentGroup.id;

        var groupTypes = evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService);
        var groupValues = evDataHelper.getGroupsValues(groupHashId, parentGroupHashId, evDataService);

        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);

        var currentGroupId = evDataHelper.getGroupIdFromParent(groupHashId, parentGroupHashId, evDataService);

        if (!requestParameters) {
            requestParameters = {};
        }

        requestParameters.requestType = 'objects';
        requestParameters.id = groupHashId;

        requestParameters.event = {
            ___id: groupHashId,
            parentGroupId: parentGroupHashId,
            groupName: currentGroupName,
            groupId: currentGroupId
        };
        requestParameters.body = {
            groups_types: groupTypes,
            groups_values: groupValues
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

            group.___is_selected = !group.___is_selected;

            evDataService.setData(group);

        } else {

            var parentGroup = evDataService.getData(clickData.___parentId);

            parentGroup.results.forEach(function (item) {

                if (item.___id === clickData.___id) {
                    item.___is_selected = !item.___is_selected;
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

    var handleObjectSelection = function (clickData, evDataService, evEventService) {

        var obj = evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService);

        evDataService.clearActiveObject();

        obj.___is_selected = !obj.___is_selected;
        obj.___is_activated = obj.___is_selected;

        evDataService.setObject(obj);

        if (obj.___is_activated) {
            evDataService.setActiveObject(obj);
        } else {
            evDataService.setActiveObject(null);
        }

        evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

    };

    var handleObjectActive = function (clickData, evDataService) {

        var obj = evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService);

        var activeObject = evDataService.getActiveObject();

        if (activeObject) {
            activeObject.___is_activated = false;
            evDataService.setObject(activeObject);
        }

        if (!activeObject || activeObject && activeObject.___id !== obj.___id) {
            obj.___is_activated = true;
        }


        // console.log('handleObjectActive.obj', obj);

        evDataService.setObject(obj);

        if (obj.___is_activated) {
            evDataService.setActiveObject(obj);
        } else {
            evDataService.setActiveObject(null);
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

        if (clickData.target === clickTargets.ROW_SELECTION_OBJECT_BUTTON || clickData.target === clickTargets.ROW_SELECTION_OBJECT_SVG) {

            handleObjectSelection(clickData, evDataService, evEventService);

        } else {

            var obj = evDataHelper.getObject(clickData.___id, clickData.___parentId, evDataService);

            handleObjectActive(clickData, evDataService);

            evDataService.setEditorEntityId(obj.id);
            evEventService.dispatchEvent(evEvents.ADDITIONS_EDITOR_ENTITY_ID_CHANGE);

            evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
        }

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

            case clickTargets.ROW_CELL:

                console.log('event.target.offsetParent', event.target.offsetParent);

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
                clickData.___type = event.target.parentElement.dataset.type;
                clickData.___id = event.target.parentElement.dataset.groupHashId;
                clickData.___parentId = event.target.parentElement.dataset.parentGroupHashId;
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
        }

        clickData.target = clickTarget;

        return clickData;

    };

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var clickData = getClickData(event);

            if (clickData.___type === 'group') {

                handleGroupClick(clickData, evDataService, evEventService);

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

                if (objectId && dropdownAction) {

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

    };

    var calculateTotalHeight = function (evDataService) {

        var unfoldedGroups = evDataHelper.getUnfoldedGroups(evDataService);

        var count = 0;

        unfoldedGroups.forEach(function (group) {

            count = count + group.count;

        });

        var rowHeight = evDataService.getRowHeight();

        var extraHeight = 20 * rowHeight;

        return Math.floor(rowHeight * count) + extraHeight;

    };

    var calculateScroll = function (elements, evDataService) {

        evScrollManager.setViewportElem(elements.viewportElem);
        evScrollManager.setContentElem(elements.contentElem);

        var interfaceLayout = evDataService.getInterfaceLayout();

        var viewportWidth = document.body.clientWidth - interfaceLayout.sidebar.width - interfaceLayout.filterArea.width;
        var viewportHeight = Math.floor(document.body.clientHeight - interfaceLayout.columnArea.top - interfaceLayout.columnArea.height);

        evScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            evScrollManager.setViewportWidth(viewportWidth);
        }

        var paddingTop = calculatePaddingTop(evDataService);
        var totalHeight = calculateTotalHeight(evDataService);

        evScrollManager.setContentElemHeight(totalHeight);
        evScrollManager.setContentElemPaddingTop(paddingTop);

    };

    var addScrollListener = function (elements, evDataService, evEventService)  {

        var viewportElem = elements.viewportElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.debounce(function () {

            evDataService.setVirtualScrollOffsetPx(viewportElem.scrollTop);
            evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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

    module.exports = {
        initEventDelegation: initEventDelegation,
        initContextMenuEventDelegation: initContextMenuEventDelegation,
        calculateScroll: calculateScroll,
        addScrollListener: addScrollListener
    }


}());