(function () {

    /**
     * Created by szhitenev on 19.08.2023.
     */

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var evEvents = require('../../services/entityViewerEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var utilsHelper = require('../../helpers/utils.helper').default;

    module.exports = function ($mdDialog, dashboardHelper, entityResolverService) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-apex-chart-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
                fillInModeData: '=?' // data about component inside tabs for filled in component
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: 'processing',
                    disabled: false
                };

                scope.lastSavedOutput = {};

                scope.retryCount = 0;
                scope.maxRetries = 10;

                var componentData;
                var componentElem = elem[0].querySelector('.dashboardComponent');

                if (scope.item && scope.item.data) {
                    componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.chart_custom_name) {
                        scope.customName = componentData.chart_custom_name;
                    }

                }

                if (!componentData.settings.filters) {

                    componentData.settings.filters = {
                        show_filters_area: false,
                        show_use_from_above_filters: false,
                    }

                }

                scope.showFiltersArea = componentData.settings.filters.show_filters_area;
                scope.showUseFromAboveFilters = componentData.settings.filters.show_use_from_above_filters;

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentData: componentData,
                    componentElement: componentElem,
                    entityType: componentData.settings.entity_type,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService
                };

                if (scope.fillInModeData) {
                    scope.vm.entityViewerDataService = scope.fillInModeData.entityViewerDataService;
                    scope.vm.attributeDataService = scope.fillInModeData.attributeDataService;
                }

                scope.enableFillInMode = function () {


                    scope.fillInModeData = {
                        tab_number: scope.tabNumber,
                        row_number: scope.rowNumber,
                        column_number: scope.columnNumber,
                        item: scope.item,
                        entityViewerDataService: entityViewerDataService,
                        attributeDataService: attributeDataService
                    }

                };

                scope.disableFillInMode = function () {
                    scope.fillInModeData = null;
                };

                scope.toggleFilterBlock = function () {
                    dashboardHelper.toggleFilterBlock(scope);
                };

                scope.initEventListeners = function () {

                    // dashboardHelper.initEventListeners(scope);

                    console.log("Apex Event Listeners")

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                        // var componentsOutputs = scope.dashboardDataService.getAllComponentsOutputsByUserCodes();
                        var componentsOutputs = scope.dashboardDataService.getLayoutState();

                        // console.log('apexChart.COMPONENT_OUTPUT_CHANGE', JSON.stringify(componentsOutputs, null, 4));

                        var changed = utilsHelper.hasStateChanged(scope.lastSavedOutput, componentsOutputs, scope.componentData.settings.components_to_listen)

                        if (changed) {
                            scope.initChart({
                                outputs: componentsOutputs
                            })
                        }

                        scope.lastSavedOutput = componentsOutputs;

                    });

                    scope.clearLastSavedOutput = function () {

                        scope.lastSavedOutput = {}

                        scope.initChart({outputs: scope.lastSavedOutput});

                    }

                    // Possible Deprecated
                    // scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_ACTIVE_OBJECT_CHANGE, function () {
                    //
                    //
                    //     if (scope.vm.componentData.settings.linked_components && scope.vm.componentData.settings.linked_components.active_object) {
                    //         for (var i = 0; i < scope.vm.componentData.settings.linked_components.active_object.length; i++) {
                    //
                    //             var componentId = JSON.parse(JSON.stringify(scope.vm.componentData.settings.linked_components.active_object[i]));
                    //
                    //             var componentOutput = scope.dashboardDataService.getComponentOutputOld(componentId);
                    //
                    //             console.log('apexChart.COMPONENT_OUTPUT_ACTIVE_OBJECT_CHANGE.componentOutput', componentOutput);
                    //             //
                    //             scope.initChart({
                    //                 outputs: [componentOutput.data]
                    //             })
                    //
                    //
                    //         }
                    //     }
                    //
                    //
                    // });


                };

                // Needs for user chart logic
                // TODO probably need to move to separate service
                var utils = {
                    getMonthsList: function (date_from, date_to) {
                        let startDate = new Date(date_from);
                        let endDate = new Date(date_to);

                        if (startDate > endDate) {
                            throw new Error('Start date should not be after end date.');
                        }

                        const months = [];
                        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        while (startDate <= endDate) {
                            const year = startDate.getFullYear();
                            const month = startDate.getMonth();
                            const lastDayOfMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the month

                            months.push({
                                month: monthNames[month],
                                monthIndex: month,
                                year: year,
                                month_start: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                                month_end: `${year}-${String(month + 1).padStart(2, '0')}-${lastDayOfMonth}`
                            });

                            startDate.setMonth(startDate.getMonth() + 1); // Move to the next month
                        }

                        return months;
                    },
                    sumItemsByMonth: function (items, date_key, value_key, year, month) {
                        return items
                            .filter(item => {
                                const itemDate = new Date(item[date_key]); // Assuming each transaction has a date field
                                return itemDate.getFullYear() === year && itemDate.getMonth() === month;
                            })
                            .reduce((sum, item) => sum + item[value_key], 0);
                    },
                    countItemsByMonth: function (items, date_key, year, month) {
                        return items
                            .filter(item => {
                                const itemDate = new Date(item[date_key]); // Assuming each transaction has a date field
                                return itemDate.getFullYear() === year && itemDate.getMonth() === month;
                            }).length;
                    },
                    getUniqueValuesForKey: function (items, key) {
                        const valuesSet = new Set();  // Use a Set to ensure unique values
                        items.forEach(transaction => {
                            if (transaction[key]) {
                                valuesSet.add(transaction[key]);
                            }
                        });
                        return [...valuesSet];  // Convert the Set back to an array
                    },
                    joinProperty: function (items, propertyKey, relatedObjects) {
                        return items.map(item => {
                            // Find the related object based on the property key and the corresponding id in the transaction
                            const relatedObject = relatedObjects.find(relatedItem => relatedItem.id === item[propertyKey]);

                            // If found, merge the related object into the transaction
                            if (relatedObject) {
                                return {
                                    ...item,
                                    [propertyKey]: relatedObject // replace the id with the actual related object
                                };
                            }
                            return item; // If not found, return the original transaction
                        });
                    },
                    flattenObject: function (item) {
                        const flattened = {};

                        Object.keys(item).forEach(key => {
                            if (typeof item[key] === 'object' && !Array.isArray(item[key]) && item[key]) {
                                // For nested objects
                                Object.keys(item[key]).forEach(subKey => {
                                    if (subKey === 'attributes' && Array.isArray(item[key][subKey])) {
                                        // Special handling for attributes
                                        item[key][subKey].forEach(attribute => {

                                            if (attribute.attribute_type_object.value_type == 10) {

                                                flattened[`${key}.${subKey}.${attribute.attribute_type_object.user_code}`] = attribute.value_string;

                                            }

                                            if (attribute.attribute_type_object.value_type == 20) {

                                                flattened[`${key}.${subKey}.${attribute.attribute_type_object.user_code}`] = attribute.value_float;

                                            }

                                            if (attribute.attribute_type_object.value_type == 30) {

                                                if (attribute.classifier_object) {
                                                    flattened[`${key}.${subKey}.${attribute.attribute_type_object.user_code}`] = attribute.classifier_object.name;
                                                } else {
                                                    flattened[`${key}.${subKey}.${attribute.attribute_type_object.user_code}`] = null;
                                                }
                                            }

                                            if (attribute.attribute_type_object.value_type == 40) {

                                                flattened[`${key}.${subKey}.${attribute.attribute_type_object.user_code}`] = attribute.value_date;

                                            }


                                        });
                                    } else {
                                        flattened[`${key}.${subKey}`] = item[key][subKey];
                                    }
                                });
                            } else {
                                // For top-level properties
                                flattened[key] = item[key];
                            }
                        });

                        return flattened;
                    },
                    sumByCategory: function (items, category_key, value_key, fallback_category_key = 'Other') {
                        return items.reduce((acc, item) => {

                            let categoryValue = item[category_key];

                            // If the categoryValue is not found, use the fallback_category_key
                            if (categoryValue === undefined) {
                                categoryValue = fallback_category_key;
                            }

                            acc[categoryValue] = (acc[categoryValue] || 0) + (item[value_key] || 0);

                            return acc;

                        }, {});
                    },
                    getYesterdayDate: function () {

                        const today = new Date();

                        // Subtract one day to get yesterday's date
                        today.setDate(today.getDate() - 1);

                        // Format the date in yyyy-mm-dd format
                        const yyyy = today.getFullYear();
                        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
                        const dd = String(today.getDate()).padStart(2, '0');

                        const yesterday = `${yyyy}-${mm}-${dd}`;

                        return yesterday

                    },
                    getMonthName: function (dateString) {
                        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const date = new Date(dateString);
                        return months[date.getMonth()];
                    },
                    roundToTwo: function (num) {
                        return Math.round((num + Number.EPSILON) * 100) / 100;
                    },
                    formatNumberWithApostrophe: function (num) {
                        // Convert number to string and split by decimal
                        const parts = num.toString().split(".");

                        // Use a regex to add the single quote as a thousands separator
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");

                        // Return the formatted number
                        return parts.join(".");
                    },
                    subtractDays: function (dateInput, days) {
                        let date;

                        if (typeof dateInput === 'string') {
                            date = new Date(dateInput);
                        } else if (dateInput instanceof Date) {
                            date = new Date(dateInput.getTime());  // Create a new Date object to avoid modifying the original
                        } else {
                            throw new Error('Invalid date input provided');
                        }

                        date.setDate(date.getDate() - days);
                        return date;
                    },
                    getPreviousMonthDate: function (inputDate) {
                        const dateParts = inputDate.split('-');
                        const year = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10);
                        const day = parseInt(dateParts[2], 10);

                        let prevYear = year;
                        let prevMonth = month - 1;

                        if (prevMonth === 0) {
                            prevMonth = 12;
                            prevYear -= 1;
                        }

                        // Ensure day does not exceed the last day of the previous month
                        const lastDayOfPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
                        const adjustedDay = Math.min(day, lastDayOfPrevMonth);

                        return `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(adjustedDay).padStart(2, '0')}`;
                    },
                    getLastBusinessDayOfPreviousMonth: function (dateInput) {
                        let date;

                        if (typeof dateInput === 'string') {
                            date = new Date(dateInput);
                        } else if (dateInput instanceof Date) {
                            date = new Date(dateInput.getTime());
                        } else {
                            throw new Error('Invalid date input provided');
                        }

                        // Set the date to the 1st of the current month
                        date.setDate(1);

                        // Move back one day to get the last day of the previous month
                        date.setDate(date.getDate() - 1);

                        // Check if the day is a weekend (0 is Sunday, 6 is Saturday)
                        while (date.getDay() === 0 || date.getDay() === 6) {
                            // If it's a weekend, move back one day
                            date.setDate(date.getDate() - 1);
                        }

                        // Format date to yyyy-mm-dd
                        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    }
                }

                scope.initChart = function (filters) {

                    var selector = '.dashboard-apex-chart-' + scope.vm.componentData.id;
                    var chartElement;
                    var chartInstance;


                    try {

                        // document.querySelector(selector).innerHTML = '';
                        chartElement = document.querySelector(selector)
                        if(chartElement) {
                            chartInstance = chartElement.__chart;
                        }

                    } catch (error) {

                        scope.retryCount = scope.retryCount + 1;

                        if (scope.retryCount < scope.maxRetries) {
                            setTimeout(function () {
                                scope.initChart(filters);
                            }, 100)
                        } else {
                            console.error("Could not start apex component", error);
                        }

                        return

                    }

                    // Now, you can destroy it:
                    if (chartInstance) {
                        chartInstance.destroy();
                    }
                    if(chartElement) {
                        chartElement.innerHTML = '';
                    }

                    utils['_finmars_prevent_from_builder_remove'] = true; // it needed to prevent build remove of utils (of unused variable) it need to be use inside eval

                    setTimeout( () => {
                        console.warn("Evaluating Chart source code")
                        console.log('utils', utils);
                        eval(scope.vm.componentData.source) // TODO dangerous operation, consider refactor
                    }, 100);

                }

                scope.init = function () {

                    console.log("Apex Chart vm", scope.vm);

                    scope.readyStatus.data = 'ready';

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    // var componentsOutputs = scope.dashboardDataService.getAllComponentsOutputsByUserCodes();
                    var componentsOutputs = scope.dashboardDataService.getLayoutState();

                    scope.lastSavedOutput = componentsOutputs;

                    scope.initChart({outputs: componentsOutputs});

                    scope.initEventListeners(); // init listeners after component init

                };

                scope.dashboardInit = function () {

                    // Component put himself in INIT Status
                    // so that dashboard manager can start processing it
                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.retryCount = 0;

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        scope.init();

                    })

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) {
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                            scope.init();
                        }

                    });

                }

                scope.dashboardInit();

            }
        }
    }
}());