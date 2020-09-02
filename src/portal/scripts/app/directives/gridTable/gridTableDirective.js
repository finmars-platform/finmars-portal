(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                gridTableDataService: '=',
                gridTableEventService: '='
            },
            templateUrl: 'views/directives/gridTable/grid-table-view.html',
            link: function (scope, elem, attrs) {

                scope.gridTableData = scope.gridTableDataService.getTableData();
                console.log("grid table scope.gridTableData", scope.gridTableData);

            }
        }
    }

}());