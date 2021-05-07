(function () {

    'use strict';

    var rvDataHelper = require('../helpers/rv-data.helper');
    var renderHelper = require('../helpers/render.helper');

    var utilsHelper = require('../helpers/utils.helper');


    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            scope: {
                tableChartSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/report-viewer-table-chart-view.html',
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                scope.processing = true;

                scope.sortKey = 'title_column';
                scope.sortDirection = 'ASC';

                scope.dashboardFilterCollapsed = true;

                scope.viewContext = scope.evDataService.getViewContext();

                scope.availableTitleColumnAttrs = scope.tableChartSettings.available_title_column_keys || [];
                if (scope.availableTitleColumnAttrs.length) scope.availableTitleColumnAttrs = JSON.parse(angular.toJson(scope.availableTitleColumnAttrs));

                scope.availableValueColumnAttrs = scope.tableChartSettings.available_value_column_keys || [];
                if (scope.availableValueColumnAttrs.length) scope.availableValueColumnAttrs = JSON.parse(angular.toJson(scope.availableValueColumnAttrs));


                scope.toggleSort = function (sortKey) {

                    if (scope.sortKey === sortKey) {
                        if (scope.sortDirection === 'ASC') {
                            scope.sortDirection = 'DESC';
                        } else {
                            scope.sortDirection = 'ASC';
                        }
                    } else {
                        scope.sortKey = sortKey
                        scope.sortDirection = 'ASC';
                    }

                    scope.createTable();

                }

                scope.getUniqueValues = function (itemList, key, valueKey) {

                    var result = [];
                    var foundItems = [];

                    itemList.forEach(function (item) {

                        var itemKey = item[key] || '-';
                        var itemTotal = null;

                        if ((item[valueKey] || item[valueKey] === 0) && typeof item[valueKey] === 'number') {
                            itemTotal = item[valueKey];
                        }

                        var itemIndex = foundItems.indexOf(itemKey);

                        if (itemIndex === -1) {

                            var itemObj = {
                                key: itemKey,
                                total: itemTotal
                            }

                            result.push(itemObj);
                            foundItems.push(itemObj.key);

                        } else {

                            if ((itemTotal || itemTotal === 0) && result[itemIndex].total === null) {
                                result[itemIndex].total = 0;
                            }

                            if (itemTotal) {
                                result[itemIndex].total += itemTotal;
                            }

                        }

                    });

                    result = result.sort(function (a, b) {

                        if (a.key.indexOf('-') !== 0 && b.key.indexOf('-') === 0) {
                            return 1;
                        }

                        if (a.key.indexOf('-') === 0 && b.key.indexOf('-') !== 0) {
                            return -1;
                        }

                        if (a.key.indexOf('-') === 0 && b.key.indexOf('-') === 0) { // if both words starts with '-', filter as usual

                            var aWithoutDash = a.key.slice(1);
                            var bWithoutDash = b.key.slice(1);

                            if (aWithoutDash > bWithoutDash) {
                                return 1;
                            }

                            if (aWithoutDash < bWithoutDash) {
                                return -1;
                            }

                        }

                        if (a.key > b.key) {
                            return 1;
                        }

                        if (a.key < b.key) {
                            return -1;
                        }

                        return 0;

                    });

                    return result;

                }

                function randomIntFromInterval(min, max) { // min and max included
                    return Math.floor(Math.random() * (max - min + 1) + min);
                }

                scope.formatValue = function (val, number_format) {

                    var result = val;

                    if (number_format && (val || val === 0)) {

                        result = renderHelper.formatValue(
                            {
                                value: val
                            },
                            {
                                key: 'value',
                                report_settings: number_format
                            }
                        );

                    }

                    if (!result && result !== 0) {
                        return '';
                    }

                    return result;

                };


                scope.createTable = function () {

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    var itemList = flatList.filter(function (item) {
                        return item.___type === 'object';
                    });

                    scope.items = scope.getUniqueValues(itemList, scope.tableChartSettings.title_column, scope.tableChartSettings.value_column)


                    scope.items = scope.items.map(function (item) {

                        if (item.total === null || item.total === undefined || isNaN(item.total)) {
                            item.total = 0;
                        }

                        item.total_formated = scope.formatValue(item.total, scope.tableChartSettings.number_format)

                        return item
                    })

                    console.log('createTable.tableChartSettings', scope.tableChartSettings);
                    console.log('createTable.items', scope.items);

                    var positiveTotal = 0;
                    var negativeTotal = 0;

                    var maxPositive = 0;
                    var maxNegative = 0;

                    scope.hasNegativeValues = false;


                    scope.items.forEach(function (item) {

                        if (item.total > 0) {

                            if (item.total > maxPositive) {
                                maxPositive = item.total;
                            }

                            positiveTotal = positiveTotal + item.total;
                        } else {

                            if (Math.abs(item.total) > maxNegative) {
                                maxNegative = Math.abs(item.total);
                            }

                            negativeTotal = negativeTotal + Math.abs(item.total);
                        }

                    })

                    scope.items = scope.items.map(function (item) {

                        if (item.total > 0) {

                            item.graph_value = Math.ceil(item.total / (positiveTotal / 100))

                        } else if (item.total < 0) {

                            item.graph_value = Math.ceil(Math.abs(item.total) / (negativeTotal / 100))
                            item.is_negative = true;

                            scope.hasNegativeValues = true;

                        } else {
                            item.graph_value = 0;
                        }

                        return item;

                    })

                    scope.items = scope.items.map(function (item) {

                        if (item.is_negative) {

                            if (Math.abs(item.total) === maxNegative) {
                                item.graph_percent = 100;
                            } else {
                                item.graph_percent = Math.ceil(Math.abs(item.total) / (maxNegative / 100))
                            }
                        } else {

                            if (item.total === maxPositive) {
                                item.graph_percent = 100;
                            } else {
                                item.graph_percent = Math.ceil(item.total / (maxPositive / 100))
                            }
                        }

                        return item;

                    })


                    var prop = 'key';

                    if (scope.sortKey === 'title_column') {
                        prop = 'key';
                    }

                    if (scope.sortKey === 'value_column') {
                        prop = 'total';
                    }

                    if (scope.sortKey === 'percent_column') {
                        prop = 'graph_percent';
                    }

                    if (scope.sortDirection === 'DESC') {
                        prop = '-'+prop;
                    }

                    scope.items = utilsHelper.sortItems(scope.items, prop)

                }

                scope.rowClick = function ($event, item) {

                    var activeObject = {};

                    activeObject[scope.tableChartSettings.title_column] = item.key;

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                var formatAttrsForSelector = function (attrsList, selectedAttrKey) {

                    return attrsList.map(attr => {

                        return {
                            name: attr.layout_name || attr.attribute_data.name,
                            id: attr.attribute_data.key,
                            isActive: attr.attribute_data.key === selectedAttrKey
                        };

                    });

                };

                var onAttrsOptionSelect = function (option, key, _$popup) {

                    if (option.id !== scope.tableChartSettings[key]) {

                        scope.tableChartSettings[key] = option.id;
                        scope.createTable();

                        scope.evEventService.dispatchEvent(evEvents.DASHBOARD_COMPONENT_DATA_CHANGED);

                    }

                    _$popup.cancel();

                };

                scope.titleColumnSelectorData = {
                    options: formatAttrsForSelector(scope.availableTitleColumnAttrs, scope.tableChartSettings.title_column),
                    selectOption: function (option, _$popup) {
                        onAttrsOptionSelect(option, 'title_column', _$popup);
                    }
                };

                scope.valueColumnSelectorData = {
                    options: formatAttrsForSelector(scope.availableValueColumnAttrs, scope.tableChartSettings.value_column),
                    selectOption: function (option, _$popup) {
                        onAttrsOptionSelect(option, 'value_column', _$popup);
                    }
                };

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    // If we already have data (e.g. viewType changed) start
                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);

                    console.log('flatList', flatList);

                    if (flatList.length > 1) {

                        scope.processing = false;

                        scope.createTable();

                        /*setTimeout(function () {

                            scope.$apply();

                            initMatrixMethods();
                        }, 0)*/
                    }

                    // If we already have data (e.g. viewType changed) end

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.processing = false;

                        scope.createTable();

                    });

                };

                scope.init();

                scope.$on('$destroy', function () {

                    // window.removeEventListener('resize', scope.alignGrid);
                    //
                    // scope.evEventService.removeEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, clearUseFromAboveFilterId);

                });

            }
        }
    }

}());