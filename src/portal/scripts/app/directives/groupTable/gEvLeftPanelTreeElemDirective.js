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
                    scope.item.___is_open = false;


                    evDomManager.requestGroups(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                }

                scope.foldGroup = function ($event) {
                    scope.item.___is_open = true;
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                }

                scope.toggleGroupSelection = function ($event) {

                    var selectedGroups = scope.evDataService.getSelectedGroups();

                    if (scope.item.___is_selected) {

                        selectedGroups = selectedGroups.filter(function (group) {
                            return group.id !== scope.item.id;
                        })

                    } else {

                        var parents = evRvCommonHelper.getParents(scope.item.___parentId, scope.evDataService);
                        var groups = scope.evDataService.getGroups();

                        if (parents.length < groups.length) {

                            evDomManager.requestObjects(scope.item.___id, scope.item.___parentId, scope.evDataService, scope.evEventService)

                        }
                        selectedGroups.push(scope.item);

                    }

                    scope.item.___is_selected = !scope.item.___is_selected;
                    scope.evDataService.setSelectedGroups(selectedGroups);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                }

                var init = async function () {


                };

                init();

            },
        }
    }
}());