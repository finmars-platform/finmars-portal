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
            templateUrl: 'views/directives/entityViewer/userFilters/ev-number-filter-view.html',
            link: function (scope, elem, attrs) {

                // console.log("filter filterNumberData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.columnRowsContent = [];
                scope.nItemsValue = null;

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.attributesFromAbove = [];

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent  = userFilterService.getDataByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return cRowsContent;
                    });

                    if(!scope.isRootEntityViewer) {
                        scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();
                    }

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

                if (!scope.filter.options.exclude_empty_cells) {
                    scope.filter.options.exclude_empty_cells = false;
                }

                if (scope.filter.options.is_frontend_filter) {
                    scope.filter.options.is_frontend_filter = false;
                };

                var filterEnabled = scope.filter.options.enabled; // check for filter turning off

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



                scope.filterSettingsChange = function () {
                    // console.log("filter filterSettingsChange", scope.filter.options);

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.is_frontend_filter) {

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        } else {

                            scope.evDataService.resetData();
                            scope.evDataService.resetRequestParameters();

                            var rootGroup = scope.evDataService.getRootGroupData();

                            scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                        };

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

                scope.updateFilters = function(){

                    var filters = scope.evDataService.getFilters();

                    filters.forEach(function (item) {

                        if (scope.filter.key === item.key || scope.filter.id === item.id) {
                            item = Object.assign({}, scope.filter)
                        }

                    });

                    scope.evDataService.setFilters(scope.filters);

                };


                scope.initSplitPanelMode = function () {

                    if (!scope.isRootEntityViewer) {

                        scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

                            if (['multiselector', 'date_tree', 'from_to'].indexOf(scope.filter.options.filter_type) === -1) {

                                var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

                                scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();

                                var key = scope.filter.options.use_from_above;
                                var value = activeObjectFromAbove[key];

                                scope.filter.options.filter_values = [value]; // example value 'Bank 1 Notes 4% USD'

                                scope.updateFilters();

                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            }

                        })

                    }

                };


                scope.init = function () {

                    scope.initSplitPanelMode();


                };

                scope.init()

            }
        }
    }

}());