/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                columns: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {
                console.log('Columns component');

                scope.openColumnSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.removeColumn = function (column) {
                    console.log('remove', column);
                    scope.columns = scope.columns.map(function (item) {
                        if (item === column) {
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