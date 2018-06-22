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

        var event = {
            groupId: groupHashId,
            parentGroupId: parentGroupHashId,
            groupName: currentGroupName
        };

        var newRequestParameters = {
            requestType: 'groups',
            id: groupHashId,
            event: {
                groupId: groupHashId,
                parentGroupId: parentGroupHashId,
                groupName: currentGroupName
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

        var requestParameters = JSON.parse(JSON.stringify(evDataService.getActiveRequestParameters()));

        var groups = evDataService.getGroups();
        var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
        // var currentGroup = groups[parents.length + 1];
        var currentGroup = groups[parents.length - 1]; // +1 from root group
        var currentGroupIdentifier = currentGroup.hasOwnProperty('key') ? currentGroup.key : currentGroup.id;

        var groupTypes = evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService);
        var groupValues = evDataHelper.getGroupValues(groupHashId, parentGroupHashId, evDataService);

        var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);

        // groupValues.push(currentGroupName);
        // groupTypes.push(currentGroupIdentifier);

        console.log('requestObjects.groupTypes', groupTypes);
        console.log('requestObjects.groupValues', groupValues);

        requestParameters.requestType = 'objects';
        requestParameters.event = {
            groupId: groupHashId,
            parentGroupId: parentGroupHashId,
            groupName: currentGroupName
        };
        requestParameters.body = {
            groups_types: groupTypes,
            groups_values: groupValues
        };

        evDataService.setRequestParameters(requestParameters);

        evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

    }

    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var groupHashId = event.target.dataset.groupHashId;
            var parentGroupHashId = event.target.dataset.parentGroupHashId;

            var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
            var groups = evDataService.getGroups();

            if (parents.length < groups.length) {

                requestGroups(groupHashId, parentGroupHashId, evDataService, evEventService);

            } else {

                requestObjects(groupHashId, parentGroupHashId, evDataService, evEventService)
            }


        })


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

        var limit = evDataService.getVirtualScrollLimit();
        var rowHeight = evDataService.getRowHeight();

        return Math.floor(rowHeight * limit);

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

        var handler = utilsHelper.debounce(function () {

            offset = Math.floor(viewportElem.scrollTop / rowHeight);
            evDataService.setVirtualScrollOffset(offset);
            evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

        }, 100);

        viewportElem.addEventListener('scroll', handler)

    };

    module.exports = {
        initEventDelegation: initEventDelegation,
        calculateScroll: calculateScroll,
        addScrollListener: addScrollListener
    }


}());