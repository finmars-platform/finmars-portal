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
                templateUrl: 'views/dialogs/dashboard-layout-list-view.html',
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

        vm.exportDashboardLayout = function($event) {

            $mdDialog.show({
                controller: 'DashboardLayoutExportDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-layout-export-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {layout: vm.layout}
                }
            })

        };

        vm.refreshActiveTab = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ACTIVE_TAB)
            vm.processing = true;

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;
            }

        };

        vm.refreshAll = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
            vm.processing = true;

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;
            }

        };


        vm.setActiveTab = function (tab) {

            vm.dashboardDataService.setActiveTab(tab)

        };

        vm.saveLayoutList = function ($event) {

        };

        vm.initEventListeners = function () {

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

                vm.processing = false;

                // console.log('statusesObject', statusesObject);

                var processed = false;

                Object.keys(statusesObject).forEach(function (componentId) {

                    if (statusesObject[componentId] === dashboardComponentStatuses.PROCESSING) {
                        processed = true;
                        vm.processing = true;
                    }

                });

                if (processed) {
                    $scope.$apply();
                }

            })

        };

        vm.initDashboardComponents = function () {


            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));

                var nextComponentToStart = null;

                var keys = Object.keys(statusesObject);
                var key;

                for (var i = 0; i < keys.length; i = i + 1) {

                    key = keys[i];

                    if (statusesObject[key] === dashboardComponentStatuses.INIT && nextComponentToStart === null) {
                        nextComponentToStart = key
                    }

                    if (statusesObject[key] === dashboardComponentStatuses.PROCESSING || statusesObject[key] === dashboardComponentStatuses.START) {
                        nextComponentToStart = null;
                        break;
                    }

                }

                console.log('statusesObject', statusesObject);
                console.log('nextComponentToStart', nextComponentToStart);

                if (nextComponentToStart) {

                    vm.dashboardDataService.setComponentStatus(nextComponentToStart, dashboardComponentStatuses.START);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE)

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
