/**
 * Created by szhitenev on 25.05.2021.
 * */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');


    module.exports = function ($mdDialog, $state,) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/groupTable/g-ev-left-panel-view.html',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=', // TODO may be not need
            },
            link: function (scope,) {

                scope.multiselectIsActive = false;


                scope.generateGroupsTree = function () {

                    var result = evDataHelper.getGroupsAsTree(scope.evDataService);

                    console.log('generateGroupsTree.result', result)

                    return result;

                }

                scope.toggleMultiselect = function () {

                    scope.multiselectIsActive = !scope.multiselectIsActive;

                    scope.evDataService.setSelectedGroupsMultiselectState(scope.multiselectIsActive)

                }

                scope.resize = function () {
                    var table = document.querySelector('.g-table-section')

                    var leftPanel = document.querySelector('.g-ev-left-panel-holder')

                    leftPanel.style.height = table.clientHeight + 'px';
                }

                var init = async function () {

                    scope.multiselectIsActive = scope.evDataService.getSelectedGroupsMultiselectState()

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply()
                        }, 0)

                    });


                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                        scope.resize()

                        setTimeout(function () {
                            scope.tree = scope.generateGroupsTree();
                            scope.$apply();
                        }, 0)

                    });


                    scope.tree = scope.generateGroupsTree()


                    setTimeout(function () {

                        scope.resize();

                    }, 100)



                };

                init();

            },
        }
    }
}());