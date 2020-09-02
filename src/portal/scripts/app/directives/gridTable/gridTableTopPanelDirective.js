(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                gridTableDataService: '=',
                gridTableEventService: '='
            },
            templateUrl: 'views/directives/gridTable/grid-table-top-panel-view.html',
            link: function (scope, elem, attr) {

                scope.gridTableData = scope.gridTableDataService.getTableData();
                scope.newRow = scope.gridTableData.newRow;

                scope.addRow = function () {

                    scope.newRow.order = scope.gridTableData.columns.length;

                };

            }
        }

    }

}());