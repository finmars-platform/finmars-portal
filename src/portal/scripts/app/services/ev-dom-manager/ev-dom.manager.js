(function () {

    'use strict';

    var evDataHelper = require('../../helpers/ev-data.helper');
    var evEvents = require('../../services/entityViewerEvents');
    var EvScrollManager = require('./ev-scroll.manager');

    var evScrollManager = new EvScrollManager();

    var ROW_HEIGHT = 24;


    var initEventDelegation = function (elem, evDataService, evEventService) {

        elem.addEventListener('click', function (event) {

            var groupHashId = event.target.dataset.groupHashId;
            var parentGroupHashId = event.target.dataset.parentGroupHashId;

            if (parentGroupHashId) {

                console.log('id', groupHashId);
                console.log('parentId', parentGroupHashId);

                var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
                var groups = evDataService.getGroups();

                console.log('parents', parents);
                console.log('groups', groups);

                if (parents.length < groups.length) {

                    console.log('Request groups');

                    var item = evDataService.getData(groupHashId);

                    var oldRequestParameters = evDataService.getRequestParameters();

                    console.log('oldRequestParameters', oldRequestParameters);

                    var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);

                    var newRequestParameters = {
                        requestType: 'groups',
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

                    console.log('item', item);

                    evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                } else {

                    console.log('Request objects');

                    var oldRequestParameters = evDataService.getRequestParameters();

                    var groups = evDataService.getGroups();
                    var parents = evDataHelper.getParents(parentGroupHashId, evDataService);
                    var currentGroup = groups[parents.length + 1];
                    var currentGroupIdentifier = currentGroup.hasOwnProperty('key') ? currentGroup.key : currentGroup.id;

                    var groupTypes = evDataHelper.getGroupTypes(groupHashId, parentGroupHashId, evDataService);
                    var groupValues = evDataHelper.getGroupValues(groupHashId, parentGroupHashId, evDataService);

                    var currentGroupName = evDataHelper.getGroupNameFromParent(groupHashId, parentGroupHashId, evDataService);

                    console.log('currentGroupName', currentGroupName);

                    groupValues.push(currentGroupName);
                    groupTypes.push(currentGroupIdentifier);

                    var newRequestParameters = {
                        requestType: 'objects',
                        event: {
                            groupId: groupHashId,
                            parentGroupId: parentGroupHashId,
                            groupName: currentGroupName
                        },
                        body: {
                            groups_types: groupTypes,
                            groups_values: groupValues
                        }
                    };

                    var requestParameters = Object.assign({}, oldRequestParameters, newRequestParameters);

                    evDataService.setRequestParameters(requestParameters);

                    evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                }

            }

        })


    };

    var calculateBaseHeight = function (evDataService, rowHeight) {

        var results = evDataService.getData().count;

        return Math.floor(results * ROW_HEIGHT);

    };

    var calculateScroll = function (viewportElem, scrollTopElem, scrollBottomElem, evDataService) {

        evScrollManager.setViewportElem(viewportElem);
        evScrollManager.setScrollTopElem(scrollTopElem);
        evScrollManager.setScrollBottomElem(scrollBottomElem);

        var contentElemClientRect = document.querySelector('.ev-content').getBoundingClientRect();

        var viewportWidth = window.screen.width - contentElemClientRect.left - document.querySelector('.g-filter-sidebar').clientWidth;
        var viewportHeight = Math.floor(window.screen.height - contentElemClientRect.top);

        evScrollManager.setViewportHeight(viewportHeight);
        if (viewportWidth) {
            evScrollManager.setViewportWidth(viewportWidth);
        }

        var baseHeight = calculateBaseHeight(evDataService, ROW_HEIGHT); // height by total count of root group

        console.log('Calculate scroll!')

    };

    module.exports = {
        initEventDelegation: initEventDelegation,
        calculateScroll: calculateScroll
    }


}());