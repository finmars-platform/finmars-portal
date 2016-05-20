/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                columns: '=',
                isItemAddition: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {
                console.log('Columns component', scope.columns);

                scope.openColumnSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };


                scope.removeColumn = function (column) {
                    //console.log('remove', column);
                    scope.columns = scope.columns.map(function (item) {
                        if (item.id === column.id || item.name === column.name) {
                            return undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    })
                }
            }
        }
    }


}());