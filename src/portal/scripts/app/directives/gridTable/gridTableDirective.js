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
            templateUrl: 'views/directives/gridTable/grid-table-view.html',
            link: function (scope, elem, attrs) {

                scope.allRowsAreActive = false;

                scope.gridTableData = scope.gtDataService.getTableData();
                scope.sortByCol = false;
                scope.sortRowsReverse = false;

                scope.setSortByCol = function (colOrder) {

                    if (colOrder === scope.sortByCol) {
                        scope.sortRowsReverse = !scope.sortRowsReverse;

                    } else {
                        scope.sortByCol = colOrder;
                        scope.sortRowsReverse = false;
                    }

                }

                scope.sortRowsByCol = function (row) {
                    if (scope.sortByCol) {
                        return row.columns[scope.sortByCol].settings.value;
                    }
                }

                scope.toggleAllRows = function () {

                    scope.allRowsAreActive = !scope.allRowsAreActive;

                    scope.gridTableData.body.forEach(function (row) {
                        row.isActive = scope.allRowsAreActive;
                    });

                    scope.gtEventService.dispatchEvent(gtEvents.ROW_SELECTION_TOGGLED);

                };

                scope.toggleRowSelection = function (rowOrder) {

                    scope.gridTableData.body[rowOrder].isActive = !scope.gridTableData.body[rowOrder].isActive;

                    var selectedRows = scope.gtDataService.getSelectedRows();

                    if (selectedRows.length === scope.gridTableData.body.length) {
                        scope.allRowsAreActive = true;

                    } else {
                        scope.allRowsAreActive = false;
                    }

                    scope.gtEventService.dispatchEvent(gtEvents.ROW_SELECTION_TOGGLED);

                };


                scope.gtEventService.addEventListener(gtEvents.SORTING_SETTINGS_CHANGED, function () {

                    var sortSettings = scope.gtDataService.getSortingSettings();

                    scope.sortByCol = sortSettings.column;
                    scope.sortRowsReverse = sortSettings.reverse;

                    // scope.$apply();

                })

                console.log("grid table scope.gridTableData", scope.gridTableData);

            }
        }
    }

}());