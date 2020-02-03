/**
 * Created by mevstratov on 30.10.2019.
 */
(function () {

    'use strict';

    var evEvents = require('../../../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                filterKey: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/attributeSettingsMenus/g-ev-filter-settings-btn-view.html',
            link: function (scope, elem, attrs) {

                var filters = scope.evDataService.getFilters();

                filters.forEach(function (filter) {
                    if (filter.key === scope.filterKey) {
                        scope.filter = filter;

                        if (scope.filter && !scope.filter.hasOwnProperty('options')) {
                            scope.filter.options = {};
                        }
                    }
                });

                var filterEnabled = scope.filter.options.enabled;

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime) {
                        return true;
                    }

                    return false;
                };

                // for filter with 'date' data type
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
                // < for filter with 'date' data type >

                scope.changeFilterType = function (filterType) {

                    scope.filter.options.filter_type = filterType;

                    switch (scope.filter.value_type) {
                        case 10:
                        case 30:

                            if (filterType === 'empty') {
                                scope.filter.options.exclude_empty_cells = false;
                            }
                            scope.filter.options.filter_values = [];

                            break;

                        case 20:
                            if (filterType === 'from_to') {
                                scope.filter.options.filter_values = {};
                            } else {

                                if (filterType === 'empty') {
                                    scope.filter.options.exclude_empty_cells = false;
                                }
                                scope.filter.options.filter_values = [];

                            }
                            break;

                        case 40:
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
                            break;
                    }

                    scope.filterSettingsChanged();
                };

                scope.toggleFrontendFilter = function () {

                    scope.filter.options.is_frontend_filter = !scope.filter.options.is_frontend_filter;

                    if (!scope.filter.options.is_frontend_filter) {

                        switch (scope.filter.value_type) {
                            case 10:
                            case 30:
                                if (scope.filter.options.filter_type === "multiselector" ||
                                    scope.filter.options.filter_type === "selector") {

                                    scope.filter.options.filter_values = [];
                                    scope.filter.options.filter_type = "contains";

                                }
                                break;
                            case 40:
                                if (scope.filter.options.filter_type === "date_tree") {

                                    scope.filter.options.filter_values = [];
                                    scope.filter.options.filter_type = "equal";

                                }
                                break;
                        }

                    }

                    scope.filterSettingsChanged();

                };

                scope.filterSettingsChanged = function () {

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.filter_type === 'date_tree') {
                            scope.filter.options.filter_values = convertDatesTreeToFlatList();
                        }

                        if (scope.filter.options.is_frontend_filter) {
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                    }

                };

                scope.renameFilter = function ($mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'RenameFieldDialogController as vm',
                        templateUrl: 'views/dialogs/rename-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: scope.filter
                        }

                    });

                };

            }
        }
    }

}());