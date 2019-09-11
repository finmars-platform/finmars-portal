/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents')

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                dashboardConstructorDataService: '=',
                dashboardConstructorEventService: '=',
                tabNumber: '='
            },
            link: function (scope, elem, attr) {

                console.log('Dashboard Constructor Grid Aligner');

                scope.columnsTotal = 1;
                scope.rowsTotal = 1;


                scope.cellWidth = 0;
                scope.cellHeight = 0;

                scope.calculateSingleCellWidth = function () {

                    var tabWidth = elem.width();

                    console.log('tabWidth ', tabWidth);

                    scope.cellWidth = Math.floor(tabWidth / scope.rowsTotal)


                };

                scope.calculateSingleCellHeight = function () {

                    var tabHeight = elem.height();

                    console.log('tabHeight ', tabHeight);

                };

                scope.init = function () {

                    scope.dashboardConstructorEventService.addEventListener(dashboardConstructorEvents.GRID_RENDERED, function () {

                        var layout = scope.dashboardConstructorDataService.getData();

                        var tab = layout.data.tabs[scope.tabNumber];

                        scope.rowsTotal = tab.rows_count;
                        scope.columnsTotal = tab.columns_count;

                        console.log('scope.rowsTotal', scope.rowsTotal);
                        console.log('scope.columnsTotal', scope.columnsTotal);

                        scope.calculateSingleCellHeight();
                        scope.calculateSingleCellWidth();

                        console.log('scope.cellWidth', scope.cellWidth);
                        console.log('scope.cellHeight', scope.cellHeight);

                    });


                };

                scope.init();


            }
        }
    }

}());