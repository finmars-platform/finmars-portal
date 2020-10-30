(function () {

    var gtEvents = require('../../services/gridTableEvents');
    var metaHelper = require('../../helpers/meta.helper');
    var md5Helper = require('../../helpers/md5.helper');

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
                scope.gtComponents = scope.gridTableData.components;
                scope.topPanelComponents = scope.gridTableData.components.topPanel || {};

                // var gridTableSettings = scope.gridTableData.settings || {};
                var newRowsKeys = [];
                var tableMethods = scope.gridTableData.tableMethods || {};

                var assembleNewRow = () => {

                    var newRow = metaHelper.recursiveDeepCopy(scope.gridTableData.templateRow, true);
                    var newRowKey = md5Helper.md5('newGridTableRow', newRowsKeys.length);

                    newRowsKeys.push(newRowKey);
                    newRow.key = newRowKey;

                    /* var lowestOrder = 0;
                    scope.gridTableData.body.forEach(function (bRow) {
                        lowestOrder = Math.min(lowestOrder, bRow.order)
                    })

                    newRow.order = lowestOrder - 1 */

                    // newRow.order = "newRow" + newRowsKeys.length

                    return newRow;

                };

                var addRow = function () {

                    var newRow = assembleNewRow();
                    scope.gridTableData.body.unshift(newRow);

                    scope.gtEventService.dispatchEvent(gtEvents.ROW_ADDED);

                };

                scope.deleteRows = function () {

                    if (tableMethods && tableMethods.deleteRows) {
                        tableMethods.deleteRows(scope.gtDataService, scope.gtEventService);

                    } else {

                        scope.gtDataService.deleteRows(scope.activeRows);

                        var delRowsKeys = scope.activeRows.map(function (aRow) {
                            return aRow.key;
                        });

                        scope.gtEventService.dispatchEvent(gtEvents.ROW_DELETED, {deletedRowsKeys: delRowsKeys});
                        scope.gtEventService.dispatchEvent(gtEvents.ROW_SELECTION_TOGGLED);

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

                var init = function () {

                    if (tableMethods.addRow) {
                        scope.addRow = function () {
                            tableMethods.addRow(scope.gtDataService, scope.gtEventService)
                        }

                    } /* TODO delete later
                        else if (gridTableSettings.addRowMode) { // default for cases when row changes after addition

                        scope.addRow = function () {

                            var newRow = assembleNewRow()
                            newRow.isNewRow = true

                            scope.gridTableData.body.unshift(newRow);

                        }

                    }*/ else {
                        scope.addRow = addRow

                    }


                };

                init();

            }
        }

    }

}());