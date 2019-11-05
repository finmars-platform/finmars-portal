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
                evEventService: '=',
                attributeDataService: '='
            },
            templateUrl: 'views/directives/reportViewer/userFilters/rv-number-filter-view.html',
            link: function (scope, elem, attrs) {

                // console.log("filter filterNumberData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.filterSelectOptions = [];
                scope.columnRowsContent = [];
                scope.nItemsValue = null;

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.useFromAbove = scope.evDataService.getUseFromAbove();
                //scope.attributesFromAbove = [];

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    var columnRowsContent  = userFilterService.getCellValueByKey(scope.evDataService, scope.filter.key);

                    scope.columnRowsContent = columnRowsContent.map(function (cRowsContent) {
                        return cRowsContent;
                    });

                    /*if(!scope.isRootEntityViewer) {
                        scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();
                    }*/

                    scope.$apply();

                });

                if (!scope.filter.options) {
                    scope.filter.options = {};
                };

                if (!scope.filter.options.filter_type) {
                    scope.filter.options.filter_type = "equal";
                };

                if (!scope.filter.options.filter_values) {
                    scope.filter.options.filter_values = [];
                };

                if (!scope.filter.options.hasOwnProperty('exclude_empty_cells')) {
                    scope.filter.options.exclude_empty_cells = false;
                };

                var filterEnabled = scope.filter.options.enabled;

                var isUseFromAboveActive = function () {
                    if (scope.filter.options.use_from_above && Object.keys(scope.filter.options.use_from_above).length > 0) {
                        return true;
                    };

                    return false;
                };

                scope.getClassesForFilter = function () {
                    var filterClasses = '';

                    if (!scope.filter.options.enabled) {
                        filterClasses = 'f-disabled ';
                    }

                    if (isUseFromAboveActive()) {
                        filterClasses += 'link-to-above-filter';
                    }

                    return filterClasses;
                };

                scope.getFilterRegime = function () {

                    var filterRegime = "";

                    if (isUseFromAboveActive()) {

                        filterRegime = "Linked to Selection";

                    } else {

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
                        };

                    };

                    return filterRegime;

                };



                scope.filterSettingsChange = function () {
                    // console.log("filter filterSettingsChange", scope.filter.options);

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

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

                    if (filterType === 'from_to') {

                        scope.filter.options.filter_values = {}

                    } else {

                        if (filterType === 'empty') {
                            scope.filter.options.exclude_empty_cells = false;
                        }

                        scope.filter.options.filter_values = [];

                    }

                    scope.filterSettingsChange();
                };

                scope.createUseFromAboveDir = function () {
                    if (!scope.filter.options.use_from_above) {
                        scope.filter.options.use_from_above = {};
                    }
                };

                scope.showFRCheckMark = function (filterRegime) {
                    if (scope.filter.options.filter_type === filterRegime &&
                        !isUseFromAboveActive()) {

                        return true;

                    };

                    return false;
                };

                scope.renameFilter = function (filter, $mdMenu, $event) {

                    $mdMenu.close($event);

                    $mdDialog.show({
                        controller: 'renameFieldDialogController as vm',
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

                scope.updateFilters = function(){

                    var filters = scope.evDataService.getFilters();

                    filters.forEach(function (item) {

                        if (scope.filter.key === item.key || scope.filter.id === item.id) {
                            item = Object.assign({}, scope.filter)
                        }

                    });

                    scope.evDataService.setFilters(scope.filters);

                };


                /*scope.noDataForLinkingTo = true;
                var columns = scope.evDataService.getColumns();

                for (var c = 0; c < columns.length; c++) {
                    if (columns[c].key === scope.filter.options.use_from_above) {
                        scope.noDataForLinkingTo = false;
                        break;
                    };
                };*/

                scope.initSplitPanelMode = function () {

                    if (scope.useFromAbove) {

                        scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

                            // TODO leave only key = scope.filter.options.use_from_above.key
                            var key = scope.filter.options.use_from_above;
                            if (typeof scope.filter.options.use_from_above === 'object') {
                                key = scope.filter.options.use_from_above.key;
                            }
                            // < leave only key = scope.filter.options.use_from_above.key >

                            /*scope.noDataForLinkingTo = true;
                            var columns = scope.evDataService.getColumns();
                            var key = scope.filter.options.use_from_above;

                            for (var c = 0; c < columns.length; c++) {
                                if (columns[c].key === key) {
                                    scope.noDataForLinkingTo = false;
                                    break;
                                };
                            };*/

                            if (isUseFromAboveActive() && !scope.noDataForLinkingTo) {

                                var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

                                //scope.attributesFromAbove = scope.evDataService.getAttributesFromAbove();

                                var value = activeObjectFromAbove[key];

                                scope.filter.options.filter_values = [value]; // example value 'Bank 1 Notes 4% USD'

                                scope.updateFilters();

                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                            };

                        });

                    } else {

                        if (isUseFromAboveActive()) {
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