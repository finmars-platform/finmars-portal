/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');

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

                logService.component('groupColumnResizer', 'initialized');

                scope.sortHandler = function (column, sort) {
                    var i;
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        if (!scope.columns[i].options) {
                            scope.columns[i].options = {};
                        }
                        scope.columns[i].options.sort = null;
                    }
                    column.options.sort = sort;

                    if (column.hasOwnProperty('id')) {
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
                    //console.log('remove', scope.columns);
                    if (column.id) {
                        scope.columns = scope.columns.map(function (item) {
                            if (item.id === column.id || item.key === column.key) {
                                return undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }
                    if (column.key) {
                        scope.columns = scope.columns.map(function (item) {
                            if (item.key === column.key) {
                                return undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    }
                    //console.log('remove', scope.columns);
                }
            }
        }
    }


}());