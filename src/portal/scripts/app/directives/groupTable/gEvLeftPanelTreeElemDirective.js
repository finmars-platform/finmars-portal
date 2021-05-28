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


    module.exports = function ($mdDialog, $state,) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-ev-left-panel-tree-elem-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                item: '='
            },
            link: function (scope,) {

                scope.unfoldGroup = function ($event) {
                    scope.item.___is_open = true;

                    scope.evDataService.setData(scope.item)

                    evDomManager.requestGroups(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.foldGroup = function ($event) {
                    scope.item.___is_open = false;
                    scope.evDataService.setData(scope.item)
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.toggleGroupSelection = function ($event) {

                    if (!scope.isLastLevel) {
                        return;
                    }

                    var selectedGroups = []

                    var selected = scope.item.___is_selected

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState()

                    if (!scope.multiselectIsActive) {
                        var items = scope.evDataService.getDataAsList();

                        items.forEach(function (item) {
                            item.___is_selected = false;
                            scope.evDataService.setData(item);
                        })

                        selectedGroups = []

                        scope.evDataService.setSelectedGroups(selectedGroups);
                    }

                    scope.item.___is_selected = selected;

                    selectedGroups = scope.evDataService.getSelectedGroups();

                    if (scope.item.___is_selected) {

                        selectedGroups = selectedGroups.filter(function (group) {
                            return group.___id !== scope.item.___id;
                        })

                    } else {

                        evDomManager.requestObjects(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService)

                        selectedGroups.push(scope.item);

                    }

                    scope.item.___is_selected = !scope.item.___is_selected;

                    scope.evDataService.setData(scope.item)

                    scope.evDataService.setSelectedGroups(selectedGroups);


                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                    console.log('scope.item', scope.item);

                }

                var init = async function () {

                    if (scope.item.___parentId) {
                        var parents = evRvCommonHelper.getParents(scope.item.___parentId, scope.evDataService);
                        var groups = scope.evDataService.getGroups();

                        if (parents.length === groups.length) {

                            scope.isLastLevel = true;
                        }
                    }

                };

                init();

            },
        }
    }
}());