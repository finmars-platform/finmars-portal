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
            templateUrl: 'views/directives/reportViewer/userFilters/rv-date-filter-view.html',
            link: function (scope, elem, attrs) {

                console.log("filter filterDateData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.columnRowsContent = [];

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent  = userFilterService.getDataByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return {
                            value: cRowsContent,
                            active: false
                        }
                    });

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

                    console.log("date tree columnRows", scope.columnRowsContent);
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

                        scope.filter.options.filter_values = [];

                    }

                    scope.filterSettingsChange();
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
                    console.log("date tree date to save", datesList);
                    return datesList;

                };

                scope.applyFilter = function () {
                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                };

                scope.filterSettingsChange = function () {
                    console.log("filter filterSettingsChange", scope.filter.options.filter_values);
                    if (scope.filter.options.filter_type === 'date_tree') {
                        scope.filter.options.filter_values = convertDatesTreeToFlatList();
                    }

                    scope.applyFilter();

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

            }
        }
    }

}());