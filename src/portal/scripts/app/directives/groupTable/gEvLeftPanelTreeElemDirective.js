/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper').default;

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-ev-left-panel-tree-elem-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                item: '=',
                evContentElement: '='
            },
            link: function (scope,) {

                scope.loading = false;

                scope.unfoldGroup = function ($event) {

                    // scope.item.___is_open = true;

                    // scope.evDataService.setData(scope.item);
                    const itemData = scope.evDataService.getData(scope.item.___id);
                    itemData.___is_open = true;

                    scope.evDataService.setData(itemData);

                    const hasUnloadedChildren = scope.item.___items_count > 0 && !scope.item.results.length;

                    if (hasUnloadedChildren) {

                        scope.loading = true;

                        const dataLoadEndIndex = scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                            scope.loading = false;
                            scope.evEventService.removeEventListener(evEvents.DATA_LOAD_END, dataLoadEndIndex);

                        });

                    }

                    // event UPDATE_TABLE dispatched by `evDomManager.requestGroups()`
                    evDomManager.requestGroups(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService);

                    // scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.foldGroup = function ($event) {

                    const itemData = scope.evDataService.getData(scope.item.___id);

                    itemData.___is_open = false;
                    scope.evDataService.setData(itemData);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

                var deselectChildrenObjs = function (itemId) {

                    const children = evRvCommonHelper.getDirectChildren(itemId, scope.evDataService);

                    children.forEach(child => {

                        if (child.___type === 'object') {

                            child.___is_activated = false;
                            scope.evDataService.setData(child);

                        }

                    })

                };

                scope.loadMore = function ($event) {


                    var groupHashId = scope.item.___id;


                    var requestParameters = scope.evDataService.getRequestParameters(groupHashId);

                    console.log('load more ', requestParameters)

                    scope.total_pages = Math.ceil(requestParameters.pagination.count / requestParameters.pagination.page_size);

                    if (requestParameters.pagination.page < scope.total_pages) {

                        if (!requestParameters.pagination.page) {
                            requestParameters.pagination.page = 1;
                            requestParameters.requestedPages = [1]
                        }

                        requestParameters.pagination.page = requestParameters.pagination.page + 1;
                        requestParameters.requestedPages.push(requestParameters.pagination.page);

                        scope.evDataService.setRequestParameters(requestParameters);
                        scope.evDataService.setActiveRequestParametersId(requestParameters.id);


                        scope.currentPage = requestParameters.pagination.page
                    }


                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

                scope.loadAll = function ($event) {

                    var groupHashId = scope.item.___id;


                    var requestParameters = scope.evDataService.getRequestParameters(groupHashId);

                    console.log('load all ', requestParameters)


                    scope.total_pages = Math.ceil(requestParameters.pagination.count / requestParameters.pagination.page_size);

                    if (requestParameters.pagination.page < scope.total_pages) {

                        if (!requestParameters.pagination.page) {
                            requestParameters.pagination.page = 1;
                            requestParameters.requestedPages = [1]
                        }

                        requestParameters.loadAll = true;

                        requestParameters.pagination.page = requestParameters.pagination.page + 1;
                        requestParameters.requestedPages.push(requestParameters.pagination.page);

                        scope.evDataService.setRequestParameters(requestParameters);

                        scope.currentPage = requestParameters.pagination.page

                    }
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

                /**
                 * Must be used inside `scope.toggleGroupSelection()`
                 * @see scope.toggleGroupSelection
                 *
                 * @param {Object} group - is the `scope.item`
                 * @param {Array} selectedGroups
                 * @return {Array} - selectedGroups without the one that was deselected
                 */
                var deselectGroup = function (group, selectedGroups) {

                    if (group.results && group.results.length) {

                        var groupData = scope.evDataService.getData(scope.item.___id);
                        deselectChildrenObjs(groupData);

                    }

                    return selectedGroups.filter(function (group) {
                        return group.___id !== scope.item.___id;
                    });

                }

                scope.toggleGroupSelection = function ($event) {

                    if (!scope.isLastLevel) {
                        return;
                    }

                    var selectedGroups;
                    var requestObjects = false;

                    var itemData = scope.evDataService.getData(scope.item.___id);

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState();

                    if (!scope.multiselectIsActive) {

                        var selected = scope.item.___is_selected;
                        var items = scope.evDataService.getDataAsList();

                        items.forEach(function (item) {

                            item.___is_selected = false;

                            if (item.results && item.results.length) {
                                deselectChildrenObjs(item.___id);
                            }

                            scope.evDataService.setData(item);

                        })

                        scope.evDataService.setSelectedGroups([]);

                        itemData.___is_selected = selected; // return ___is_selected status of clicked group after resetting statuses of all groups

                    }

                    selectedGroups = scope.evDataService.getSelectedGroups();

                    if (itemData.___is_selected) {
                        selectedGroups = deselectGroup(itemData, selectedGroups);

                    } else {

                        // evDomManager.requestObjects(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService)
                        requestObjects = true;

                        selectedGroups.push(itemData);

                    }

                    itemData.___is_selected = !itemData.___is_selected;

                    scope.evDataService.setData(itemData);

                    scope.evDataService.setSelectedGroups(selectedGroups);

                    scope.evContentElement.scrollTop = 0;

                    scope.evDataService.setSelectAllRowsState(false);

                    scope.evEventService.dispatchEvent(evEvents.ROW_ACTIVATION_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.HIDE_BULK_ACTIONS_AREA);

                    if (requestObjects) {
                        // event UPDATE_TABLE will be dispatched by `evDomManager.requestObjects()`
                        evDomManager.requestObjects(itemData.___id, itemData.___parentId, scope.evDataService, scope.evEventService)

                    } else {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                    }

                }

                scope.getPrettyName = function () {
                    scope.item.___group_name_pretty = scope.item.___group_name

                    if (scope.groupType && scope.groupType.entity === 'complex-transaction') {
                        if (scope.groupType.key === 'status') {

                            if (scope.item.___group_name === 1) {
                                scope.item.___group_name_pretty = 'Booked'
                            } else if (scope.item.___group_name === 2) {
                                scope.item.___group_name_pretty = 'Pending'
                            } else if (scope.item.___group_name === 3) {
                                scope.item.___group_name_pretty = 'Ignored'
                            }

                        }

                    }

                    return scope.item.___group_name_pretty
                }

                scope.getGroupType = function () {

                    console.log('tree elem, ', scope.item)

                    if (scope.item) { // wtf research later

                        var groups = scope.evDataService.getGroups();

                        scope.groupType = groups[scope.item.___level - 1]

                        if (scope.item.___level === groups.length) {

                            scope.isLastLevel = true;
                        }

                    }
                    // console.log('tree groups, ', groups)
                    // console.log('tree groupType, ', scope.groupType)
                }

                var init = async function () {

                    scope.getGroupType()

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        scope.getGroupType()

                    });

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.getGroupType()

                        var groupHashId = scope.item.___id;

                        var requestParameters = scope.evDataService.getRequestParameters(groupHashId);

                        scope.total_pages = Math.ceil(requestParameters.pagination.count / requestParameters.pagination.page_size);

                        if (!requestParameters.pagination.page) {
                            requestParameters.pagination.page = 1;
                            requestParameters.requestedPages = [1];
                        }

                        scope.currentPage = requestParameters.pagination.page;

                        console.log('scope.requestParameters', scope.requestParameters);
                        console.log('scope.currentPage', scope.currentPage);
                        console.log('scope.total_pages', scope.total_pages);

                    })

                };

                if (scope.item) { // wtf/??
                    init();
                }

            },
        }
    }
}());