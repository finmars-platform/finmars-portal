/**
 * Created by mevstratov on 30.05.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    var userFilterService = require('../../../services/rv-data-provider/user-filter.service');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                filterObject: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/reportViewer/userFilters/rv-number-filter-view.html',
            link: function (scope, elem, attrs) {

                console.log("filter filterNumberData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.columnRowsContent = [];
                scope.showSelectMenu = false;

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent  = userFilterService.getDataByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return {id: cRowsContent, name: cRowsContent}
                    });

                    scope.filterSelectOptions = columnRowsContent.slice(0, 21);
                    console.log("filter select options", scope.filterSelectOptions);
                    scope.$apply();

                });

                if (!scope.filter.options) {
                    scope.filter.options = {};
                }

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "equal";
                }

                if (!scope.filter.options.filter_values) {

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

                    if (filterType === 'from_to') {

                        scope.filter.options.filter_values = {}

                    } else {

                        scope.filter.options.filter_values = undefined;

                    }

                    scope.filterChange();
                };

                scope.filterChange = function (newFilterValues) {
                    console.log("filter filterChange", scope.filter.options.filter_values, newFilterValues);

                    if (newFilterValues && !isNaN(newFilterValues)) {

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                    }

                };

                scope.toggleFilterSelectMenu = function (action) {
                    console.log("filter toggleFilterSelectMenu", action);
                    var selectMenu = elem[0].querySelector(".text-filter-select-menu");

                    if (action === 'show') {
                        selectMenu.classList.remove('visibility-hidden');
                    } else {
                        selectMenu.classList.add('visibility-hidden');
                    }
                };

                scope.selectFilterOption = function (selectOption) {
                    console.log("filter selectFilterOptions", selectOption);
                    var selectMenu = elem[0].querySelector(".text-filter-select-menu");
                    selectMenu.classList.add('visibility-hidden');

                    scope.filter.options.filter_values[0] = selectOption;
                    scope.filterChange();
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
                    console.log('filter scope.filters', scope.filters);
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