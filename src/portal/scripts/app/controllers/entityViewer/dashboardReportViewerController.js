/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var objectComparison = require('../../helpers/objectsComparisonHelper');

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
        var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

        module.exports = function ($scope, $mdDialog, $transitions) {

            var vm = this;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.startupSettings = null;
            vm.dashboardDataService = null;
            vm.dashboardEventService = null;
            vm.dashboardComponentDataService = null;
            vm.dashboardComponentEventService = null;
            vm.componentType = null;
            vm.matrixSettings = null;

            vm.grandTotalProcessing = true;

            vm.linkedActiveObjects = {}; // If we have several components linked to spit panel;
            var lastActiveComponentId;
            var savedInterfaceLayout;
            var savedAddtions;

            var componentsForLinking = [
                'report_viewer', 'report_viewer_matrix', 'report_viewer_bars_chart', 'report_viewer_pie_chart'
            ];

            var fillInModeEnabled = false;

            if ($scope.$parent.vm.entityViewerDataService) {
                fillInModeEnabled = true;
            }

            vm.setEventListeners = function () {

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    rvDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                    rvDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                    rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                    vm.entityViewerDataService.setDataLoadStatus(false);

                    if (!fillInModeEnabled) {
                        vm.dashboardDataService.setComponentStatus(vm.componentType.data.id, dashboardComponentStatuses.PROCESSING);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    vm.entityViewerDataService.setDataLoadStatus(true);

                    if (!fillInModeEnabled) {
                        vm.dashboardDataService.setComponentStatus(vm.componentType.data.id, dashboardComponentStatuses.ACTIVE);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                    var columns = vm.entityViewerDataService.getColumns();

                    vm.dashboardComponentDataService.setViewerTableColumns(columns);
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {
                    vm.getView()
                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.UPDATE_VIEWER_TABLE_COLUMNS, function () {

                    var columns = vm.dashboardComponentDataService.getViewerTableColumns();
                    vm.entityViewerDataService.setColumns(columns);

                    vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.SAVE_VIEWER_TABLE_CONFIGURATION, function () {

                    var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);
                    // revert options that were change because of dashboard
                    currentLayoutConfig.data.interfaceLayout = savedInterfaceLayout;
                    currentLayoutConfig.data.additions = savedAddtions;

                    if (currentLayoutConfig.hasOwnProperty('id')) {
                        uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function () {
                            vm.entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});
                        });
                    }

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        clickOutsideToClose: false
                    })
                });

                if (vm.componentType.data.type === 'report_viewer_grand_total') {


                    vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        vm.grandTotalProcessing = false;

                        console.log('Grand Total Status: Data is Loaded')

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

                if (componentsForLinking.indexOf(vm.componentType.data.type) !== -1) {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        var componentsOutputs = vm.dashboardDataService.getAllComponentsOutputs();
                        var compsKeys = Object.keys(componentsOutputs);

                        if (compsKeys.length > 0) {
                            compsKeys.forEach(function (compKey) {
                                componentsOutputs[compKey].changedLast = false;
                            });
                            vm.dashboardDataService.setAllComponentsOutputs(componentsOutputs);
                        }

                        var compOutputData = {
                            changedLast: true,
                            data: activeObject
                        };

                        vm.dashboardDataService.setComponentOutput(vm.componentType.data.id, compOutputData);

                        vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentType.data.id);

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

                    // Check are there report datepicker expressions to solve
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
                    // < Check are there report datepicker expressions to solve >
                        resolve();
                    }


                })

            };

            vm.handleDashboardFilterLink = function (filter_link) {

                var filters = vm.entityViewerDataService.getFilters();

                var componentOutput = vm.dashboardDataService.getComponentOutput(filter_link.component_id);

                console.log('filters', filters);
                console.log('componentOutput', componentOutput);

                if (componentOutput && componentOutput.data) {

                    var linkedFilter = filters.find(function (item) {
                        return item.type === 'filter_link' && item.component_id === filter_link.component_id
                    });

                    if (linkedFilter) {

                        linkedFilter.options.filter_values = [componentOutput.data.value];

                        filters = filters.map(function (item) {

                            if (item.type === 'filter_link' && item.component_id === filter_link.component_id) {
                                return linkedFilter
                            }

                            return item
                        })

                    } else {

                        if (filter_link.value_type === 100) {

                            console.log('componentOutput.value', componentOutput.data.value)

                            var values;

                            if (Array.isArray(componentOutput.data.value)) {
                                values = componentOutput.data.value
                            } else {
                                values = [componentOutput.data.value];
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
                                    filter_values: [componentOutput.data.value.toString()]
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

                    vm.entityViewerDataService.setActiveObject(componentOutput.data);
                    vm.entityViewerDataService.setActiveObjectFromAbove(componentOutput.data);

                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
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

                    if (Array.isArray(vm.startupSettings.linked_components.active_object)) {

                        var lastActiveCompChanged = false;

                        for (var i = 0; i < vm.startupSettings.linked_components.active_object.length; i++) {
                            var componentId = JSON.parse(JSON.stringify(vm.startupSettings.linked_components.active_object[i]));

                            var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                            if (componentOutput && componentOutput.changedLast) {

                                var compOutputData = componentOutput.data;

                                if (lastActiveComponentId !== componentId) {
                                    lastActiveComponentId = componentId;
                                    lastActiveCompChanged = true;
                                } else {

                                    if (compOutputData && typeof compOutputData === 'object' &&
                                        vm.linkedActiveObjects[lastActiveComponentId] && typeof vm.linkedActiveObjects[lastActiveComponentId] === 'object') {

                                        if (!objectComparison.comparePropertiesOfObjects(compOutputData, vm.linkedActiveObjects[lastActiveComponentId])) {
                                            lastActiveCompChanged = true;
                                        }

                                    } else if (vm.linkedActiveObjects[lastActiveComponentId] !== compOutputData) {
                                        lastActiveCompChanged = true;
                                    }

                                }

                                if (compOutputData !== undefined && compOutputData !== null) {
                                    vm.linkedActiveObjects[lastActiveComponentId] = JSON.parse(JSON.stringify(compOutputData));
                                } else {
                                    vm.linkedActiveObjects[lastActiveComponentId] = null;
                                }

                                break;

                            }
                        }

                        if (lastActiveCompChanged) {
                            vm.handleDashboardActiveObject(lastActiveComponentId);
                        }

                    } else {

                        var componentId = vm.startupSettings.linked_components.active_object;

                        vm.handleDashboardActiveObject(componentId);
                    }

                }

            };

            // TODO DEPRECATED, delete soon as dashboard will be discussed
            /*vm.oldEventExchanges = function () {

                if (vm.startupSettings.linked_components) {

                    console.log('vm.startupSettings.linked_components', vm.startupSettings.linked_components);

                    if (vm.startupSettings.linked_components.hasOwnProperty('active_object')) {

                        var componentId = vm.startupSettings.linked_components.active_object;

                        vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {

                            vm.handleDashboardActiveObject(componentId)

                        })

                    }

                    if (vm.startupSettings.linked_components.hasOwnProperty('report_settings')) {

                        Object.keys(vm.startupSettings.linked_components.report_settings).forEach(function (property) {

                            var componentId = vm.startupSettings.linked_components.report_settings[property];

                            vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {

                                var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                                var reportOptions = vm.entityViewerDataService.getReportOptions();

                                console.log('componentOutput', componentOutput);

                                reportOptions[property] = componentOutput.value;

                                vm.entityViewerDataService.setReportOptions(reportOptions);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT)

                            })

                        })

                    }

                    if (vm.startupSettings.linked_components.hasOwnProperty('filter_links')) {

                        vm.startupSettings.linked_components.filter_links.forEach(function (filter_link) {

                            vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + filter_link.component_id, function () {

                                vm.handleDashboardFilterLink(filter_link)

                            })
                        })

                    }


                }

                if (vm.componentType.data.type === 'report_viewer' || vm.componentType.data.type === 'report_viewer_matrix') {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        console.log('click report viewer active object', activeObject);

                        vm.dashboardDataService.setComponentOutput(vm.componentType.data.id, activeObject);

                        vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentType.data.id)

                        if(vm.componentType.data.settings.auto_refresh) {

                            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)

                        }

                    });

                }

            }; */

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

                return new Promise(function (resolve, reject) {

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

                        resolve();

                    }).catch(function () {

                        resolve();

                    })

                })

            };

            var setDataFromDashboard = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                vm.startupSettings = $scope.$parent.vm.startupSettings;
                vm.userSettings = $scope.$parent.vm.userSettings;
                vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
                vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;
                vm.dashboardComponentDataService = $scope.$parent.vm.dashboardComponentDataService;
                vm.dashboardComponentEventService = $scope.$parent.vm.dashboardComponentEventService;
                vm.componentType = $scope.$parent.vm.componentType;

                if ((vm.componentType.data.type === 'report_viewer' ||
                    vm.componentType.data.type === 'report_viewer_split_panel') &&
                    vm.userSettings) {
                    // Set attributes available for columns addition
                    if (vm.userSettings.manage_columns && vm.userSettings.manage_columns.length > 0) {
                        vm.attributeDataService.setAttributesAvailableForColumns(vm.userSettings.manage_columns);
                    }

                }

                if (vm.componentType.data.type === 'report_viewer_matrix') {
                    vm.matrixSettings = {
                        top_left_title: vm.componentType.data.settings.top_left_title,
                        number_format: vm.componentType.data.settings.number_format,
                        abscissa: vm.componentType.data.settings.abscissa,
                        ordinate: vm.componentType.data.settings.ordinate,
                        value_key: vm.componentType.data.settings.value_key,
                        subtotal_formula_id: vm.componentType.data.settings.subtotal_formula_id,
                        styles: vm.componentType.data.settings.styles
                    };
                }

                if (vm.componentType.data.type === 'report_viewer_bars_chart') {
                    vm.rvChartsSettings = {
                        bar_name_key: vm.componentType.data.settings.bar_name_key,
                        bar_number_key: vm.componentType.data.settings.bar_number_key,
                        bars_direction: vm.componentType.data.settings.bars_direction,
                        group_number_calc_formula: vm.componentType.data.settings.group_number_calc_formula,
                        min_bar_width: vm.componentType.data.settings.min_bar_width,
                        max_bar_width: vm.componentType.data.settings.max_bar_width,
                        sorting_value_type: vm.componentType.data.settings.sorting_value_type,
                        sorting_type: vm.componentType.data.settings.sorting_type,
                        autocalc_ticks_number: vm.componentType.data.settings.autocalc_ticks_number,
                        ticks_number: vm.componentType.data.settings.ticks_number,
                        crop_tick_text: vm.componentType.data.settings.crop_tick_text,
                        tooltip_font_size: vm.componentType.data.settings.tooltip_font_size,
                        number_format: vm.componentType.data.settings.number_format,
                        abscissa_position: vm.componentType.data.settings.abscissa_position,
                        ordinate_position: vm.componentType.data.settings.ordinate_position,
                    };

                    if (vm.componentType.data.settings.abscissa || vm.componentType.data.settings.ordinate) {
                        vm.rvChartsSettings.bar_name_key = vm.componentType.data.settings.abscissa;
                        vm.rvChartsSettings.bar_number_key = vm.componentType.data.settings.ordinate;
                    }

                }

                if (vm.componentType.data.type === 'report_viewer_pie_chart') {
                    vm.rvChartsSettings = {
                        group_attr: vm.componentType.data.settings.group_attr,
                        number_attr: vm.componentType.data.settings.number_attr,
                        group_number_calc_formula: vm.componentType.data.settings.group_number_calc_formula,
                        show_legends: vm.componentType.data.settings.show_legends,
                        legends_position: vm.componentType.data.settings.legends_position,
                        legends_columns_number: vm.componentType.data.settings.legends_columns_number,
                        number_format: vm.componentType.data.settings.number_format,
                        tooltip_font_size: vm.componentType.data.settings.tooltip_font_size,
                        chart_form: vm.componentType.data.settings.chart_form
                    };
                }

            };

            vm.getView = function () {

                //middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                //vm.splitPanelExchangeService = new SplitPanelExchangeService();
                vm.attributeDataService = new AttributeDataService();


                console.log('$scope.$parent.vm.startupSettings', $scope.$parent.vm.startupSettings);
                console.log('$scope.$parent.vm.componentType', $scope.$parent.vm.componentType);

                setDataFromDashboard();

                vm.entityViewerDataService.setViewContext('dashboard');

                var downloadAttrsPromise = vm.downloadAttributes();
                vm.setEventListeners();

                vm.entityViewerDataService.setEntityType(vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(true);

                if (vm.componentType.data.type === 'report_viewer_split_panel') {
                    vm.entityViewerDataService.setUseFromAbove(true);
                }

                var layoutId = vm.startupSettings.layout;

                var setLayoutPromise = new Promise(function (resolve, reject) {

                    uiService.getListLayoutByKey(layoutId).then(function (data) {

                        //vm.layout = data;

                        vm.setLayout(data).then(function () {

                            // needed to prevent saving layout as collapsed when saving it from dashboard
                            var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();
                            savedInterfaceLayout = JSON.parse(JSON.stringify(interfaceLayout));
                            var additions = vm.entityViewerDataService.getAdditions();
                            savedAddtions = JSON.parse(JSON.stringify(additions));

                            rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                            if (vm.componentType.data.type === 'report_viewer' ||
                                vm.componentType.data.type === 'report_viewer_split_panel') {

                                var evComponents = vm.entityViewerDataService.getComponents();

                                Object.keys(vm.startupSettings.components).forEach(function (key) {

                                    evComponents[key] = vm.startupSettings.components[key]

                                });

                                vm.entityViewerDataService.setComponents(evComponents);
                            }

                            vm.initDashboardExchange();

                            vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            vm.readyStatus.layout = true;

                            resolve();

                            $scope.$apply();

                        });

                    }).catch(function (error) {

                        reject(error);

                    });

                });

                Promise.all([downloadAttrsPromise, setLayoutPromise]).then(function () {

                    vm.dashboardComponentDataService.setEntityViewerDataService(vm.entityViewerDataService);

                    vm.dashboardComponentDataService.setAttributeDataService(vm.attributeDataService);
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED);

                    var columns = vm.entityViewerDataService.getColumns();
                    vm.dashboardComponentDataService.setViewerTableColumns(columns);
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

                }).catch(function (error) {

                    vm.dashboardDataService.setComponentStatus(vm.componentType.data.id, dashboardComponentStatuses.ERROR);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    console.log("dashboard report viewer component promise error", error);
                });

            };

            var getViewInsideFilledInComponent = function () {

                vm.entityViewerDataService = $scope.$parent.vm.entityViewerDataService;
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = $scope.$parent.vm.attributeDataService;

                setDataFromDashboard();
                vm.setEventListeners();

                vm.readyStatus.layout = true;
                vm.readyStatus.attributes = true;

                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                vm.entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

                vm.dashboardComponentDataService.setAttributeDataService(vm.attributeDataService);
                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED);

            };

            vm.init = function () {

                if (fillInModeEnabled) {

                    getViewInsideFilledInComponent();

                } else {
                    vm.getView();
                }

            };

            vm.init();

        }

    }()
);