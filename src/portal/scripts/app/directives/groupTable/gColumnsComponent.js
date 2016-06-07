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
                sorting: '=',
                isItemAddition: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {
                console.log('Columns component', scope.columns);

                scope.sortHandler = function (column, sort) {
                    var i;
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        if (!scope.columns[i].options) {
                            scope.columns[i].options = {};
                        }
                        scope.columns[i].options.sort = null;
                    }
                    column.options.sort = sort;

                    if(column.hasOwnProperty('id')) {
                        scope.sorting.column.id = column.id;
                        scope.sorting.column.key = null;
                        scope.sorting.column.sort = sort;
                    } else {
                        scope.sorting.column.id = null;
                        scope.sorting.column.key = column.key;
                        scope.sorting.column.sort = sort;
                    }
                    scope.externalCallback();
                };

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