/**
 * Created by mevstratov on 27.05.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    var userFilterService = require('../../../services/rv-data-provider/user-filter.service');

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                filterObject: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/reportViewer/userFilters/user-text-filter-view.html',
            link: function (scope, elem, attrs) {

                console.log("filter filterData", scope.filter);

                scope.filterValue = undefined;

                if (!scope.filter.options) {
                    scope.filter.options = {};
                }

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "contain";
                }

                if (!scope.filter.options.filter_values) {

                    /*switch (scope.filter.options.filter_type) {
                        case "contain":
                        case "does_not_contain":
                            scope.filter.options.filter_values = [];
                            break;
                    }

                    if (scope.filter.options.filter_type === "contain") {

                        scope.filter.options.filter_values = [];

                    }*/
                    scope.filter.options.filter_values = [];

                }

                scope.getFilterName = function () {

                    var filterName = '';
                    var columnName = scope.filter.name;

                    if (scope.filter.layout_name) {
                        columnName = scope.filter.layout_name;
                    }

                    var filterType = 'Regime=' + scope.filter.options.filter_type;

                    filterName = columnName + ": " + filterType;

                    // console.log("filter getFilterName", filterName);

                    return filterName;

                };

                scope.changeFilterType = function (filterType) {
                    scope.filter.options.filter_type = filterType;
                };

                scope.filterChange = function () {
                    console.log("filter filterChange", scope.filter.options.filter_values);

                    /*if (scope.filter.options.filter_type === "contain" || scope.filter.option.filter_type === "does_not_contain") {
                        scope.filter.options.filter_values = scope.filter.options.filter_values.toLowerCase();
                    }*/

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.renameFilter = function (filter, $mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: filter
                        }
                    })

                };

                scope.removeFilter = function (filter) {
                    //console.log('filter to remove is ', filter);
                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.name === filter.name) {
                            // return undefined;
                            item = undefined;
                        }
                        //console.log('filter in filters list', item);
                        return item;
                    }).filter(function (item) {
                        return !!item;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                };

            }
        }
    }

}());