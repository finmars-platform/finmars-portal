(function () {

    'use strict';

    var evDataHelper = require('../../helpers/ev-data.helper');
    var utilsHelper = require('../../helpers/utils.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var EvScrollManager = require('./ev-scroll.manager');

    var evScrollManager = new EvScrollManager();

    function requestGroups(groupHashId, parentGroupHashId, evDataService, evEventService) {

        console.log('Request groups');

        var item = evDataService.getData(groupHashId);

        var oldRequestParameters = evDataService.getActiveRequestParameters();

        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);
        var currentGroupId = evDataHelper.getGroupIdFromParent(groupHashId, parentGroupHashId, evDataService);

        var event = {
            groupId: groupHashId,
            parentGroupId: parentGroupHashId,
            groupName: currentGroupName
        };

        var newRequestParameters = {
            requestType: 'groups',
            id: groupHashId,
            event: {
                ___id: groupHashId,
                parentGroupId: parentGroupHashId,
                groupName: currentGroupName,
                groupId: currentGroupId
            },
            body: {
                groups_types: evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService),
                groups_values: evDataHelper.getGroupValues(groupHashId, parentGroupHashId, evDataService)
            }
        };

        var requestParameters = Object.assign({}, oldRequestParameters, newRequestParameters);

        console.log('requestParameters', requestParameters);

        evDataService.setRequestParameters(requestParameters);
        evDataService.setLastClickInfo(event);
        evDataService.setActiveRequestParametersId(event.groupId);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    }

    function requestObjects(groupHashId, parentGroupHashId, evDataService, evEventService) {

        console.log('Request objects');

        var requestParameters = evDataService.getRequestParameters(groupHashId);

        var groups = evDataService.getGroups();
        var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
        // var currentGroup = groups[parents.length + 1];
        var currentGroup = groups[parents.length - 1]; // +1 from root group
        var currentGroupIdentifier = currentGroup.hasOwnProperty('key') ? currentGroup.key : currentGroup.id;

        var groupTypes = evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService);
        var groupValues = evDataHelper.getGroupValues(groupHashId, parentGroupHashId, evDataService);

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
            groupId: groupHashId
        };
        requestParameters.body = {
            groups_types: groupTypes,
            groups_values: groupValues
        };

        evDataService.setRequestParameters(requestParameters);
        evDataService.setActiveRequestParametersId(requestParameters.id);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    }

    function foldChildGroups(parentGroupId, evDataService) {

        var childrens = evDataHelper.getAllChildrenGroups(parentGroupId, evDataService);

        console.log('foldChildGroups.childrens', childrens);

        childrens.forEach(function (children) {

            if (children.results.length) { // only for requested groups
                children.is_open = false;
                evDataService.setData(children);
            }

        })

    }

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            console.log('event', event);

            var dataType;
            var objectId;
            var parentGroupHashId;

            if (event.target.offsetParent.classList.contains('ev-viewport')) {

                dataType = event.target.dataset.type;
                objectId = event.target.dataset.objectId;
                parentGroupHashId = event.target.dataset.parentGroupHashId;

            } else {

                if (event.target.offsetParent.classList.contains('g-row')) {

                    dataType = event.target.offsetParent.dataset.type;
                    objectId = event.target.offsetParent.dataset.objectId;
                    parentGroupHashId = event.target.offsetParent.dataset.parentGroupHashId;

                }

            }

            console.log('dataType', dataType);

            if (dataType === 'group') {

                var groupHashId = event.target.dataset.groupHashId;

                var group = evDataService.getData(groupHashId);

                if (group && group.is_open) {

                    group.is_open = false;

                    console.log('Fold groups');

                    evDataService.setData(group);

                    foldChildGroups(group.___id, evDataService);

                    evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                } else {

                    var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
                    var groups = evDataService.getGroups();

                    if (group) { // initialized only first data request

                        group.is_open = true;

                        console.log('Unfold Group');

                        evDataService.setData(group);

                    }

                    if (parents.length < groups.length) {

                        requestGroups(groupHashId, parentGroupHashId, evDataService, evEventService);

                    } else {

                        requestObjects(groupHashId, parentGroupHashId, evDataService, evEventService)
                    }

                }

            }

            if (dataType === 'object') {

                var obj = evDataHelper.getObject(objectId, parentGroupHashId, evDataService);

                console.log('obj', obj);

                evDataService.setEditorEntityId(obj.id);
                evEventService.dispatchEvent(evEvents.ADDITIONS_EDITOR_ENTITY_ID_CHANGE);
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

                evDataService.setActiveObject({
                    action: dropdownAction,
                    event: event,
                    id: obj.id,
                    name: obj.name, // for delete dialog
                    ___id: objectId,
                    ___parentId: parentGroupHashId
                });
                evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                clearDropdowns();

            } else {

                if (!event.target.classList.contains('ev-dropdown-option')) {
                    clearDropdowns();
                }

            }

        });

    };

    var calculatePaddingTop = function (evDataService) {

        var offset = evDataService.getVirtualScrollOffset();
        var rowHeight = evDataService.getRowHeight();
        var reserveTop = evDataService.getVirtualScrollReserveTop();

        var reservePadding = 0;

        if (offset > reserveTop) {
            reservePadding = reserveTop * rowHeight;
        }

        var fullPaddingTop = Math.floor(offset * rowHeight);

        return fullPaddingTop - reservePadding;

    };

    var calculateTotalHeight = function (evDataService) {

        var unfoldedGroups = evDataHelper.getUnfoldedGroups(evDataService);

        var count = 0;

        unfoldedGroups.forEach(function (group) {

            count = count + group.count;

        });

        // console.log('calculateTotalHeight.unfoldedGroups', unfoldedGroups);
        //
        // console.log('calculateTotalHeight.count', count);


        var rowHeight = evDataService.getRowHeight();

        return Math.floor(rowHeight * count);

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

    var addScrollListener = function (elements, evDataService, evEventService) {

        var offset;
        var rowHeight = evDataService.getRowHeight();
        var viewportElem = elements.viewportElem;

        var columnBottomRow;

        var scrollYHandler = utilsHelper.debounce(function () {

            offset = Math.floor(viewportElem.scrollTop / rowHeight);
            evDataService.setVirtualScrollOffset(offset);
            evEventService.dispatchEvent(evEvents.UPDATE_TABLE);


        }, 100);

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