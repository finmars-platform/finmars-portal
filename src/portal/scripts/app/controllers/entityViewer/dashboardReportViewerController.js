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

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var utilsHelper = require('../../helpers/utils.helper');

    module.exports = function ($scope, $mdDialog, toastNotificationService, usersService, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, customFieldService, attributeTypeService, uiService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper, gFiltersHelper, dashboardHelper) {

        var vm = this;

        var sharedLogicHelper = new RvSharedLogicHelper(vm, $scope, $mdDialog, globalDataService, priceHistoryService, currencyHistoryService, metaContentTypesService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper);

        vm.readyStatus = {
            attributes: false,
            layout: false
        };

        vm.showFiltersArea = true; // important

        vm.processing = false;

        vm.componentData = null;
        vm.dashboardDataService = null;
        vm.dashboardEventService = null;
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

        vm.closeGroupsAndContinueReportGeneration = function () {

            var localStorageReportData = localStorageService.getReportData();

            var layout = vm.entityViewerDataService.getListLayout();
            var contentType = vm.entityViewerDataService.getContentType();

            delete localStorageReportData[contentType][layout.user_code]

            var groups = vm.entityViewerDataService.getGroups();

            groups.forEach(function (group) {

                if (!group.report_settings) {
                    group.report_settings = {}
                }

                group.report_settings.is_level_folded = true;

            })

            vm.entityViewerDataService.setGroups(groups);

            localStorageService.cacheReportData(localStorageReportData);

            vm.possibleToRequestReport = true;

            rvDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

        }

        vm.continueReportGeneration = function () {

            vm.possibleToRequestReport = true;

            rvDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
        }

        vm.hasFiltersArea = function () {
            return ['report_viewer_bars_chart', 'report_viewer_pie_chart', 'report_viewer_matrix', 'report_viewer_table_chart'].includes(vm.componentData.type);
        };

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


                // Check are there report datepicker expressions to solve
                if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {


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

        vm.getCurrentMember = function () {

            return usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                $scope.$apply();

            });
        };

        vm.setDashboardComponentToActive = function () {
            vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ACTIVE);
            vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
        }

        vm.applyDashboardLayoutState = function () {

            var layoutState = vm.dashboardDataService.getLayoutState();

            console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.layoutState", layoutState);
            console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.components_to_listen", vm.componentData.settings.components_to_listen);

            var changed = utilsHelper.hasStateChanged(vm.lastSavedOutput, layoutState, vm.componentData.settings.components_to_listen)

            console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.linked_components", vm.componentData.settings.linked_components);

            if (changed) {

                console.log("DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.changed!")

                if (vm.componentData.settings.linked_components) {

                    if (vm.componentData.settings.linked_components.active_object && vm.componentData.settings.linked_components.active_object.length) {

                        var key = vm.componentData.settings.linked_components.active_object[0];

                        var activeObjectData = layoutState[key]

                        console.log('DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.activeObjectData', activeObjectData);

                        vm.entityViewerDataService.resetData();
                        // vm.entityViewerDataService.setActiveObject(activeObjectData);
                        vm.entityViewerDataService.setActiveObjectFromAbove(activeObjectData);

                        // vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
                        gFiltersHelper.insertActiveObjectDataIntoFilters(vm.entityViewerDataService, vm.entityViewerEventService);

                    }

                    if (vm.entityType === 'transaction-report') {

                        // In case of transaction report we must have active object from above
                        if (!vm.componentData.settings.linked_components.active_object) {
                            vm.setDashboardComponentToActive();
                            return
                        }

                        if (!vm.componentData.settings.linked_components.active_object.length) {
                            vm.setDashboardComponentToActive();
                            return
                        }

                        var key = vm.componentData.settings.linked_components.active_object[0];
                        var activeObjectData = layoutState[key]

                        if (!activeObjectData) {
                            vm.setDashboardComponentToActive();
                            return
                        }

                    }

                    if (vm.componentData.settings.linked_components.report_settings) {

                        var reportOptions = vm.entityViewerDataService.getReportOptions();

                        // Because report could listen both to matrix and controls
                        // when user click on matrix it trigger change,
                        // but here we handle both changes, so we need extra check for ReportSettings change
                        // to ensure that we need to reset Report

                        var reportOptionsChange = false

                        // Set data to linked filters

                        Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (key) {

                            var mapValue = vm.componentData.settings.linked_components.report_settings[key]

                            if (!utilsHelper.isEqual(reportOptions[key], layoutState[mapValue])) {
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

                        } else {

                            console.log('DashboardReportViewerController.COMPONENT_OUTPUT_CHANGE.detect_report_settings_change.table_is_not_going_to_reset');

                        }


                    }

                } else {

                    // Nothing is linked to report
                    // just render then
                    vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                }

            }

            vm.lastSavedOutput = layoutState

        }

        vm.setEventListeners = function () {

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                vm.applyDashboardLayoutState();


            });

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

                // rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);
                rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

            });

            vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                vm.entityViewerDataService.setDataLoadStatus(true);

                vm.processing = false;

                vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ACTIVE);
                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);


            });

            switch (vm.componentData.type) {

                case 'report_viewer':
                    vm.entityViewerEventService.addEventListener(evEvents.ROWS_ACTION_FIRED, sharedLogicHelper.executeRowAction);
                    break;

            }


            vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', vm.componentData.type);
                console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', gotActiveObjectFromLinkedDashboardComp);

                var activeObject = vm.entityViewerDataService.getActiveObject();

                vm.dashboardDataService.setComponentOutput(vm.componentData.user_code, activeObject);

                vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id);
                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);

            });

            if (fillInModeEnabled) {

                if (vm.componentData.type === 'report_viewer' ||
                    vm.componentData.type === 'report_viewer_split_panel') {

                    // vm.entityViewerEventService.addEventListener(evEvents.OPEN_DASHBOARD_COMPONENT_EDITOR, function () {
                    //
                    // });

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

            // vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_SHOW_FROM_ABOVE_FILTERS, function () {
            //
            // })

        };

        var setDataFromDashboard = function () {

            vm.entityType = $scope.$parent.vm.entityType;
            contentType = $scope.$parent.vm.contentType;

            vm.componentData = $scope.$parent.vm.componentData;

            vm.userSettings = vm.componentData.user_settings;
            vm.dashboardComponentElement = $scope.$parent.vm.componentElement;

            vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
            vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;


        };

        let getLayoutByUserCode = function (userCode) {

            // No cache here

            return new Promise(function (resolve, reject) {

                uiService.getListLayoutByUserCode(vm.entityType, userCode).then(function (resData) {

                    if (resData.results.length) {

                        var layoutData = resData.results[0];

                        // vm.dashboardDataService.setCachedLayoutsData(contentType, userCode, layoutData.id);

                        resolve(layoutData);

                    } else {
                        reject(`No layout with user code: ${userCode} found.`);
                    }

                }).catch(function (error) {
                    reject(error);
                });

            });

        };

        vm.getView = async function () {

            // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

            vm.openGroupsCount = null;
            vm.possibleToRequestReport = false // !important, do not remove, on change layout we should again ask user about groups

            vm.readyStatus.layout = false;

            vm.processing = true;

            vm.entityViewerDataService = new EntityViewerDataService(reportHelper);
            vm.entityViewerEventService = new EntityViewerEventService();
            vm.attributeDataService = new AttributeDataService(metaContentTypesService, customFieldService, attributeTypeService, uiService);

            //console.log('$scope.$parent.vm.componentData', $scope.$parent.vm.componentData);


            setDataFromDashboard();

            vm.entityViewerDataService.setViewContext('dashboard');

            await sharedLogicHelper.downloadAttributes();

            console.log("dashboard.report_viewer.attributes_downloaded")

            vm.setEventListeners();

            sharedLogicHelper.setLayoutDataForView();
            vm.entityViewerDataService.setRootEntityViewer(true);
            vm.entityViewerDataService.setUseFromAbove(true);

            // var layoutId = vm.componentData.settings.layout;
            var layoutUc = vm.componentData.settings.layout;

            await new Promise(function (resolve, reject) {

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

            var columns = vm.entityViewerDataService.getColumns();


            $scope.$apply();


        };

        vm.init = async function () {

            await vm.getCurrentMember()
            await vm.getView();

        };

        vm.init();

    }

}());