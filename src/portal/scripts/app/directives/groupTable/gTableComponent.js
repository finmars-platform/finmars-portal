/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                tabs: '=',
                items: '=',
                filters: '=',
                columns: '=',
                grouping: '=',
                sorting: '=',

                itemAdditions: '=',
                itemAdditionsColumns: '=',
                itemAdditionsFilters: '=',
                itemAdditionsSorting: '=',

                externalGetAdditions: '&',
                externalCallback: '&',
                externalAdditionsCallback: '&',
                externalUpdateItem: '&',
                externalUpdateItemAdditions: '&',

                additionsStatus: '='
            },
            link: function (scope, elem, attrs) {
                console.log('Group table initialized...');

                scope.additionsState = false;

                $('.app-md-content').addClass('g-table-overflow');

                scope.$watchCollection('additionsStatus', function(){
                    scope.additionsState = false;
                    if (scope.additionsStatus.editor || scope.additionsStatus.table) {
                        scope.additionsState = true;
                    }
                });

            }
        }
    }

}());