(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents')
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses')

    module.exports = function () {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-button-set-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                console.log('Dashboard Button Set Component');

                scope.grid = [];

                scope.buttons = scope.item.data.settings.buttons;

                scope.getButtonSet = function(){

                    scope.rows = scope.item.data.settings.rows;
                    scope.columns = scope.item.data.settings.columns;

                    var index = 0;

                    if (scope.buttons.length) {

                        for (var r = 0; r < scope.rows; r = r + 1) {

                            scope.grid[r] = {
                                columns: []
                            };

                            for (var c = 0; c < scope.columns; c = c + 1) {

                                if (scope.buttons[index]) {
                                    scope.grid[r].columns[c] = scope.buttons[index];
                                }

                                index = index + 1;

                            }

                        }

                    }

                    console.log('grid', scope.grid);


                };

                scope.initEventListeners = function(){

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if(status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                        }

                    });

                };

                scope.init = function () {

                    scope.getButtonSet();

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initEventListeners();

                };


                scope.init()


            }
        }
    }
}());