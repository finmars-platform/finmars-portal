/**
 * Created by mevstratov on 14.08.2019.
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
            templateUrl: 'views/directives/entityViewer/userFilters/ev-text-filter-view.html',
            link: function (scope, elem, attrs) {

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.columnRowsContent = [];
                scope.showSelectMenu = false;

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.attributesFromAbove = [];

                scope.useFromAboveFilterTypes = [
                    {
                        key: 'contains',
                        name: 'CONTAINS'
                    }
                ];

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent = userFilterService.getCellValueByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return {id: cRowsContent, name: cRowsContent}
                    });

                    if (!scope.isRootEntityViewer) {
                        scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();
                    }

                    scope.$apply();

                });

                if (!scope.filter.options) {
                    scope.filter.options = {};
                };

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "contains";
                };

                if (!scope.filter.options.filter_values) {
                    scope.filter.options.filter_values = [];
                };

                if (!scope.filter.options.hasOwnProperty('exclude_empty_cells')) {
                    scope.filter.options.exclude_empty_cells = false;
                };

                if (!scope.filter.options.hasOwnProperty('is_frontend_filter')) {
                    scope.filter.options.is_frontend_filter = true;
                };

                var filterEnabled = scope.filter.options.enabled; // check for filter turning off

                scope.getClassesForFilter = function () {
                    var filterClasses = '';

                    if (!scope.filter.options.enabled) {
                        filterClasses = 'f-disabled ';
                    }

                    if (!scope.filter.options.is_frontend_filter) {
                        filterClasses += 'ev-backend-filter ';
                    }

                    if (scope.filter.options.hasOwnProperty('use_from_above')) {
                        filterClasses += 'link-to-above-filter';
                    }

                    return filterClasses;
                };

                scope.getFilterRegime = function () {

                    var filterRegime = "";

                    if (scope.filter.options.hasOwnProperty('use_from_above')) {

                        filterRegime = "Linked to Selection";

                    } else {

                        switch (scope.filter.options.filter_type) {
                            case "contains":
                                filterRegime = "Contains";
                                break;
                            case "does_not_contains":
                                filterRegime = "Does not contains";
                                break;
                            case "selector":
                                filterRegime = "Selector";
                                break;
                            case "multiselector":
                                filterRegime = "Multiple selector";
                                break;
                            case "empty":
                                filterRegime = "Show empty cells";
                                break;
                        }
                    };

                    return filterRegime;

                };

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime &&
                        !scope.filter.options.use_from_above) {

                        return true;

                    };

                    return false;
                };

                scope.getMultiselectorName = function () {
                    var multiselectorName = scope.filter.name + ". " + "Regime = " + scope.filter.options.filter_type;

                    return multiselectorName;
                };

                scope.changeFilterType = function (filterType) {
                    delete scope.filter.options.use_from_above;
                    scope.filter.options.filter_type = filterType;
                    if (filterType === 'empty') {
                        scope.filter.options.exclude_empty_cells = false;
                    }
                    scope.filter.options.filter_values = [];
                    scope.filterSettingsChanged();
                };

                scope.toggleFrontendFilter = function () {

                    scope.filter.options.is_frontend_filter = !scope.filter.options.is_frontend_filter;

                    if (!scope.filter.options.is_frontend_filter) {

                        if (scope.filter.options.filter_type === "multiselector" ||
                            scope.filter.options.filter_type === "selector") {

                            scope.filter.options.filter_values = [];
                            scope.filter.options.filter_type = "contains";

                        };

                    };

                    scope.filterSettingsChanged();

                };

                scope.filterSettingsChanged = function () {

                    /*if (scope.filter.options.filter_type === "contain" || scope.filter.option.filter_type === "does_not_contain") {
                        scope.filter.options.filter_values = scope.filter.options.filter_values.toLowerCase();
                    }*/
                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        if (scope.filter.options.is_frontend_filter) {

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        }

                    }

                };

                scope.selectFilterOption = function (selectOption) {

                    scope.filter.options.filter_values[0] = selectOption;
                    scope.filterSettingsChanged();
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


                scope.noDataForLinkingTo = true;
                var columns = scope.evDataService.getColumns();

                for (var c = 0; c < columns.length; c++) {
                    if (columns[c].key === scope.filter.options.use_from_above) {
                        scope.noDataForLinkingTo = false;
                        break;
                    };
                };

                scope.initSplitPanelMode = function () {

                    if (!scope.isRootEntityViewer) {

                        scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

                            scope.noDataForLinkingTo = true;
                            var columns = scope.evDataService.getColumns();
                            var key = scope.filter.options.use_from_above;

                            for (var c = 0; c < columns.length; c++) {
                                if (columns[c].key === key) {
                                    scope.noDataForLinkingTo = false;
                                    break;
                                };
                            };

                            if (scope.filter.options.hasOwnProperty('use_from_above') && !scope.noDataForLinkingTo) {

                                var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

                                scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();

                                var value = activeObjectFromAbove[key];

                                scope.filter.options.filter_values = [value]; // example value 'Bank 1 Notes 4% USD'

                                scope.updateFilters();

                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            };

                        });

                    } else {

                        if (scope.filter.options.hasOwnProperty('use_from_above')) {
                            scope.noDataForLinkingTo = true;
                        };

                    };

                };


                scope.init = function () {

                    scope.initSplitPanelMode();

                };

                scope.init()

            }
        }
    }

}());