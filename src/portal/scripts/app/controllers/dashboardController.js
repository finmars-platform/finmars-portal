/**
 * Created by szhitenev on 05.05.2016.
 */

(function () {

    'use strict';

    var uiService = require('../services/uiService');

    var DashboardDataService = require('../services/dashboard/dashboardDataService');
    var DashboardEventService = require('../services/eventService');
    var supersetService = require('../services/supersetService');

    var dashboardEvents = require('../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../services/dashboard/dashboardComponentStatuses');
    var metaHelper = require('../helpers/meta.helper');

    var toastNotificationService = require('../../../../core/services/toastNotificationService');


    module.exports = function ($scope, $stateParams, $mdDialog) {

        var vm = this;

        vm.readyStatus = {data: false};
        vm.layout = null;

        vm.componentFillInModeData = null;

        vm.dashboardDataService = null;
        vm.dashboardEventService = null;

        vm.popupData = {
            dashboardDataService: vm.dashboardDataService,
            dashboardEventService: vm.dashboardEventService
        }

        vm.processing = false;

        // ======================================
        //  LAYOUT SECTION START
        // =====================================

        vm.getLayout = function (layoutId) {

            vm.readyStatus.data = false;

            uiService.getDashboardLayoutByKey(layoutId).then(function (data) {

                vm.dashboardDataService = new DashboardDataService();
                vm.dashboardEventService = new DashboardEventService();

                vm.popupData = {
                    dashboardDataService: vm.dashboardDataService,
                    dashboardEventService: vm.dashboardEventService
                }

                vm.layout = data;

                console.log('vm.layout', vm.layout);
                console.log('vm.popupData', vm.popupData);


                vm.initEventListeners();

                vm.dashboardDataService.setData(vm.layout);
                vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(data)));

                vm.readyStatus.data = true;

                vm.projection = vm.generateProjection(vm.layout);

                if (vm.projection && vm.projection.length) {
                    vm.projection[0].active = true
                }

                vm.dashboardDataService.setProjection(vm.projection);


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

                if (vm.layout) {

                    vm.generateTabsProjection();

                    vm.dashboardDataService.setData(vm.layout);
                    vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(vm.layout)));

                    vm.readyStatus.data = true;

                    vm.initDashboardComponents();

                    $scope.$apply();

                } else {

                    vm.readyStatus.data = true;
                    $scope.$apply();

                }

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

                    vm.generateTabsProjection();

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
                templateUrl: 'views/dialogs/dashboard/layout-list-dialog-view.html',
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

                vm.dashboardDataService.setListLayout(JSON.parse(JSON.stringify(data)));

                toastNotificationService.success("Dashboard Layout is Saved")

                $scope.$apply();

            });

        };

        // ======================================
        //  LAYOUT SECTION END
        // =====================================

        vm.generateProjection = function (layout) {

            var result = [];

            console.log('generateProjection.vm.layout', layout);

            var data = JSON.parse(JSON.stringify(layout.data));

            data.tabs.forEach(function (tab) {

                tab.accordion_layout = [];

                if (tab.accordions) {

                    var rowsUsedInAccordions = [];

                    tab.accordions.forEach(function (accordionItem) {

                        if (accordionItem.from === accordionItem.to) {
                            rowsUsedInAccordions.push(accordionItem.from);
                        } else {
                            for (var i = accordionItem.from; i <= accordionItem.to; i = i + 1) {
                                rowsUsedInAccordions.push(i)
                            }
                        }

                    })

                    console.log('rowsUsedInAccordions', rowsUsedInAccordions);

                    tab.layout.rows.forEach(function (item, index) {

                        if (rowsUsedInAccordions.indexOf(index) === -1) {

                            var accordion = {
                                name: '',
                                from: index,
                                to: index,
                                type: 'proxy_accordion',
                                items: [item]
                            };

                            tab.accordion_layout.push(accordion);

                        }

                    })

                    tab.accordions.forEach(function (accordionItem) {

                        var accordion = {
                            name: accordionItem.name,
                            from: accordionItem.from,
                            to: accordionItem.to,
                            type: 'accordion',
                            items: []
                        };

                        tab.layout.rows.forEach(function (row, index) {

                            if (index >= accordionItem.from && index <= accordionItem.to) {
                                accordion.items.push(row)
                            }

                        })

                        tab.accordion_layout.push(accordion);

                    })

                } else {

                    var accordion = {
                        name: "",
                        type: "proxy_accordion",
                        items: [],
                        from: 0,
                        to: tab.layout.rows.length - 1
                    }

                    tab.layout.rows.forEach(function (row) {
                        accordion.items.push(row);
                    })

                    tab.accordion_layout.push(accordion);

                }


                tab.accordion_layout = tab.accordion_layout.sort(function (a, b) {

                    if (a.from < b.from) {
                        return -1;
                    }

                    if (a.from > b.from) {
                        return 1;
                    }

                    return 0;
                })

                result.push(tab);

            })

            console.log('generateProjection.result', result);

            return result;

        }

        vm.generateTabsProjection = function () {

            vm.projection = vm.generateProjection(vm.layout);

            if (vm.projection && vm.projection.length) {
                vm.projection[0].active = true;
                vm.dashboardDataService.setActiveTab(vm.projection[0]);

            }

            vm.dashboardDataService.setProjection(vm.projection);

        }

        vm.clearActiveTabUfaFilters = function () {
            vm.dashboardEventService.dispatchEvent(dashboardEvents.CLEAR_ACTIVE_TAB_USE_FROM_ABOVE_FILTERS);
        };

        var componentsFinishedLoading = function () {

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();
            var componentsIds = Object.keys(statusesObject);

            var processing = false;

            for (var i = 0; i < componentsIds.length; i++) {

                if (statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ACTIVE &&
                    statusesObject[componentsIds[i]] !== dashboardComponentStatuses.ERROR) {

                    processing = true;
                    break;

                }

            }

            return processing;

        };

        vm.refreshActiveTab = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ACTIVE_TAB);

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {

                vm.processing = false;

            } else {

                setTimeout(function () { // enable refresh buttons if no components uses active object
                    vm.processing = componentsFinishedLoading();
                }, 100);

            }

        };

        vm.refreshAll = function () {

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL);

            var statusesObject = vm.dashboardDataService.getComponentStatusesAll();

            if (!Object.keys(statusesObject).length) {
                vm.processing = false;

            } else {

                setTimeout(function () { // enable refresh buttons if no components uses active object
                    vm.processing = componentsFinishedLoading();
                }, 100);

            }

        };

        vm.setActiveTab = function (tab) {

            vm.projection.forEach(function (item) {
                item.active = false;
            })

            tab.active = true;

            vm.dashboardDataService.setActiveTab(tab)

            // vm.dashboardEventService.dispatchEvent(dashboardEvents.RESIZE)
            setTimeout(function () {
                vm.dashboardEventService.dispatchEvent(dashboardEvents.RESIZE)
                window.dispatchEvent(new Event('resize'));
            }, 0)
        };

        vm.initDashboardComponents = function () {

            var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));
            var componentData;
            var componentStatus;
            console.log('DashboardController.initDashboardComponents statusesObject', statusesObject)

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));

                // console.log('DashboardController.COMPONENT_STATUS_CHANGE statusesObject', statusesObject)

                // First loop to init only controls
                // Do not move this loop
                // we need to controls be registered then resolved,
                // in first run isControlsReady() will return true
                Object.keys(statusesObject).forEach(function (componentId) {

                    componentData = vm.dashboardDataService.getComponentById(componentId);
                    componentStatus = vm.dashboardDataService.getComponentStatus(componentId);

                    if (componentData.type === 'control' && componentStatus === dashboardComponentStatuses.INIT) {

                        console.log("DashboardController.starting_control... ", componentData.name)

                        vm.dashboardDataService.registerControl(componentId);
                        vm.dashboardDataService.setComponentStatus(componentId, dashboardComponentStatuses.START)
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    }

                    // console.log('componentData', componentData);

                })

                if (vm.dashboardDataService.isControlsReady()) {

                    console.log('DashboardController.COMPONENT_STATUS_CHANGE controls is ready, initing other components', statusesObject)
                    // Second loop to init other components
                    Object.keys(statusesObject).forEach(function (componentId) {

                        componentData = vm.dashboardDataService.getComponentById(componentId);
                        componentStatus = vm.dashboardDataService.getComponentStatus(componentId);

                        console.log("DashboardController.trying_component...", componentData.name)

                        if (componentData.type !== 'control' && componentStatus === dashboardComponentStatuses.INIT) {

                            console.log("DashboardController.starting_component... ", componentData.name)

                            vm.dashboardDataService.setComponentStatus(componentId, dashboardComponentStatuses.START)
                            vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        }

                    })
                } else {
                    console.log('DashboardController.controls are not ready statusesObject', statusesObject)
                }

                // console.log('DashboardController.COMPONENT_STATUS_CHANGE statusesObject', statusesObject)

            });

        };

        vm.initEventListeners = function () {

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                var processed = componentsFinishedLoading();

                if (processed) {

                    vm.processing = true;

                } else if (vm.processing) {
                    vm.processing = false;
                    $scope.$apply();
                }

            })

            vm.dashboardEventService.addEventListener(dashboardEvents.DASHBOARD_LAYOUT_CHANGE, function () {

                var layoutToOpen = vm.dashboardDataService.getLayoutToOpen();

                vm.getLayout(layoutToOpen.id);

            })

        };

        vm.init = function () {

            vm.dashboardDataService = new DashboardDataService();
            vm.dashboardEventService = new DashboardEventService();

            vm.popupData = {
                dashboardDataService: vm.dashboardDataService,
                dashboardEventService: vm.dashboardEventService
            }

            vm.openDashboardLayout();
            vm.initEventListeners();

        };

        vm.init();

    }

}());
