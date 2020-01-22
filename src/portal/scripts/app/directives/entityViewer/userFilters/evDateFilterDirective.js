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
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/entityViewer/userFilters/ev-date-filter-view.html',
            link: function (scope, elem, attrs) {

                // console.log("filter filterDateData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.columnRowsContent = [];

                var dataLoadEndId;

                var getDataForSelects = function () {
                    var columnRowsContent  = userFilterService.getCellValueByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return {
                            value: cRowsContent,
                            active: false
                        }
                    });

                    // ---------------- For Testing -----------------
                    /*scope.columnRowsContent = [
                        new Date('2019-05-20'),
                        new Date('2019-05-23'),
                        new Date('2019-05-01'),
                        new Date('2019-05-05'),
                        new Date('2019-05-13'),
                        new Date('2019-02-21'),
                        new Date('2019-02-28'),
                        new Date('2019-02-20'),
                        new Date('2019-03-24'),
                        new Date('2019-03-11'),
                        new Date('2018-11-20'),
                        new Date('2018-11-11'),
                        new Date('2018-11-18'),
                        new Date('2018-06-21'),
                        new Date('2018-06-22'),
                        new Date('2018-06-23'),
                        new Date('2018-06-24'),
                        new Date('2016-05-20'),
                        new Date('2016-05-21'),
                        new Date('2016-05-22'),
                        new Date('2016-05-23')
                    ];*/

                    scope.$apply();
                };

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
                        case "date_tree":
                            filterRegime = "Date tree";
                            break;

                    }

                    return filterRegime;

                };

                scope.changeFilterType = function (filterType) {

                    scope.filter.options.filter_type = filterType;

                    if (filterType === 'date_tree') {

                        scope.filter.options.dates_tree = [];

                    }

                    if (filterType === 'from_to') {

                        scope.filter.options.filter_values = {};

                    } else {

                        if (filterType === 'empty') {
                            scope.filter.options.exclude_empty_cells = false;
                        }

                        scope.filter.options.filter_values = [];

                    }

                    scope.filterSettingsChanged();
                };

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime) {

                        return true;

                    }

                    return false;
                };

                scope.toggleFrontendFilter = function () {

                    scope.filter.options.is_frontend_filter = !scope.filter.options.is_frontend_filter;

                    if (!scope.filter.options.is_frontend_filter) {

                        if (scope.filter.options.filter_type === "date_tree") {

                            scope.filter.options.filter_values = [];
                            scope.filter.options.filter_type = "equal";

                        }

                    }

                    scope.filterSettingsChanged();

                };

                var convertDatesTreeToFlatList = function () {

                    var datesList = [];

                    scope.filter.options.dates_tree.map(function (yearGroup) {

                        yearGroup.items.map(function (monthGroup) {

                            monthGroup.items.map(function (date) {

                                delete date.dayNumber;
                                delete date.available;

                                date = JSON.parse(angular.toJson(date));

                                if (date.active) {
                                    datesList.push(date.value);
                                }

                            });

                        });

                    });
                    // console.log("date tree date to save", datesList);
                    return datesList;

                };

                scope.applyFilter = function () {

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.is_frontend_filter) {

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        }

                    }

                };

                scope.filterSettingsChanged = function () {

                    if (scope.filter.options.filter_type === 'date_tree') {
                        scope.filter.options.filter_values = convertDatesTreeToFlatList();
                    }

                    scope.applyFilter();

                };

                scope.clearFilter = function () {

                    if (scope.filter.options.filter_type === 'date_tree') {
                        scope.filter.options.dates_tree = [];
                    }

                    if (scope.filter.options.filter_type === 'from_to') {
                        scope.filter.options.filter_values = {};
                    } else {
                        scope.filter.options.filter_values = [];
                    }

                    scope.filterSettingsChanged();

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
                        //console.log('filter in filters list', item);
                        return item;
                    }).filter(function (item) {
                        return !!item;
                    });*/
                    scope.filters.map(function (item, index) {
                        if (item.key === filter.key) {
                            scope.filters.splice(index, 1)
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

                var init = function () {
                    if (!dataLoadEndId) { // if needed to prevent multiple addEventListener
                        dataLoadEndId = scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, getDataForSelects);
                    }

                    if (!scope.columnRowsContent || scope.columnRowsContent.length === 0) {
                        setTimeout(function () {
                            getDataForSelects();
                        }, 500);
                    }
                };

                init();

                scope.$on("$destroy", function () {
                    scope.evEventService.removeEventListener(evEvents.DATA_LOAD_END, dataLoadEndId);
                })

            }
        }
    }

}());