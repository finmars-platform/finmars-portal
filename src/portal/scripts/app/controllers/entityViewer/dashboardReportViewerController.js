/**
 * Created by szhitenev on 05.05.2016.
 */

(function () {

    'use strict';

    var localStorageService = require('../../../../../shell/scripts/app/services/localStorageService');
    var evEvents = require('../../services/entityViewerEvents');
    // var usersService = require('../../services/usersService');
    var objectComparison = require('../../helpers/objectsComparisonHelper');

    var RvSharedLogicHelper = require('../../helpers/rvSharedLogicHelper');
    var EntityViewerDataService = require('../../services/entityViewerDataService');
    var EntityViewerEventService = require('../../services/eventService');
    var AttributeDataService = require('../../services/attributeDataService');

    // var middlewareService = require('../../services/middlewareService');

    var rvDataHelper = require('../../helpers/rv-data.helper');

    var renderHelper = require('../../helpers/render.helper');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    module.exports = function ($scope, $mdDialog, toastNotificationService, usersService, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, customFieldService, attributeTypeService, uiService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper, gFiltersHelper, dashboardHelper) {

        var vm = this;

        var sharedLogicHelper = new RvSharedLogicHelper(vm, $scope, $mdDialog, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper);

        vm.readyStatus = {
            attributes: false,
            layout: false
        };

        vm.processing = false;

        vm.componentData = null;
        vm.dashboardDataService = null;
        vm.dashboardEventService = null;
        vm.dashboardComponentDataService = null;
        vm.dashboardComponentEventService = null;
        vm.matrixSettings = null;

        vm.grandTotalProcessing = true;

        vm.linkedActiveObjects = {}; // If we have several components linked to spit panel;

        var contentType;
        var lastActiveComponentId;
        var savedInterfaceLayout;
        var savedAddtions;

        var componentsForLinking = dashboardHelper.getComponentsForLinking();
        var gotActiveObjectFromLinkedDashboardComp = false;

        var fillInModeEnabled = false;

        if ($scope.$parent.vm.entityViewerDataService) {
            fillInModeEnabled = true;
        }

        vm.hasFiltersArea = function () {
            return ['report_viewer_bars_chart', 'report_viewer_pie_chart', 'report_viewer_matrix', 'report_viewer_table_chart'].includes(vm.componentData.type);
        };

        vm.getOptionsFromDependencies = function () {

            var reportOptions = {};

            console.log('vm.componentData', vm.componentData)
            if (!vm.componentData || !vm.componentData.settings || !vm.componentData.settings.linked_components || !vm.componentData.settings.linked_components.report_settings) {
                return reportOptions;
            }

            Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {


                var componentId = vm.componentData.settings.linked_components.report_settings[property];

                var componentOutput = vm.dashboardDataService.getComponentOutputOld(componentId);

                if (!componentOutput || !componentOutput.data || !componentOutput.data.value) {
                    return reportOptions;
                }

                if (['accounts', 'portfolios', 'strategies1', 'strategies2', 'strategies3'].includes(property) &&
                    !Array.isArray(componentOutput.data.value)) {

                    reportOptions[property] = [componentOutput.data.value]

                } else if (
                    ['report_currency', 'pricing_policy'].includes(property) &&
                    Array.isArray((componentOutput.data.value)) &&
                    componentOutput.data.value.length
                ) {

                    reportOptions[property] = componentOutput.data.value[0]

                } else if (componentOutput.data.value !== null ||
                    componentOutput.data.value !== undefined) {

                    reportOptions[property] = componentOutput.data.value

                }

            });

            return reportOptions;

        }

        var reportDateProperties = {
            'balance-report': [null, 'report_date'],
            'pl-report': ['pl_first_date', 'report_date'],
            'transaction-report': ['begin_date', 'end_date']
        };

        var reportDateIsFromDashboard = function (dashboardReportOptions, dateIndex) {

            var dateProp = reportDateProperties[vm.entityType][dateIndex];
            var roProps = Object.keys(dashboardReportOptions);

            return roProps.includes(dateProp);

        }

        vm.setLayout = function (layout) {

            return new Promise(async function (resolve, reject) {

                if (typeof layout.data.reportLayoutOptions.useDateFromAbove !== 'boolean') {
                    layout.data.reportLayoutOptions.useDateFromAbove = true;
                }

                vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

                var reportOptions = vm.entityViewerDataService.getReportOptions();
                var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                console.log('setLayout.vm.componentData', vm.componentData);
                console.log('setLayout.layout', layout);
                console.log('setLayout.reportOptions', reportOptions);
                var reportOptionsFromDependenciesComponents = vm.getOptionsFromDependencies()
                console.log('setLayout.reportOptionsFromDependenciesComponents', reportOptionsFromDependenciesComponents);

                Object.assign(reportOptions, reportOptionsFromDependenciesComponents);

                // Check are there report datepicker expressions to solve
                if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                    /* var firstDateExpr = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // for pl_first_date, begin_date
                    var secondDateExpr = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression; // for report_date, end_date

                    var dateExprsProms = [];

                    if (firstDateExpr && !reportDateIsFromDashboard(reportOptionsFromDependenciesComponents, 0)) {

                        calculateReportDateExpr(firstDateExpr, reportOptions, 0, dateExprsProms);

                    }

                    if (secondDateExpr && !reportDateIsFromDashboard(reportOptionsFromDependenciesComponents, 1)) {

                        calculateReportDateExpr(secondDateExpr, reportOptions, 1, dateExprsProms);

                    }

                    Promise.all(dateExprsProms).then(function () {
                        resolve();

                    }).catch(function () {
                        resolve();
                    }); */

                    var calcReportDateOptions = {
                        noDateFromExpr: reportDateIsFromDashboard(reportOptionsFromDependenciesComponents, 0),
                        noDateToExpr: reportDateIsFromDashboard(reportOptionsFromDependenciesComponents, 1)
                    }

                    await sharedLogicHelper.calculateReportDatesExprs(calcReportDateOptions);

                    var activeColumnSortProm = new Promise(function (resolve, reject) {

                        var activeColumnSort = vm.entityViewerDataService.getActiveColumnSort();

                        console.log('activeColumnSortProm.activeColumnSort', activeColumnSort);

                        if (activeColumnSort && activeColumnSort.options.sort_settings.layout_user_code) {

                            uiService.getColumnSortDataList({
                                filters: {
                                    user_code: activeColumnSort.options.sort_settings.layout_user_code
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var layout = data.results[0];

                                    console.log('activeColumnSortProm', layout);

                                    vm.entityViewerDataService.setColumnSortData(activeColumnSort.key, layout.data)


                                } else {

                                    toastNotificationService.error("Manual Sort is not configured");

                                    activeColumnSort.options.sort_settings.layout_user_code = null;

                                }

                                resolve()

                            })


                        } else {
                            resolve()
                        }


                    })


                    Promise.all([activeColumnSortProm]).then(function () {
                        resolve();
                    })

                } else {
                    resolve();
                }
                // < Check are there report datepicker expressions to solve >


            })

        };

        vm.handleDashboardFilterLink = function (filter_link) {

            var filters = vm.entityViewerDataService.getFilters();
            var componentOutput = vm.dashboardDataService.getComponentOutputOld(filter_link.component_id);

            console.log('filters', filters);
            console.log('componentOutput', componentOutput);

            if (componentOutput && componentOutput.data) {

                var linkedFilterIndex;
                var linkedFilter = filters.find(function (item, index) {

                    if (item.type === 'filter_link' && item.component_id === filter_link.component_id) {

                        linkedFilterIndex = index;
                        return item;

                    }

                });

                if (linkedFilter) {

                    linkedFilter.options.filter_values = [componentOutput.data.value];

                    if ((linkedFilter.value_type === 100 || linkedFilter.value_type !== 'empty') &&
                        Array.isArray(componentOutput.data.value)) {

                        linkedFilter.options.filter_values = componentOutput.data.value;

                    }

                    filters[linkedFilterIndex] = linkedFilter;

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
                            filter_values: [componentOutput.data.value]
                        }
                    };

                    switch (filter_link.value_type) {

                        case 10:
                        case 30:
                            linkedFilter.options.filter_type = 'contains';
                            break;

                        case 20:
                        case 40:
                            linkedFilter.options.filter_type = 'equal';
                            break;

                        case 100:
                        case 'field':

                            // even if component is single selector, multiselector filter will work
                            // console.log('componentOutput.value', componentOutput.data.value)
                            linkedFilter.value_type = 'field';
                            linkedFilter.options.filter_type = 'multiselector';

                            if (Array.isArray(componentOutput.data.value)) {
                                linkedFilter.options.filter_values = componentOutput.data.value;
                            }

                            break;
                    }

                    filters.push(linkedFilter);

                }

                vm.entityViewerDataService.setFilters(filters);

                vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

            }

        };

        vm.handleDashboardActiveObject = function (componentId) {

            gotActiveObjectFromLinkedDashboardComp = true;
            var componentOutput = vm.dashboardDataService.getComponentOutputOld(componentId);

            console.log('COMPONENT_VALUE_CHANGED_' + componentId, componentOutput);

            //if (vm.componentData.type === 'report_viewer_split_panel' && componentOutput) {
            if (componentOutput) {

                vm.entityViewerDataService.setActiveObject(componentOutput.data);
                vm.entityViewerDataService.setActiveObjectFromAbove(componentOutput.data);

                vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
                vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                var filters = vm.entityViewerDataService.getFilters();
                var useFromAboveFilterIndex = filters.findIndex(function (filter) {

                    return filter.options.use_from_above && Object.keys(filter.options.use_from_above).length && // is use from above filter
                        componentOutput.data && typeof componentOutput.data === 'object' && // active object is an object
                        componentOutput.data.hasOwnProperty(filter.key); // active object contains data for filter

                });

                if (useFromAboveFilterIndex > -1) { // use from above filters will change from active object
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.COMPONENT_BLOCKAGE_ON);
                }

            }

        };

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        // TODO move to utils file
        function isEqual(value1, value2) {
            if (typeof value1 !== typeof value2) return false;
            if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
                if (Array.isArray(value1)) {
                    if (!Array.isArray(value2) || value1.length !== value2.length) return false;
                    for (let i = 0; i < value1.length; i++) {
                        if (!isEqual(value1[i], value2[i])) return false;
                    }
                    return true;
                } else {
                    const keys1 = Object.keys(value1);
                    const keys2 = Object.keys(value2);
                    if (keys1.length !== keys2.length) return false;
                    for (const key of keys1) {
                        if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) return false;
                    }
                    return true;
                }
            }
            return value1 === value2;
        }

        function hasStateChanged(oldState, newState, fieldsToCompare) {
            for (const field of fieldsToCompare) {
                if (!isEqual(oldState[field], newState[field])) {
                    return true; // Change detected
                }
            }
            return false; // No changes detected
        }

        vm.applyDashboardLayoutState = function () {

            var componentsOutputs = vm.dashboardDataService.getLayoutState();

            console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.componentsOutputs", componentsOutputs);

            var changed = hasStateChanged(vm.lastSavedOutput, componentsOutputs, vm.componentData.settings.components_to_listen)

            console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.linked_components", vm.componentData.settings.linked_components);

            if (changed) {

                console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.changed!")

                // TODO some shady logic here, consider refactor
                // settings from controls to reportSettings
                if (vm.componentData.settings.linked_components) {

                    var layoutState = vm.dashboardDataService.getLayoutState();

                    if (vm.componentData.settings.linked_components.report_settings) {

                        var reportOptions = vm.entityViewerDataService.getReportOptions();

                        // Because report could listen both to matrix and controls
                        // when user click on matrix it trigger change,
                        // but here we handle both changes, so we need extra check for ReportSettings change
                        // to ensure that we need to reset Report

                        var reportOptionsChange = false

                        Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (key) {

                            var mapValue = vm.componentData.settings.linked_components.report_settings[key]

                            if (!isEqual(reportOptions[key], layoutState[mapValue])) {
                                reportOptions[key] = layoutState[mapValue];
                                reportOptionsChange = true
                            }

                        })

                        if (reportOptionsChange) {

                            console.log('DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.detect_report_settings_change.RESET_TABLE');

                            vm.processing = true;

                            vm.entityViewerDataService.resetTableContent(true);

                            if (reportOptions) {
                                reportOptions.report_instance_id = null // if clear report_instance_id then we request new Report Calculation
                            }

                            vm.entityViewerDataService.setReportOptions(reportOptions);
                            vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                        }


                    }

                    // Set data to linked filters

                    if (vm.componentData.settings.linked_components.active_object && vm.componentData.settings.linked_components.active_object.length) {

                        var key = vm.componentData.settings.linked_components.active_object[0];

                        var activeObjectData = layoutState[key]

                        console.log('DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.activeObjectData', activeObjectData);

                        vm.entityViewerDataService.setActiveObject(activeObjectData);
                        vm.entityViewerDataService.setActiveObjectFromAbove(activeObjectData);

                        vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
                        vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                        var filters = vm.entityViewerDataService.getFilters();
                        var useFromAboveFilterIndex = filters.findIndex(function (filter) {

                            return filter.options.use_from_above && Object.keys(filter.options.use_from_above).length && // is use from above filter
                                activeObjectData && typeof activeObjectData === 'object' && // active object is an object
                                activeObjectData.hasOwnProperty(filter.key); // active object contains data for filter

                        });

                        if (useFromAboveFilterIndex > -1) { // use from above filters will change from active object
                            vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.COMPONENT_BLOCKAGE_ON);
                        }

                    }

                }

            }

            vm.lastSavedOutput = componentsOutputs

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

            vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                vm.entityViewerDataService.setDataLoadStatus(true);

                vm.processing = false;

                // if (!fillInModeEnabled) {
                vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ACTIVE);
                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                // }

                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.COMPONENT_BLOCKAGE_OFF);

            });

            vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                var columns = vm.entityViewerDataService.getColumns();
                vm.dashboardComponentDataService.setViewerTableColumns(columns);
                //vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

            });

            switch (vm.componentData.type) {

                case 'report_viewer':
                    vm.entityViewerEventService.addEventListener(evEvents.ROWS_ACTION_FIRED, sharedLogicHelper.executeRowAction);
                    break;

            }


            // POSSIBLE DEPRECATED AND TOO HARD TO UNDERSTAND
            vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', vm.componentData.type);
                console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', gotActiveObjectFromLinkedDashboardComp);

                var activeObject = vm.entityViewerDataService.getActiveObject();

                if (!gotActiveObjectFromLinkedDashboardComp) {

                    var componentsOutputs = vm.dashboardDataService.getAllComponentsOutputs();
                    var compsKeys = Object.keys(componentsOutputs);

                    if (compsKeys.length > 0) {

                        compsKeys.forEach(function (compKey) {

                            if (componentsOutputs[compKey]) {

                                componentsOutputs[compKey].changedLast = false;

                            }

                        });

                        vm.dashboardDataService.setAllComponentsOutputs(componentsOutputs);

                    }

                    if (activeObject) {

                        activeObject = JSON.parse(JSON.stringify(activeObject));
                        var reportOptions = vm.entityViewerDataService.getReportOptions();

                        // used by dashboardButtonsSetDirective
                        activeObject.reportOptions = {
                            pricing_policy: reportOptions.pricing_policy,
                            pricing_policy_object: reportOptions.pricing_policy_object,
                        }

                        if (vm.entityType === 'balance-report') {
                            activeObject.reportOptions.report_date = reportOptions.report_date;
                        } else if (vm.entityType === 'pl-report') {
                            activeObject.reportOptions.pl_first_date = reportOptions.pl_first_date;
                            activeObject.reportOptions.report_date = reportOptions.report_date;
                        } else if (vm.entityType === 'transaction-report') {
                            activeObject.reportOptions.end_date = reportOptions.end_date;
                            activeObject.reportOptions.begin_date = reportOptions.begin_date;
                        }

                    }

                    var compOutputData = {
                        changedLast: true,
                        deleteOnChange: true,
                        data: activeObject
                    };

                    vm.dashboardDataService.setComponentOutputOld(vm.componentData.id, compOutputData);

                    vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id);

                    /*if (vm.componentData.settings.auto_refresh) {
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
                    }*/
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_ACTIVE_OBJECT_CHANGE);

                } else {
                    gotActiveObjectFromLinkedDashboardComp = false; // reset variable indicator
                }

                if (vm.componentData.type === 'report_viewer_grand_total') {

                    gFiltersHelper.insertActiveObjectDataIntoFilters(vm.entityViewerDataService, vm.entityViewerEventService);
                    vm.updateGrandTotalComponent();

                }

            });

            // }

            if (fillInModeEnabled) {

                if (vm.componentData.type === 'report_viewer' ||
                    vm.componentData.type === 'report_viewer_split_panel') {

                    vm.entityViewerEventService.addEventListener(evEvents.OPEN_DASHBOARD_COMPONENT_EDITOR, function () {
                        vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.OPEN_COMPONENT_EDITOR);
                    });

                }

            } else {

                vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                    var columns = vm.entityViewerDataService.getColumns();

                    if (vm.componentData.type === 'report_viewer' ||
                        vm.componentData.type === 'report_viewer_split_panel') {
                        vm.userSettings.columns = JSON.parse(angular.toJson(columns));
                    }


                });

                vm.entityViewerEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

                    var columns = vm.entityViewerDataService.getColumns();

                    if (vm.componentData.type === 'report_viewer' ||
                        vm.componentData.type === 'report_viewer_split_panel') {
                        vm.userSettings.columns = JSON.parse(angular.toJson(columns));
                    }

                });
            }

            vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_SHOW_FROM_ABOVE_FILTERS, function () {
                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.TOGGLE_SHOW_FROM_ABOVE_FILTERS);
            })

        };

        vm.initDashboardExchange = function () { // initialize only for components that are not in filled in mode

            // 2023-11-11 szhitenev FN-2320

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                vm.applyDashboardLayoutState();


            });

            //<editor-fold desc="Dashboard component events">
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

                    uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function (layoutData) {

                        var listLayout = vm.entityViewerDataService.getListLayout();

                        listLayout.modified = layoutData.modified
                        currentLayoutConfig.modified = layoutData.modified
                        vm.entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});

                    });

                }

                $mdDialog.show({
                    controller: 'SaveLayoutDialogController as vm',
                    templateUrl: 'views/save-layout-dialog-view.html',
                    clickOutsideToClose: false
                });

            });

            vm.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {
                vm.getView()
            });

            vm.dashboardComponentEventService.addEventListener(dashboardEvents.TOGGLE_FILTER_BLOCK, function () {
                vm.entityViewerEventService.dispatchEvent(dashboardEvents.TOGGLE_FILTER_BLOCK);
            });
            //</editor-fold>

        };

        var setDataFromDashboard = function () {

            vm.entityType = $scope.$parent.vm.entityType;
            contentType = $scope.$parent.vm.contentType;

            vm.componentData = $scope.$parent.vm.componentData;

            vm.userSettings = vm.componentData.user_settings;
            vm.dashboardComponentElement = $scope.$parent.vm.componentElement;

            vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
            vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;
            vm.dashboardComponentDataService = $scope.$parent.vm.dashboardComponentDataService;
            vm.dashboardComponentEventService = $scope.$parent.vm.dashboardComponentEventService;


        };

        let getLayoutByUserCode = function (userCode) {

            const cachedLayoutsData = vm.dashboardDataService.getCachedLayoutsData();

            if (!cachedLayoutsData[contentType]) {
                cachedLayoutsData[contentType] = {};
            }

            if (cachedLayoutsData[contentType].hasOwnProperty(userCode)) {

                const layoutId = cachedLayoutsData[contentType][userCode];

                return new Promise(function (resolve) {
                    resolve(localStorageService.getCachedLayout(layoutId));
                });

            } else {

                return new Promise(function (resolve, reject) {

                    uiService.getListLayoutByUserCode(vm.entityType, userCode).then(function (resData) {

                        if (resData.results.length) {

                            var layoutData = resData.results[0];

                            vm.dashboardDataService.setCachedLayoutsData(contentType, userCode, layoutData.id);

                            resolve(layoutData);

                        } else {
                            reject(`No layout with user code: ${userCode} found.`);
                        }

                    }).catch(function (error) {
                        reject(error);
                    });

                });

            }

        };

        vm.getView = function () {

            // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

            vm.readyStatus.layout = false;

            vm.processing = true;

            vm.entityViewerDataService = new EntityViewerDataService(reportHelper);
            vm.entityViewerEventService = new EntityViewerEventService();
            vm.attributeDataService = new AttributeDataService(metaContentTypesService, customFieldService, attributeTypeService, uiService);

            //console.log('$scope.$parent.vm.componentData', $scope.$parent.vm.componentData);


            setDataFromDashboard();

            vm.entityViewerDataService.setViewContext('dashboard');

            var downloadAttrsPromise = sharedLogicHelper.downloadAttributes();
            vm.setEventListeners();

            sharedLogicHelper.setLayoutDataForView();
            vm.entityViewerDataService.setRootEntityViewer(true);
            vm.entityViewerDataService.setUseFromAbove(true);

            // var layoutId = vm.componentData.settings.layout;
            var layoutUc = vm.componentData.settings.layout;

            var setLayoutPromise = new Promise(function (resolve, reject) {

                getLayoutByUserCode(layoutUc).then(function (data) {
                    // vm.layout = data;

                    vm.setLayout(data).then(function () {

                        // needed to prevent saving layout as collapsed when saving it from dashboard
                        var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();
                        savedInterfaceLayout = JSON.parse(JSON.stringify(interfaceLayout));

                        var additions = vm.entityViewerDataService.getAdditions();
                        savedAddtions = JSON.parse(JSON.stringify(additions));

                        // rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        if (vm.componentData.type === 'report_viewer' ||
                            vm.componentData.type === 'report_viewer_split_panel') {

                            var evComponents = vm.entityViewerDataService.getComponents();

                            Object.keys(vm.componentData.settings.components).forEach(key => {
                                evComponents[key] = vm.componentData.settings.components[key];
                            });

                            vm.entityViewerDataService.setComponents(evComponents);

                            //<editor-fold desc="Set dashboard columns list for small rv table">
                            if (vm.userSettings && vm.userSettings.columns && vm.userSettings.columns.length) {

                                if (fillInModeEnabled) {

                                    var listLayout = vm.entityViewerDataService.getListLayout();
                                    var columns = listLayout.data.columns;

                                } else {

                                    var columns = JSON.parse(JSON.stringify(vm.userSettings.columns));

                                    var listLayout = vm.entityViewerDataService.getListLayout();
                                    var layoutColumns = listLayout.data.columns;
                                    var layoutGroups = listLayout.data.grouping;
                                    var groupColumns = [];

                                    if (layoutGroups.length) {
                                        groupColumns = layoutColumns.slice(0, layoutGroups.length)
                                    }

                                    layoutColumns.forEach(layoutColumn => {

                                        var groupColumn = layoutGroups.find(group => group.key === layoutColumn.key);

                                        if (groupColumn) { // remove groups column

                                            var groupColIndex = columns.findIndex(column => column.key === layoutColumn.key);
                                            if (groupColIndex > -1) columns.splice(groupColIndex, 1);

                                        } else {

                                            var column = columns.find(function (itemColumn) {
                                                return itemColumn.key === layoutColumn.key;
                                            });

                                            if (column && !column.layout_name) {
                                                column.layout_name = layoutColumn.layout_name;
                                            }

                                        }

                                    });

                                    columns = groupColumns.concat(columns);

                                }

                                vm.entityViewerDataService.setColumns(columns);

                            }
                            //</editor-fold desc="Set dashboard columns list for small rv table">

                        }

                        // FN-2320 2023-11-11 szhitenev update
                        vm.lastSavedOutput = {};
                        console.log('setDataFromDashboard.vm', vm)
                        vm.applyDashboardLayoutState();

                        vm.initDashboardExchange();

                        vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        /* vm.readyStatus.layout = true;

                        $scope.$apply(); */
                        sharedLogicHelper.onSetLayoutEnd();

                        resolve();

                    });

                }).catch(function (error) {
                    reject({errorObj: error, errorCause: 'layout'});
                });

            });

            Promise.all([downloadAttrsPromise, setLayoutPromise]).then(function () {

                vm.dashboardComponentDataService.setEntityViewerDataService(vm.entityViewerDataService);
                vm.dashboardComponentDataService.setEntityViewerEventService(vm.entityViewerEventService);

                vm.dashboardComponentDataService.setAttributeDataService(vm.attributeDataService);
                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED);
                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.REPORT_VIEWER_DATA_SERVICE_SET);

                var columns = vm.entityViewerDataService.getColumns();
                vm.dashboardComponentDataService.setViewerTableColumns(columns);

                $scope.$apply();
                //vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

            }).catch(function (error) {

                if (error.errorCause === 'layout') {
                    vm.dashboardDataService.setComponentError(vm.componentData.id, {displayMessage: 'failed to load report layout'});
                }

                vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ERROR);
                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                console.error("Dashboard component that uses report viewer error", error);
            });

        };

        vm.init = function () {

            vm.getCurrentMember().then(function () {
                vm.getView();
            })

        };

        vm.init();

    }

}());