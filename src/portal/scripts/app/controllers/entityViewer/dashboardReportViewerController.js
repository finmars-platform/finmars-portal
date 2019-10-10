/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var evHelperService = require('../../services/entityViewerHelperService');

        var priceHistoryService = require('../../services/priceHistoryService');
        var currencyHistoryService = require('../../services/currencyHistoryService');

        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var SplitPanelExchangeService = require('../../services/groupTable/exchangeWithSplitPanelService');
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        var rvDataHelper = require('../../helpers/rv-data.helper');

        var renderHelper = require('../../helpers/render.helper');

        var dashboardEvents = require('../../services/dashboard/dashboardEvents');
        var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses')

        module.exports = function ($scope, $mdDialog, $transitions) {

            var vm = this;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.startupSettings = null;
            vm.dashboardDataService = null;
            vm.dashboardEventService = null;
            vm.componentType = null;
            vm.matrixSettings = null;

            vm.grandTotalProcessing = true;

            vm.setEventListeners = function () {

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    rvDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                    rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                    vm.dashboardDataService.setComponentStatus(vm.componentType.data.id, dashboardComponentStatuses.PROCESSING)
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE)

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    vm.dashboardDataService.setComponentStatus(vm.componentType.data.id, dashboardComponentStatuses.ACTIVE)

                    console.log('vm.componentType.ACTIVE');
                    console.log('vm.componentType.id', vm.componentType.data.id);
                    console.log('vm.componentType.data', vm.componentType.data.name);

                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE)

                });

                if (vm.componentType.data.type === 'report_viewer_grand_total') {


                    vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        vm.grandTotalProcessing = false;

                        console.log('Grand Total Status: Data is Loaded');

                        var rootGroup = vm.entityViewerDataService.getRootGroup();

                        var flatList = rvDataHelper.getFlatStructure(vm.entityViewerDataService);

                        console.log('Grand Total Status: rootGroup', rootGroup);
                        console.log('Grand Total Status: flatList', flatList);

                        var root = flatList[0];

                        var column_key = vm.componentType.data.settings.grand_total_column;

                        var val = root.subtotal[column_key];

                        vm.grandTotalNegative = false;

                        if (vm.componentType.data.settings.number_format) {

                            if (vm.componentType.data.settings.number_format.negative_color_format_id === 1) {

                                if (val % 1 === 0) { // check whether number is float or integer
                                    if (parseInt(val) < 0) {
                                        vm.grandTotalNegative = true
                                    }
                                } else {
                                    if (parseFloat(val) < 0) {
                                        vm.grandTotalNegative = true
                                    }
                                }
                            }

                            vm.grandTotalValue = renderHelper.formatValue({
                                value: val
                            }, {
                                key: 'value',
                                report_settings: vm.componentType.data.settings.number_format
                            });

                        } else {
                            vm.grandTotalValue = val
                        }

                        $scope.$apply();


                    })

                }

                if (vm.componentType.data.type === 'report_viewer' || vm.componentType.data.type === 'report_viewer_matrix') {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        console.log('click report viewer active object', activeObject);

                        vm.dashboardDataService.setComponentOutput(vm.componentType.data.id, activeObject);

                        vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentType.data.id)

                        if (vm.componentType.data.settings.auto_refresh) {

                            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)

                        }

                    });

                }

            };

            vm.setLayout = function (layout) {

                return new Promise(function (resolve, reject) {

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

                    var reportOptions = vm.entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                    // Check if there is need to solve report datepicker expression
                    if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                        var reportFirstDatepickerExpression = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // field for the first datepicker in reports with two datepickers, e.g. p&l report
                        var reportLastDatepickerExpression = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression;

                        if (reportFirstDatepickerExpression || reportLastDatepickerExpression) {

                            var datepickerExpressionsToSolve = [];

                            if (reportFirstDatepickerExpression) {

                                var solveFirstExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportFirstDatepickerExpression}).then(function (data) {
                                        reportOptions.pl_first_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveFirstExpression());
                            }

                            if (reportLastDatepickerExpression) {

                                var solveLastExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportLastDatepickerExpression}).then(function (data) {
                                        reportOptions.report_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveLastExpression());
                            }

                            Promise.all(datepickerExpressionsToSolve).then(function () {

                                resolve();

                            });


                        } else {

                            resolve();
                        }

                    } else {

                        resolve();

                    }


                })

            };

            vm.handleDashboardFilterLink = function (filter_link) {

                var filters = vm.entityViewerDataService.getFilters();

                var componentOutput = vm.dashboardDataService.getComponentOutput(filter_link.component_id);

                console.log('filters', filters);
                console.log('componentOutput', componentOutput);

                if (componentOutput) {

                    var linkedFilter = filters.find(function (item) {
                        return item.type === 'filter_link' && item.component_id === filter_link.component_id
                    });

                    if (linkedFilter) {

                        linkedFilter.options.filter_values = [componentOutput.value];

                        filters = filters.map(function (item) {

                            if (item.type === 'filter_link' && item.component_id === filter_link.component_id) {
                                return linkedFilter
                            }

                            return item
                        })

                    } else {

                        if (filter_link.value_type === 100) {

                            console.log('componentOutput.value', componentOutput.value);

                            var values;

                            if (Array.isArray(componentOutput.value)) {
                                values = componentOutput.value
                            } else {
                                values = [componentOutput.value];
                            }

                            console.log('values', values);

                            linkedFilter = {
                                type: 'filter_link',
                                component_id: filter_link.component_id,
                                key: filter_link.key,
                                name: filter_link.key,
                                value_type: filter_link.value_type,
                                options: {
                                    enabled: true,
                                    exclude_empty_cells: true,
                                    filter_type: 'multiselector',
                                    filter_values: values
                                }
                            };

                        } else {

                            linkedFilter = {
                                type: 'filter_link',
                                component_id: filter_link.component_id,
                                key: filter_link.key,
                                name: filter_link.key,
                                value_type: filter_link.value_type,
                                options: {
                                    enabled: true,
                                    exclude_empty_cells: true,
                                    filter_type: 'contains',
                                    filter_values: [componentOutput.value.toString()]
                                }
                            };

                        }

                        filters.push(linkedFilter)
                    }


                    vm.entityViewerDataService.setFilters(filters);

                    vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

            };

            vm.handleDashboardActiveObject = function (componentId) {

                var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                console.log('COMPONENT_VALUE_CHANGED_' + componentId, componentOutput);

                if (vm.componentType.data.type === 'report_viewer_split_panel' && componentOutput) {

                    vm.entityViewerDataService.setActiveObject(componentOutput);
                    vm.entityViewerDataService.setActiveObjectFromAbove(componentOutput);

                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE)
                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                }

            };

            vm.applyDashboardChanges = function () {

                if (vm.startupSettings.linked_components.hasOwnProperty('filter_links')) {

                    vm.startupSettings.linked_components.filter_links.forEach(function (filter_link) {

                        vm.handleDashboardFilterLink(filter_link)

                    });

                }

                if (vm.startupSettings.linked_components.hasOwnProperty('report_settings')) {

                    Object.keys(vm.startupSettings.linked_components.report_settings).forEach(function (property) {

                        var componentId = vm.startupSettings.linked_components.report_settings[property];

                        var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                        if (componentOutput) {

                            var reportOptions = vm.entityViewerDataService.getReportOptions();

                            console.log('reportOptions', reportOptions);
                            console.log('componentOutput', componentOutput);

                            if (reportOptions[property] !== componentOutput.value) {

                                reportOptions[property] = componentOutput.value;

                                vm.entityViewerDataService.setReportOptions(reportOptions);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT)

                            }

                        }


                    })

                }

                if (vm.startupSettings.linked_components.hasOwnProperty('active_object')) {

                    var componentId = vm.startupSettings.linked_components.active_object;

                    vm.handleDashboardActiveObject(componentId);

                }

            };

            // TODO DEPRECATED, delete soon as dashboard will be discussed
            vm.oldEventExchanges = function () {

                // if (vm.startupSettings.linked_components) {
                //
                //     console.log('vm.startupSettings.linked_components', vm.startupSettings.linked_components);
                //
                //     if (vm.startupSettings.linked_components.hasOwnProperty('active_object')) {
                //
                //         var componentId = vm.startupSettings.linked_components.active_object;
                //
                //         vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {
                //
                //             vm.handleDashboardActiveObject(componentId)
                //
                //         })
                //
                //     }
                //
                //     if (vm.startupSettings.linked_components.hasOwnProperty('report_settings')) {
                //
                //         Object.keys(vm.startupSettings.linked_components.report_settings).forEach(function (property) {
                //
                //             var componentId = vm.startupSettings.linked_components.report_settings[property];
                //
                //             vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {
                //
                //                 var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);
                //
                //                 var reportOptions = vm.entityViewerDataService.getReportOptions();
                //
                //                 console.log('componentOutput', componentOutput);
                //
                //                 reportOptions[property] = componentOutput.value;
                //
                //                 vm.entityViewerDataService.setReportOptions(reportOptions);
                //
                //                 vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT)
                //
                //             })
                //
                //         })
                //
                //     }
                //
                //     if (vm.startupSettings.linked_components.hasOwnProperty('filter_links')) {
                //
                //         vm.startupSettings.linked_components.filter_links.forEach(function (filter_link) {
                //
                //             vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + filter_link.component_id, function () {
                //
                //                 vm.handleDashboardFilterLink(filter_link)
                //
                //             })
                //         })
                //
                //     }
                //
                //
                // }
                //
                // if (vm.componentType.data.type === 'report_viewer' || vm.componentType.data.type === 'report_viewer_matrix') {
                //
                //     vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {
                //
                //         var activeObject = vm.entityViewerDataService.getActiveObject();
                //
                //         console.log('click report viewer active object', activeObject);
                //
                //         vm.dashboardDataService.setComponentOutput(vm.componentType.data.id, activeObject);
                //
                //         vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentType.data.id)
                //
                //         if(vm.componentType.data.settings.auto_refresh) {
                //
                //             vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
                //
                //         }
                //
                //     });
                //
                // }

            };

            vm.initDashboardExchange = function () {

                // vm.oldEventExchanges()


                vm.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                    vm.applyDashboardChanges();

                });

                vm.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ACTIVE_TAB, function () {

                    var activeTab = vm.dashboardDataService.getActiveTab();

                    console.log('activeTab', activeTab.tab_number);
                    console.log('$scope.$parent.vm.tabNumber', $scope.$parent.vm.tabNumber);

                    if (activeTab.tab_number === $scope.$parent.vm.tabNumber) {

                        vm.applyDashboardChanges()

                    }

                })

            };

            vm.downloadAttributes = function () {

                var promises = [];

                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('balance-report'));
                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('pl-report'));
                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('transaction-report'));

                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('portfolio'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('account'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('instrument'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('responsible'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('counterparty'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('transaction-type'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('complex-transaction'));

                if (vm.entityType === 'balance-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                }

                if (vm.entityType === 'pl-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                }

                if (vm.entityType === 'transaction-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                    promises.push(vm.attributeDataService.downloadTransactionUserFields());
                }

                Promise.all(promises).then(function (data) {

                    vm.readyStatus.attributes = true;
                    $scope.$apply();

                })

            };

            vm.getView = function () {

                middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.splitPanelExchangeService = new SplitPanelExchangeService();
                vm.attributeDataService = new AttributeDataService();


                console.log('$scope.$parent.vm.startupSettings', $scope.$parent.vm.startupSettings);
                console.log('$scope.$parent.vm.componentType', $scope.$parent.vm.componentType);

                vm.entityType = $scope.$parent.vm.entityType;
                vm.startupSettings = $scope.$parent.vm.startupSettings;
                vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
                vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;
                vm.componentType = $scope.$parent.vm.componentType;

                vm.downloadAttributes();
                vm.setEventListeners();

                vm.entityViewerDataService.setEntityType(vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(true);

                if (vm.componentType.data.type === 'report_viewer_split_panel') {
                    vm.entityViewerDataService.setUseFromAbove(true);
                }

                var layoutId = vm.startupSettings.layout;

                if (vm.componentType.data.type === 'report_viewer_matrix') {
                    vm.matrixSettings = {
                        top_left_title: vm.componentType.data.settings.top_left_title,
                        number_format: vm.componentType.data.settings.number_format,
                        abscissa: vm.componentType.data.settings.abscissa,
                        ordinate: vm.componentType.data.settings.ordinate,
                        value_key: vm.componentType.data.settings.value_key
                    };
                };

                if (vm.componentType.data.type === 'report_viewer_bars_chart') {
                    vm.rvChartsSettings = {
                        abscissa: vm.componentType.data.settings.abscissa,
                        ordinate: vm.componentType.data.settings.ordinate,
                        bars_direction: vm.componentType.data.settings.bars_direction,
                        group_number_calc_formula: vm.componentType.data.settings.group_number_calc_formula,
                        min_bar_width: vm.componentType.data.settings.min_bar_width,
                        max_bar_width: vm.componentType.data.settings.max_bar_width,
                        sorting_value_type: vm.componentType.data.settings.sorting_value_type,
                        sorting_type: vm.componentType.data.settings.sorting_type,
                        ticks_number: vm.componentType.data.settings.ticks_number,
                        crop_tick_text: vm.componentType.data.settings.crop_tick_text
                    };

                };

                if (vm.componentType.data.type === 'report_viewer_pie_chart') {
                    vm.rvChartsSettings = {
                        //fieldsKeys: vm.componentType.data.settings.fieldsKeys
                        group_attr: vm.componentType.data.settings.group_attr,
                        number_attr: vm.componentType.data.settings.number_attr,
                        group_number_calc_formula: vm.componentType.data.settings.group_number_calc_formula,
                        show_legends: vm.componentType.data.settings.show_legends,
                        legends_position: vm.componentType.data.settings.legends_position
                    };
                };

                uiService.getListLayoutByKey(layoutId).then(function (data) {

                    vm.layout = data;

                    vm.setLayout(data).then(function () {


                        // if (vm.componentType.data.type === 'report_viewer' ||
                        //     vm.componentType.data.type === 'report_viewer_grand_total' ||
                        //     vm.componentType.data.type === 'report_viewer_matrix') {

                        rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        // }


                        if (vm.componentType.data.type === 'report_viewer' || vm.componentType.data.type === 'report_viewer_split_panel') {

                            var evComponents = vm.entityViewerDataService.getComponents();

                            Object.keys(vm.startupSettings.components).forEach(function (key) {

                                evComponents[key] = vm.startupSettings.components[key]

                            });

                            vm.entityViewerDataService.setComponents(evComponents);
                        }

                        // if (vm.componentType.data.type === 'report_viewer_split_panel') {
                        //
                        //     var additions = {
                        //         type: vm.entityType
                        //     };
                        //
                        //     vm.entityViewerDataService.setAdditions(additions)
                        //
                        //
                        // }

                        vm.initDashboardExchange();

                        vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        vm.readyStatus.layout = true;

                        $scope.$apply();

                    })

                })

            };

            vm.init = function () {

                vm.getView();

            };

            vm.init();

        }

    }()
);