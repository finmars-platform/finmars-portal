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

                console.log('itemAdditions', scope.itemAdditions);

                scope.showAdditions = function () {
                    if (scope.additionsStatus.dataEditor || scope.additionsStatus.additionsWorkArea) {
                        return true;
                    }
                    return false;
                }
            }
        }
    }

}());