/**
 * Created by mevstratov on 27.05.2019.
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
            templateUrl: 'views/directives/reportViewer/userFilters/rv-text-filter-view.html',
            link: function (scope, elem, attrs) {

                console.log("filter filterTextData", scope.filter);

                scope.filters = scope.evDataService.getFilters();

                scope.filterValue = undefined;
                scope.columnRowsContent = [];
                scope.showSelectMenu = false;

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.attributesFromAbove = [];

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

                var filterEnabled = scope.filter.options.enabled;

                scope.getClassesForFilter = function () {
                    var filterClasses = '';

                    if (!scope.filter.options.enabled) {
                        filterClasses = 'f-disabled ';
                    }

                    if (scope.filter.options.hasOwnProperty('use_from_above')) {
                        filterClasses += 'link-to-above-filter ';
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
                        };

                    };

                    return filterRegime;

                };

                scope.getMultiselectorName = function () {
                    var multiselectorName = scope.filter.name + ". " + "Regime = " + scope.filter.options.filter_type;

                    return multiselectorName;
                };

                scope.changeFilterType = function (filterType) {
                    scope.filter.options.filter_type = filterType;
                    if (filterType === 'empty') {
                        scope.filter.options.exclude_empty_cells = false;
                    }
                    scope.filter.options.filter_values = [];
                    scope.filterSettingsChange();
                };

                scope.filterSettingsChange = function () {

                    /*if (scope.filter.options.filter_type === "contains" || scope.filter.option.filter_type === "does_not_contains") {
                        scope.filter.options.filter_values = scope.filter.options.filter_values.toLowerCase();
                    }*/

                    if (scope.filter.options.enabled || filterEnabled) {

                        filterEnabled = scope.filter.options.enabled;

                        scope.evDataService.resetData();
                        scope.evDataService.resetRequestParameters();

                        var rootGroup = scope.evDataService.getRootGroupData();

                        scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                    };

                };

                scope.selectFilterOption = function (selectOption) {

                    scope.filter.options.filter_values[0] = selectOption;
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
                        if (item.name === filter.name) {
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

                scope.openUseFromAboveDialog = function ($event) {

                    console.log('control item', scope.item);
                    console.log('control data', scope.data);

                    $mdDialog.show({
                        controller: 'UseFromAboveDialogController as vm',
                        templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            item: scope.item,
                            data: scope.data
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.item = res.data.item;

                        }

                    });

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