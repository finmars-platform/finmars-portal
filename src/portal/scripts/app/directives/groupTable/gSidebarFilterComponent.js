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
                filters: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupSidebarFilter', 'initialized');

                scope.$watchCollection('filters', function () {
                    scope.externalCallback();
                });

                scope.openFilterSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.toggleFilterState = function () {
                    scope.externalCallback();
                };

                scope.filterChange = function (filter) {
                    console.log('filterChange', filter);
                    scope.externalCallback();
                };

                scope.selectAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.enabled = true;
                    });
                    scope.externalCallback();
                };

                scope.clearAll = function(){
                    scope.filters.forEach(function (item) {
                        item.options.query = '';
                    });
                    scope.externalCallback();
                };

                scope.deselectAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.enabled = false;
                    });
                    scope.externalCallback();
                };

                scope.removeFilter = function (filter) {

                    scope.filters = scope.filters.map(function (item) {
                        console.log('item', item);

                        if (item.id === filter.id || item.name === filter.name) {
                            return undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });

                    scope.externalCallback();
                }
            }
        }
    }


}());