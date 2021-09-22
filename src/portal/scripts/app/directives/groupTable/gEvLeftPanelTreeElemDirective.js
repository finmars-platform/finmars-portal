/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');
    var evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');


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

                	scope.item.___is_open = true;

                    scope.evDataService.setData(scope.item);

					const hasUnloadedChildren = scope.item.___items_count > 0 && !scope.item.results.length;

					if (hasUnloadedChildren) {

						scope.loading = true;

						const dataLoadEndIndex = scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

							scope.loading = false;
							scope.evEventService.removeEventListener(evEvents.DATA_LOAD_END, dataLoadEndIndex);

						});

					}

                    evDomManager.requestGroups(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService);

                    // scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.foldGroup = function ($event) {
                    scope.item.___is_open = false;
                    scope.evDataService.setData(scope.item)
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                var deselectChildrenObjs = function (item) {

                	item.results.forEach(function (child) { // deactivate objects from previously selected group

						if (child.___type === 'object') {
							child.___is_activated = false;
						}

					});

                	return item;

				};

                scope.toggleGroupSelection = function ($event) {

                    if (!scope.isLastLevel) {
                        return;
                    }

                    var selectedGroups = [];

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState();

                    if (!scope.multiselectIsActive) {

						var selected = scope.item.___is_selected;
                    	var items = scope.evDataService.getDataAsList();

                        items.forEach(function (item) {

                        	item.___is_selected = false;

							if (item.results && item.results.length) {
								item = deselectChildrenObjs(item);
							}

                            scope.evDataService.setData(item);

                        })

                        scope.evDataService.setSelectedGroups([]);

						scope.item.___is_selected = selected; // return ___is_selected status of clicked group after resetting statuses of all groups

                    }

                    selectedGroups = scope.evDataService.getSelectedGroups();

                    if (scope.item.___is_selected) {

						if (scope.item.results && scope.item.results.length) {

							var item = scope.evDataService.getData(scope.item.___id);
							item = deselectChildrenObjs(item);

							scope.evDataService.setData(item);

						}

                        selectedGroups = selectedGroups.filter(function (group) {
                            return group.___id !== scope.item.___id;
                        });

                    } else {

                        evDomManager.requestObjects(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService)

                        selectedGroups.push(scope.item);

                    }

                    scope.item.___is_selected = !scope.item.___is_selected;

                    scope.evDataService.setData(scope.item);

                    scope.evDataService.setSelectedGroups(selectedGroups);

					scope.evContentElement.scrollTop = 0;

					scope.evDataService.setSelectAllRowsState(false);

					scope.evEventService.dispatchEvent(evEvents.ROW_ACTIVATION_CHANGE);
					scope.evEventService.dispatchEvent(evEvents.HIDE_BULK_ACTIONS_AREA);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

                var init = async function () {


                    var groups = scope.evDataService.getGroups();

                    if (scope.item.___level === groups.length) {

                        scope.isLastLevel = true;
                    }


                };

                init();

            },
        }
    }
}());