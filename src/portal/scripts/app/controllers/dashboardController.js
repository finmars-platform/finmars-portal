/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../services/uiService');

    var DashboardDataService = require('../services/dashboard/dashboardDataService');
    var DashboardEventService = require('../services/dashboard/dashboardEventService');

    var dashboardEvents = require('../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../services/dashboard/dashboardComponentStatuses');
    var metaHelper = require('../helpers/meta.helper');

    module.exports = function ($scope, $stateParams, $mdDialog) {

        var vm = this;

        vm.readyStatus = {data: false};
        vm.layout = null;

        vm.componentFillInModeData = null;

        vm.dashboardDataService = null;
        vm.dashboardEventService = null;

        vm.processing = false;

        vm.getLayout = function (layoutId) {

            vm.readyStatus.data = false;

            uiService.getDashboardLayoutByKey(layoutId).then(function (data) {

                vm.layout = data;

                console.log('vm.layout', vm.layout);

                vm.dashboardDataService = new DashboardDataService();
                vm.dashboardEventService = new DashboardEventService();

                vm.initEventListeners();

                vm.dashboardDataService.setData(vm.layout);
                vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(data)));

                vm.readyStatus.data = true;

                vm.initDashboardComponents();

                $scope.$apply();

            })

        };

        vm.getDefaultLayout = function () {

            vm.readyStatus.data = false;

            uiService.getDefaultDashboardLayout().then(function (data) {

                if (data.results.length) {
                    vm.layout = data.results[0];
                }

                console.log('vm.layout', vm.layout);

                vm.dashboardDataService.setData(vm.layout);
                vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(vm.layout)));

                vm.readyStatus.data = true;

                vm.initDashboardComponents();

                $scope.$apply();

            })

        };

        vm.openDashboardLayout = function () {

            vm.readyStatus.data = false;
            var activeLayoutUserCode = $stateParams.layoutUserCode;

            console.log('activeLayoutUserCode', activeLayoutUserCode);

            if (activeLayoutUserCode) {

                uiService.getDashboardLayoutList().then(function (data) {

                    if (data.results.length) {
                        var layouts = data.results;

                        for (var i = 0; i < layouts.length; i++) {
                            if (layouts[i].user_code === activeLayoutUserCode) {
                                vm.layout = layouts[i];
                                break;
                            }
                        }
                    }

                    console.log('vm.layout', vm.layout);

                    vm.dashboardDataService.setData(vm.layout);
                    vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(vm.layout)));

                    vm.readyStatus.data = true;

                    vm.initDashboardComponents();

                    $scope.$apply();

                }).catch(function (error) {
                    vm.getDefaultLayout();
                });

            } else {

                vm.getDefaultLayout();

            }

        };

        vm.openLayoutList = function ($event) {

            $mdDialog.show({
                controller: 'DashboardLayoutListDialogController as vm',
                templateUrl: 'views/dialogs/dashboard/dashboard-layout-list-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: false,
                locals: {
                    data: {
                        dashboardDataService: vm.dashboardDataService,
                        dashboardEventService: vm.dashboardEventService
                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.getLayout(res.data.layout.id)

                }

            })

        };

        vm.saveDashboardLayout = function ($event) {

            uiService.updateDashboardLayout(vm.layout.id, vm.layout).then(function (data) {

                vm.layout = data;

                $mdDialog.show({
                    controller: 'InfoDialogController as vm',
                    templateUrl: 'views/info-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        info: {
                            title: 'Success',
                            description: "Dashboard Layout is Saved"
                        }
                    }
                });

                $scope.$apply();

            });

        };

        vm.exportDashboardLayout = function ($event) {

            $mdDialog.show({
                controller: 'DashboardLayoutExportDialogController as vm',
                templateUrl: 'views/dialogs/dashboard/dashboard-layout-export-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {layout: vm.layout}
                }
            })

        };

        vm.clearActiveTabUfaFilters = function () {
            vm.dashboardEventService.dispatchEvent(dashboardEvents.CLEAR_ACTIVE_TAB_USE_FROM_ABOVE_FILTERS);
        };

        vm.refreshActiveTab = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ACTIVE_TAB);

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {

                vm.processing = false;

            } else {

                vm.processing = true;

                setTimeout(function () { // enable refresh buttons if no components uses active object

                    var componentsIds = Object.keys(statusesObject);
                    vm.processing = false;

                    for (var i = 0; i < componentsIds.length; i++) {

                        if (statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ACTIVE &&
                            statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ERROR) {

                            vm.processing = true;
                            break;

                        }

                    }

                }, 100);

            }

        };

        vm.refreshAll = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL);

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;

            } else {

                vm.processing = true;

                setTimeout(function () { // enable refresh buttons if no components uses active object

                    var componentsIds = Object.keys(statusesObject);
                    vm.processing = false;

                    for (var i = 0; i < componentsIds.length; i++) {

                        if (statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ACTIVE &&
                            statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ERROR) {

                            vm.processing = true;
                            break;

                        }

                    }

                }, 100);

            }

        };

        vm.setActiveTab = function (tab) {
            vm.dashboardDataService.setActiveTab(tab)
        };

        vm.updateLayoutOnComponentChange = function (tabNumber, rowNumber, socketData) {

            var colNumber = socketData.column_number;

            if (tabNumber === 'fixed_area') {

                vm.layout.data.fixed_area.layout.rows[rowNumber].columns[colNumber] = socketData;

            } else {

                vm.layout.data.tabs[tabNumber].layout.rows[rowNumber].columns[colNumber] = socketData;

            }

        };

        vm.initEventListeners = function () {

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

                // console.log('statusesObject', statusesObject);

                var processed = false;

                Object.keys(statusesObject).forEach(function (componentId) {

                    /*if (statusesObject[componentId] === dashboardComponentStatuses.PROCESSING) {
                        processed = true;
                    }*/
                    if (statusesObject[componentId] !== dashboardComponentStatuses.ACTIVE &&
                        statusesObject[componentId] !== dashboardComponentStatuses.ERROR) {

                        processed = true;
                    }

                });

                if (processed) {

                    vm.processing = true;

                } else if (vm.processing) {
                    vm.processing = false;
                    $scope.$apply();
                }

            })

        };

        var componentBuildingTimeTimeout = {};
        var onComponentBuildingForTooLong = function (compId) {

            componentBuildingTimeTimeout[compId] = setTimeout(function () {

                var statusesObject = metaHelper.recursiveDeepCopy(vm.dashboardDataService.getComponentStatusesAll());

                if (statusesObject[compId] === dashboardComponentStatuses.PROCESSING || statusesObject[compId] === dashboardComponentStatuses.START) {
                    vm.dashboardDataService.setComponentStatus(compId, dashboardComponentStatuses.ERROR);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    throw "id of defective dashboard component " + compId;
                }

            }, 60000);

        };

        var areAllDependenciesCompleted = function (compId, statusesObject, waitingComponents) {

            var componentData = vm.dashboardDataService.getComponentById(compId);

            if (!componentData || !componentData.settings || ! componentData.settings.linked_components || !componentData.settings.linked_components.report_settings) {
                return true;
            }

            var reportSettings = componentData.settings.linked_components.report_settings;

            var dependencies = Object.values(reportSettings).filter(function (id) { // prevent loop
                return !waitingComponents.includes(id);
            });

            return dependencies.every(function (id) {
                return statusesObject[id] === dashboardComponentStatuses.ACTIVE || statusesObject[id] === dashboardComponentStatuses.ERROR;
            });

        };


        vm.initDashboardComponents = function () {

            var LIMIT = 2;
            var waitingComponents = [];

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));
                var nextComponentToStart = null;

                var keys = Object.keys(statusesObject);
                var key;

                var activeProcessingComponents = 0;

                for (var i = 0; i < keys.length; i = i + 1) {

                    key = keys[i];

                    if (statusesObject[key] === dashboardComponentStatuses.ACTIVE || statusesObject[key] === dashboardComponentStatuses.ERROR) {
                        if (componentBuildingTimeTimeout.hasOwnProperty(key)) {
                            clearTimeout(componentBuildingTimeTimeout[key]);
                            delete componentBuildingTimeTimeout[key];
                        }
                    }

                    if (statusesObject[key] === dashboardComponentStatuses.PROCESSING || statusesObject[key] === dashboardComponentStatuses.START) {
                        activeProcessingComponents = activeProcessingComponents + 1;
                    }

                }

                if (activeProcessingComponents < LIMIT) {

                    for (var i = 0; i < keys.length; i = i + 1) {

                        key = keys[i];

                        //console.log('initDashboardComponents.key', key);

                        if (statusesObject[key] === dashboardComponentStatuses.INIT) {

                            if (areAllDependenciesCompleted(key, statusesObject, waitingComponents)) {

                                waitingComponents = waitingComponents.filter(function (id) {
                                    return id !== key;
                                })

                                vm.dashboardDataService.setComponentStatus(key, dashboardComponentStatuses.START);
                                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                                onComponentBuildingForTooLong(key);
                                break;

                            } else {

                                if (!waitingComponents.includes(key)) {

                                    waitingComponents.push(key);

                                }

                            }

                        }

                    }
                }

            });

        };

        vm.init = function () {

            vm.dashboardDataService = new DashboardDataService();
            vm.dashboardEventService = new DashboardEventService();

            vm.openDashboardLayout();
            vm.initEventListeners();


        };

        vm.init();

    }

}());
