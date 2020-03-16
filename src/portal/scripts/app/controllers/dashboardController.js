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
                vm.dashboardDataService.setListLayout(JSON.parse(JSON.stringify(data)));

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
                vm.dashboardDataService.setListLayout(JSON.parse(JSON.stringify(vm.layout)));

                vm.readyStatus.data = true;

                vm.initDashboardComponents();

                $scope.$apply();

            })

        };

        vm.openDashboardLayout = function () {

            vm.readyStatus.data = false;
            var activeLayoutName = $stateParams.layoutName;

            if (activeLayoutName) {

                uiService.getDashboardLayoutList().then(function (data) {

                    if (data.results.length) {
                        var layouts = data.results;

                        for (var i = 0; i < layouts.length; i++) {
                            if (layouts[i].name === activeLayoutName) {
                                vm.layout = layouts[i];
                                break;
                            }
                        }
                    }

                    console.log('vm.layout', vm.layout);

                    vm.dashboardDataService.setData(vm.layout);
                    vm.dashboardDataService.setListLayout(JSON.parse(JSON.stringify(vm.layout)));

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

        vm.exportDashboardLayout = function($event) {

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

            var restrictions = vm.dashboardDataService.getAllComponentsRefreshRestriction();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;
            } else {
                vm.processing = true;
            }

        };

        vm.refreshAll = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL);

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;
            } else {
                vm.processing = true;
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

        var componentBuildingTimeTimeout;
        var onComponentBuildingForTooLong = function (compId) {

            componentBuildingTimeTimeout = setTimeout(function () {

                var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));

                if (statusesObject[compId] === dashboardComponentStatuses.PROCESSING || statusesObject[compId] === dashboardComponentStatuses.START) {
                    vm.dashboardDataService.setComponentStatus(compId, dashboardComponentStatuses.ERROR);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    throw "id of defective dashboard component " + compId;
                }

            }, 8000);

        };

        vm.initDashboardComponents = function () {

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                clearTimeout(componentBuildingTimeTimeout);

                var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));
                var nextComponentToStart = null;

                var keys = Object.keys(statusesObject);
                var key;

                for (var i = 0; i < keys.length; i = i + 1) {

                    key = keys[i];

                    if (statusesObject[key] === dashboardComponentStatuses.INIT && nextComponentToStart === null) {
                        nextComponentToStart = key;
                    }

                    if (statusesObject[key] === dashboardComponentStatuses.PROCESSING || statusesObject[key] === dashboardComponentStatuses.START) {
                        nextComponentToStart = null;

                        onComponentBuildingForTooLong(key);
                        break;
                    }

                }

                console.log('statusesObject', statusesObject);
                console.log('nextComponentToStart', nextComponentToStart);

                if (nextComponentToStart) {

                    vm.dashboardDataService.setComponentStatus(nextComponentToStart, dashboardComponentStatuses.START);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

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
