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


                scope.generateGroupsTree = function () {

                    var result = evDataHelper.getGroupsAsTree(scope.evDataService);

                    console.log('generateGroupsTree.result', result)

                    return result;

                }

                var init = async function () {

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                        scope.tree = scope.generateGroupsTree()
                    });

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        scope.tree = scope.generateGroupsTree()
                    });


                    scope.tree = scope.generateGroupsTree()


                };

                init();

            },
        }
    }
}());