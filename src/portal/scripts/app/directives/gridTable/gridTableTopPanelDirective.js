(function () {

    var gtEvents = require('../../services/gridTableEvents');
    var metaHelper = require('../../helpers/meta.helper');

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
                scope.mode = false;

                var tableMethods = scope.gridTableData.tableMethods;

                scope.addRow = function () {

                    var newRow = metaHelper.recursiveDeepCopy(scope.gridTableData.templateRow, true);
                    newRow.key = 'newRow';

                    var lowestOrder = -1;
                    scope.gridTableData.body.forEach(function (bRow) {
                        lowestOrder = Math.min(lowestOrder, bRow.order)
                    })

                    newRow.order = lowestOrder - 1
                    scope.gridTableData.body.unshift(newRow);

                    scope.gtEventService.dispatchEvent(gtEvents.ROW_ADDED);

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