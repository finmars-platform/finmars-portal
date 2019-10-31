/**
 * Created by mevstratov on 23.10.2019.
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
            templateUrl: 'views/directives/groupTable/attributeSettingsMenus/g-rv-filter-settings-btn-view.html',
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


                var updateFilter = function () {

                    for (var i = 0; i < filters.length; i++) {
                        if (filters[i].key === scope.filterKey) {
                            filters[i] = JSON.parse(JSON.stringify(scope.filter));
                            break;
                        }
                    }

                    scope.evDataService.setFilters(filters);

                };

                var isUseFromAboveActive = function () {
                    if (scope.filter.options.use_from_above && Object.keys(scope.filter.options.use_from_above).length > 0) {
                        return true;
                    };

                    return false;
                };

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime &&
                        !isUseFromAboveActive()) {

                        return true;
                    };

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

                    if (scope.filter.options.enabled) {

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                    }

                };
                // < for filter with 'date' data type >

                scope.filterSettingsChange = function () {

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.filter_type === 'date_tree') {
                            scope.filter.options.filter_values = convertDatesTreeToFlatList();
                        }

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                    }

                };

                scope.changeFilterType = function (filterType) {

                    scope.filter.options.use_from_above = {};
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

                    updateFilter();

                    scope.filterSettingsChange();

                };

                scope.createUseFromAboveDir = function () {
                    if (!scope.filter.options.use_from_above) {
                        scope.filter.options.use_from_above = {};
                    }
                };

                scope.renameFilter = function ($mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
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