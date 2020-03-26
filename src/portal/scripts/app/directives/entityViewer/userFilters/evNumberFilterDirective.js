/**
 * Created by mevstratov on 30.05.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/entityViewer/userFilters/ev-number-filter-view.html',
            link: function (scope, elem, attrs) {

                // console.log("filter filterNumberData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.nItemsValue = null;

                //var toggleFilterAreaID;

                if (!scope.filter.options) {
                    scope.filter.options = {};
                }

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "equal";
                }

                if (!scope.filter.options.filter_values) {
                    scope.filter.options.filter_values = [];
                }

                if (!scope.filter.options.hasOwnProperty('exclude_empty_cells')) {
                    scope.filter.options.exclude_empty_cells = false;
                }

                if (!scope.filter.options.hasOwnProperty('is_frontend_filter')) {
                    scope.filter.options.is_frontend_filter = true;
                }

                var filterEnabled = scope.filter.options.enabled; // check for filter turning off

                scope.getFilterName = function () {
                    if (scope.filter.layout_name) {
                        return scope.filter.layout_name;
                    }

                    return scope.filter.name;
                };

                scope.getClassesForFilter = function () {
                    var filterClasses = '';

                    if (!scope.filter.options.enabled) {
                        filterClasses = 'f-disabled ';
                    }

                    if (!scope.filter.options.is_frontend_filter) {
                        filterClasses += 'ev-backend-filter ';
                    }

                    return filterClasses;
                };

                scope.getFilterRegime = function () {

                    var filterRegime = "";

                    switch (scope.filter.options.filter_type) {
                        case "equal":
                            filterRegime = "Equal";
                            break;
                        case "not_equal":
                            filterRegime = "Not equal";
                            break;
                        case "greater":
                            filterRegime = "Greater than";
                            break;
                        case "greater_equal":
                            filterRegime = "Greater or equal to";
                            break;
                        case "less":
                            filterRegime = "Less than";
                            break;
                        case "less_equal":
                            filterRegime = "Less or equal to";
                            break;
                        case "empty":
                            filterRegime = "Show empty cells";
                            break;
                        /*case "top_n":
                            filterRegime = "Top N items";
                            break;
                        case "bottom_n":
                            filterRegime = "Bottom N items";
                            break;*/
                    }

                    return filterRegime;

                };

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime) {

                        return true;

                    }

                    return false;
                };

                scope.filterSettingsChange = function () {

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.is_frontend_filter) {

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        }

                    }

                };

                scope.changeFilterType = function (filterType) {

                    scope.filter.options.filter_type = filterType;

                    if (filterType === 'from_to') {

                        scope.filter.options.filter_values = {};

                    } else {

                        if (filterType === 'empty') {
                            scope.filter.options.exclude_empty_cells = false;
                        }

                        scope.filter.options.filter_values = [];

                    }

                    scope.filterSettingsChange();
                };

                scope.toggleFrontendFilter = function () {
                    scope.filter.options.is_frontend_filter = !scope.filter.options.is_frontend_filter;
                    scope.filterSettingsChange();
                };

                scope.clearFilter = function () {
                    if (scope.filter.options.filter_type === 'from_to') {

                        scope.filter.options.filter_values = {};

                    } else {

                        scope.filter.options.filter_values = [];

                    }

                    scope.filterSettingsChange();
                };

                scope.renameFilter = function (filter, $mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'RenameFieldDialogController as vm',
                        templateUrl: 'views/dialogs/rename-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: filter
                        }
                    })

                };

                scope.removeFilter = function (filter) {
                    scope.filters = scope.evDataService.getFilters();
                    /*console.log('filter scope.filters', scope.filters);
                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.key === filter.key) {
                            // return undefined;
                            item = undefined;
                        }

                        return item;
                    }).filter(function (item) {
                        return !!item;
                    });*/
                    scope.filters.map(function (item, index) {
                        if (item.key === filter.key) {
                            scope.filters.splice(index, 1);
                        }
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                };

                scope.updateFilters = function() {

                    var filters = scope.evDataService.getFilters();

                    filters.forEach(function (item) {

                        if (scope.filter.key === item.key || scope.filter.id === item.id) {
                            item = Object.assign({}, scope.filter)
                        }

                    });

                    scope.evDataService.setFilters(scope.filters);

                };

                /*var init = function () {
                    toggleFilterAreaID = scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        scope.sideNavCollapsed = interfaceLayout.filterArea.collapsed;

                    });

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();
                    scope.sideNavCollapsed = interfaceLayout.filterArea.collapsed;
                };

                init();

                scope.$on("$destroy", function () {
                    scope.evEventService.removeEventListener(evEvents.TOGGLE_FILTER_AREA, toggleFilterAreaID);
                });*/

            }
        }
    }

}());