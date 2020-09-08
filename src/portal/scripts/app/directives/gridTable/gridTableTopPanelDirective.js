(function () {

    var gtEvents = require('../../services/gridTableEvents');

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                gtDataService: '=',
                gtEventService: '='
            },
            templateUrl: 'views/directives/gridTable/grid-table-top-panel-view.html',
            link: function (scope, elem, attr) {

                scope.gridTableData = scope.gtDataService.getTableData();
                scope.newRow = scope.gridTableData.newRow;
                scope.mode = false;

                var tableMethods = scope.gridTableData.tableMethods;

                scope.addRow = function () {

                    scope.newRow.order = scope.gridTableData.columns.length;

                };

                scope.deleteRows = function () {

                    if (tableMethods && tableMethods.deleteRows) {
                        tableMethods.deleteRows(scope.gtDataService, scope.gtEventService);

                    } else {
                        scope.gtDataService.deleteRows(scope.activeRows);

                    }

                };

                scope.gtEventService.addEventListener(gtEvents.ROW_SELECTION_TOGGLED, function () {

                    scope.activeRows = [];

                    scope.activeRows = scope.gridTableData.body.filter(function (row) {
                        return row.isActive;
                    });

                    if (scope.activeRows.length) {
                        scope.mode = 'rows_deletion';

                    } else {
                        scope.mode = false;
                    }

                });

            }
        }

    }

}());