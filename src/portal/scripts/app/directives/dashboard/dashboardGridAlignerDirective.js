(function () {

    'use strict';

    module.exports = function () {
        return {
            restriction: 'AE',
            scope: {
                dashboardDataService: '=',
                dashboardEventService: '=',
                tabNumber: '='
            },
            link: function (scope, elem, attr) {

                console.log('Dashboard Grid Aligner');

                scope.columnsTotal = 1;
                scope.rowsTotal = 1;

                scope.calculateSingleCellWidth = function () {



                };

                scope.calculateSingleCellHeight = function () {

                };

                scope.init = function () {

                    var data = scope.dashboardDataService.getData();


                };

                scope.init();


            }
        }
    }
}());