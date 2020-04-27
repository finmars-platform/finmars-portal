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
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        var rvDataHelper = require('../../helpers/rv-data.helper');

        var renderHelper = require('../../helpers/render.helper');
        var dashboardHelper = require('../../helpers/dashboard.helper');

        var dashboardEvents = require('../../services/dashboard/dashboardEvents');
        var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

        module.exports = function ($scope, $mdDialog, $transitions) {

            var vm = this;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.componentData = null;
            vm.dashboardDataService = null;
            vm.dashboardEventService = null;
            vm.dashboardComponentDataService = null;
            vm.dashboardComponentEventService = null;
            vm.matrixSettings = null;

            vm.grandTotalProcessing = true;

            vm.linkedActiveObjects = {}; // If we have several components linked to spit panel;
            var lastActiveComponentId;
            var savedInterfaceLayout;
            var savedAddtions;

            var componentsForLinking = dashboardHelper.getComponentsForLinking();
            var gotActiveObjectFromLinkedComp = false;

            var fillInModeEnabled = false;

            if ($scope.$parent.vm.entityViewerDataService) {
                fillInModeEnabled = true;
            }

            vm.updateGrandTotalComponent = function(){

                rvDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                vm.grandTotalProcessing = false;

                console.log('Grand Total Status: Data is Loaded');

                var rootGroup = vm.entityViewerDataService.getRootGroup();

                var flatList = rvDataHelper.getFlatStructure(vm.entityViewerDataService);

                console.log('Grand Total Status: rootGroup', rootGroup);
                console.log('Grand Total Status: flatList', flatList);

                var root = flatList[0];

                var column_key = vm.componentData.settings.grand_total_column;

                var val = root.subtotal[column_key];

                vm.grandTotalNegative = false;

                if (vm.componentData.settings.number_format) {

                    if (vm.componentData.settings.number_format.negative_color_format_id === 1) {

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
                        report_settings: vm.componentData.settings.number_format
                    });

                } else {
                    vm.grandTotalValue = val
                }

                console.log('vm.grandTotalValue', vm.grandTotalValue);

                // $scope.$apply();

            };

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
                        vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.PROCESSING);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    vm.entityViewerDataService.setDataLoadStatus(true);

                    if (!fillInModeEnabled) {
                        vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ACTIVE);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                    var columns = vm.entityViewerDataService.getColumns();

                    vm.dashboardComponentDataService.setViewerTableColumns(columns);
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

                });



                if (vm.componentData.type === 'report_viewer_grand_total') {


                    vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        vm.updateGrandTotalComponent();

                    })

                }

                if (componentsForLinking.indexOf(vm.componentData.type) !== -1) {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', vm.componentData.type);
                        console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', gotActiveObjectFromLinkedComp);

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        if (!gotActiveObjectFromLinkedComp) {

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

                            vm.dashboardDataService.setComponentOutput(vm.componentData.id, compOutputData);

                            vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id);

                            if (vm.componentData.settings.auto_refresh) {

                                vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)

                            }


                        } else {
                            gotActiveObjectFromLinkedComp = false;
                        }

                        if (vm.componentData.type === 'report_viewer_grand_total') {

                            vm.updateGrandTotalComponent();
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

                gotActiveObjectFromLinkedComp = true;
                var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                console.log('COMPONENT_VALUE_CHANGED_' + componentId, componentOutput);

                //if (vm.componentData.type === 'report_viewer_split_panel' && componentOutput) {
                if (componentOutput) {

                    vm.entityViewerDataService.setActiveObject(componentOutput.data);
                    vm.entityViewerDataService.setActiveObjectFromAbove(componentOutput.data);

                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                }

            };

            vm.applyDashboardChanges = function () {

                console.log('applyDashboardChanges.vm.componentData', vm.componentData)

                if (vm.componentData.settings.linked_components.hasOwnProperty('filter_links')) {

                    vm.componentData.settings.linked_components.filter_links.forEach(function (filter_link) {
                        vm.handleDashboardFilterLink(filter_link)
                    });

                }

                if (vm.componentData.settings.linked_components.hasOwnProperty('report_settings')) {

                    Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {

                        var componentId = vm.componentData.settings.linked_components.report_settings[property];

                        var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                        if (componentOutput && componentOutput.data) {

                            var reportOptions = vm.entityViewerDataService.getReportOptions();

                            // console.log('reportOptions', reportOptions);
                            // console.log('componentOutput', componentOutput);
                            //
                            // console.log('reportOptions[property]', reportOptions[property]);
                            // console.log('componentOutput.data.value', componentOutput.data.value);

                            if (reportOptions[property] !== componentOutput.data.value) {

                                reportOptions[property] = componentOutput.data.value;

                                vm.entityViewerDataService.setReportOptions(reportOptions);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                            }

                        }


                    })

                }

                if (vm.componentData.settings.linked_components.hasOwnProperty('active_object')) {

                    if (Array.isArray(vm.componentData.settings.linked_components.active_object)) {

                        var lastActiveCompChanged = false;

                        for (var i = 0; i < vm.componentData.settings.linked_components.active_object.length; i++) {
                            var componentId = JSON.parse(JSON.stringify(vm.componentData.settings.linked_components.active_object[i]));

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

                        var componentId = vm.componentData.settings.linked_components.active_object;

                        vm.handleDashboardActiveObject(componentId);
                    }

                }

            };

            // TODO DEPRECATED, delete soon as dashboard will be discussed
            /*vm.oldEventExchanges = function () {

                if (vm.componentData.settings.linked_components) {

                    console.log('vm.componentData.settings.linked_components', vm.componentData.settings.linked_components);

                    if (vm.componentData.settings.linked_components.hasOwnProperty('active_object')) {

                        var componentId = vm.componentData.settings.linked_components.active_object;

                        vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {

                            vm.handleDashboardActiveObject(componentId)

                        })

                    }

                    if (vm.componentData.settings.linked_components.hasOwnProperty('report_settings')) {

                        Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {

                            var componentId = vm.componentData.settings.linked_components.report_settings[property];

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

                    if (vm.componentData.settings.linked_components.hasOwnProperty('filter_links')) {

                        vm.componentData.settings.linked_components.filter_links.forEach(function (filter_link) {

                            vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + filter_link.component_id, function () {

                                vm.handleDashboardFilterLink(filter_link)

                            })
                        })

                    }


                }

                if (vm.componentData.type === 'report_viewer' || vm.componentData.type === 'report_viewer_matrix') {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        console.log('click report viewer active object', activeObject);

                        vm.dashboardDataService.setComponentOutput(vm.componentData.id, activeObject);

                        vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id)

                        if(vm.componentData.settings.auto_refresh) {

                            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)

                        }

                    });

                }

            }; */

            vm.initDashboardExchange = function () {

                // vm.oldEventExchanges()
                var clearUseFromAboveFilters = function () {

                    vm.entityViewerDataService.setActiveObject(null);
                    vm.entityViewerDataService.setActiveObjectFromAbove(null);

                    console.log('CLEARED ACTIVE OBJECT ', vm.entityViewerDataService.getActiveObject());
                    console.log('CLEARED ACTIVE OBJECT FROM ABOVE ', vm.entityViewerDataService.getActiveObjectFromAbove());

                    vm.entityViewerEventService.dispatchEvent(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS);

                };

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

                });

                vm.dashboardEventService.addEventListener(dashboardEvents.CLEAR_ACTIVE_TAB_USE_FROM_ABOVE_FILTERS, function () {
                    var activeTab = vm.dashboardDataService.getActiveTab();

                    if (activeTab.tab_number === $scope.$parent.vm.tabNumber) {
                        clearUseFromAboveFilters();
                    }
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

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS, clearUseFromAboveFilters);

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

                    }).catch(function (error) {

                        resolve({errorObj: error, errorCause: 'dynamicAttributes'});

                    })

                })

            };

            var setDataFromDashboard = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                vm.componentData = $scope.$parent.vm.componentData;
                vm.userSettings = vm.componentData.user_settings;
                vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
                vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;
                vm.dashboardComponentDataService = $scope.$parent.vm.dashboardComponentDataService;
                vm.dashboardComponentEventService = $scope.$parent.vm.dashboardComponentEventService;

                if ((vm.componentData.type === 'report_viewer' ||
                    vm.componentData.type === 'report_viewer_split_panel') &&
                    vm.userSettings) {
                    // Set attributes available for columns addition
                    if (vm.userSettings.manage_columns && vm.userSettings.manage_columns.length > 0) {
                        vm.attributeDataService.setAttributesAvailableForColumns(vm.userSettings.manage_columns);
                    }

                    if (vm.componentData.settings.styles && vm.componentData.settings.styles.cell.text_align) {
                        vm.entityViewerDataService.dashboard.setColumnsTextAlign(vm.componentData.settings.styles.cell.text_align);
                    }
                    /*if (vm.userSettings.hidden_columns && vm.userSettings.hidden_columns.length > 0) {
                        vm.entityViewerDataService.setKeysOfColumnsToHide(vm.userSettings.hidden_columns);
                    }*/

                }

                if (vm.componentData.type === 'report_viewer_matrix') {
                    vm.matrixSettings = {
                        top_left_title: vm.componentData.settings.top_left_title,
                        number_format: vm.componentData.settings.number_format,
                        abscissa: vm.componentData.settings.abscissa,
                        ordinate: vm.componentData.settings.ordinate,
                        value_key: vm.componentData.settings.value_key,
                        subtotal_formula_id: vm.componentData.settings.subtotal_formula_id,
                        matrix_view: vm.componentData.settings.matrix_view,
                        styles: vm.componentData.settings.styles
                    };
                }

                if (vm.componentData.type === 'report_viewer_bars_chart') {
                    vm.rvChartsSettings = {
                        bar_name_key: vm.componentData.settings.bar_name_key,
                        bar_number_key: vm.componentData.settings.bar_number_key,
                        bars_direction: vm.componentData.settings.bars_direction,
                        group_number_calc_formula: vm.componentData.settings.group_number_calc_formula,
                        min_bar_width: vm.componentData.settings.min_bar_width,
                        max_bar_width: vm.componentData.settings.max_bar_width,
                        sorting_value_type: vm.componentData.settings.sorting_value_type,
                        sorting_type: vm.componentData.settings.sorting_type,
                        autocalc_ticks_number: vm.componentData.settings.autocalc_ticks_number,
                        ticks_number: vm.componentData.settings.ticks_number,
                        crop_tick_text: vm.componentData.settings.crop_tick_text,
                        tooltip_font_size: vm.componentData.settings.tooltip_font_size,
                        number_format: vm.componentData.settings.number_format,
                        abscissa_position: vm.componentData.settings.abscissa_position,
                        ordinate_position: vm.componentData.settings.ordinate_position,
                    };

                    if (vm.componentData.settings.abscissa || vm.componentData.settings.ordinate) {
                        vm.rvChartsSettings.bar_name_key = vm.componentData.settings.abscissa;
                        vm.rvChartsSettings.bar_number_key = vm.componentData.settings.ordinate;
                    }

                }

                if (vm.componentData.type === 'report_viewer_pie_chart') {
                    vm.rvChartsSettings = {
                        group_attr: vm.componentData.settings.group_attr,
                        number_attr: vm.componentData.settings.number_attr,
                        group_number_calc_formula: vm.componentData.settings.group_number_calc_formula,
                        show_legends: vm.componentData.settings.show_legends,
                        legends_font_size: vm.componentData.settings.legends_font_size,
                        legends_position: vm.componentData.settings.legends_position,
                        legends_columns_number: vm.componentData.settings.legends_columns_number,
                        number_format: vm.componentData.settings.number_format,
                        tooltip_font_size: vm.componentData.settings.tooltip_font_size,
                        chart_form: vm.componentData.settings.chart_form
                    };
                }

            };

            vm.getView = function () {

                //middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = new AttributeDataService();

                //console.log('$scope.$parent.vm.componentData', $scope.$parent.vm.componentData);

                setDataFromDashboard();

                vm.entityViewerDataService.setViewContext('dashboard');

                var downloadAttrsPromise = vm.downloadAttributes();
                vm.setEventListeners();

                vm.entityViewerDataService.setEntityType(vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(true);

                /*if (vm.componentData.type === 'report_viewer_split_panel') {
                    vm.entityViewerDataService.setUseFromAbove(true);
                }*/
                vm.entityViewerDataService.setUseFromAbove(true);

                var layoutId = vm.componentData.settings.layout;

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

                            if (vm.componentData.type === 'report_viewer' ||
                                vm.componentData.type === 'report_viewer_split_panel') {

                                var evComponents = vm.entityViewerDataService.getComponents();

                                Object.keys(vm.componentData.settings.components).forEach(function (key) {

                                    evComponents[key] = vm.componentData.settings.components[key]

                                });

                                vm.entityViewerDataService.setComponents(evComponents);
                            }

                            vm.initDashboardExchange();

                            vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            vm.readyStatus.layout = true;

                            $scope.$apply();

                            resolve();

                        });

                    }).catch(function (error) {

                        reject({errorObj: error, errorCause: 'layout'});

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

                    if (error.errorCause === 'layout') {
                        vm.dashboardDataService.setComponentError(vm.componentData.id,{displayMessage: 'failed to load report layout'});
                    }
                    vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ERROR);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    console.log("ERROR: dashboard component that uses report viewer error", error);
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