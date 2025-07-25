/**
 * Created by szhitenev on 05.05.2016.
 */

(function () {

    'use strict';

    var uiService = require('../services/uiService').default;

    var DashboardDataService = require('../services/dashboard/dashboardDataService');
    var DashboardEventService = require('../services/eventService');
    var supersetService = require('../services/supersetService');

    var dashboardEvents = require('../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../services/dashboard/dashboardComponentStatuses');
    var metaHelper = require('../helpers/meta.helper').default;

    var toastNotificationService = require('../../../../core/services/toastNotificationService').default;


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
        vm.componentsReadyCount = 0;
        vm.componentReadyPercent = 0;
        vm.totalComponents = 0;
        vm.processingMessage = 'Dashboard is in progress...'
        vm.processingTimeout = null;
        vm.state = {}

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


                vm.dashboardDataService.setData(vm.layout);
                vm.dashboardDataService.setListLayout(JSON.parse(angular.toJson(data)));

                vm.readyStatus.data = true;

                vm.projection = vm.generateProjection(vm.layout);

                if (vm.projection && vm.projection.length) {
                    vm.projection[0].active = true
                }

                vm.dashboardDataService.setProjection(vm.projection);

                vm.initEventListeners();

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

                    vm.initEventListeners();

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

            vm.processing = true;

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
                parent: document.querySelector('.dialog-containers-wrap'),
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

        vm.saveDashboardLayout = function () {

            uiService.updateDashboardLayout(vm.layout.id, JSON.parse(angular.toJson(vm.layout))).then(function (data) {

                /*
                 * IMPORTANT: do not do `vm.layout = data;`.
                 * It leads to rerender of components without fully reloading the dashboard.
                 * Components are not made to do this.
                 * Causes bugs at least with components-controls.
                 * */
                vm.dashboardDataService.setListLayout(structuredClone(data));

                toastNotificationService.success("Dashboard Layout is Saved")

                $scope.$apply();

            });

        };

        vm.getFilteredProjection = function (data) {
            data.forEach((item) => {
                // Filter out empty rows by checking if all columns are empty in the row
                item.layout.rows = item.layout.rows.filter((row) => {
                    return row.columns.some((column) => column.cell_type !== 'empty');
                });

                // Update rows_count after filtering
                item.layout.rows_count = item.layout.rows.length;

                // Fix field `to` in accordion_layout by updating the number of rows
                item.accordion_layout.forEach((accordion) => {
                    accordion.items = accordion.items.filter((item) => {
                        return item.columns.some((column) => column.cell_type !== 'empty');
                    });

                    // Update property `to`
                    accordion.to = accordion.items.length;
                });
            });

            return data || [];
        }

        // ======================================
        //  LAYOUT SECTION END
        // =====================================

        vm.generateProjection = function (layout) {

            var result = [];

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

            });

            return vm.getFilteredProjection(result);

        }

        vm.generateTabsProjection = function () {

            vm.projection = vm.generateProjection(vm.layout);

            if (vm.projection && vm.projection.length) {
                vm.projection[0].active = true;
                vm.dashboardDataService.setActiveTab(vm.projection[0]);

            }

            vm.dashboardDataService.setProjection(vm.projection);

        }

        vm.refresh = function () {

            clearTimeout(vm.processingTimeout);

            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL);

            vm.processing = true;

            vm.componentsReadyCount = 0;
            vm.componentReadyPercent = 0;
            vm.processingMessage = "Dashboard is refreshing..."

            vm.processingTimeout = setTimeout(function () {

                vm.processing = false;
                $scope.$apply();

            }, 1000 * 20)

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

        vm.showState = function ($event) {

            $mdDialog.show({
                controller: 'DashboardShowStateDialogController as vm',
                templateUrl: 'views/dialogs/dashboard-show-state-dialog-view.html',
                clickOutsideToClose: false,
                locals: {
                    data: {
                        dashboardDataService: vm.dashboardDataService,
                        dashboardEventService: vm.dashboardEventService
                    }
                }
            });

        }

        vm.initDashboardComponents = function () {

            var statusesObject = JSON.parse(JSON.stringify(vm.dashboardDataService.getComponentStatusesAll()));
            var componentData;
            var componentStatus;

            vm.totalComponents = Object.keys(statusesObject).length;

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                statusesObject = structuredClone(vm.dashboardDataService.getComponentStatusesAll());
                vm.totalComponents = Object.keys(statusesObject).length;
                // console.log('DashboardController.COMPONENT_STATUS_CHANGE statusesObject', statusesObject)


                // First loop initiates only components-controls.
                // Do not move this loop!
                // We need controls to be registered then resolved,
                // so that dashboardDataService.areControlsReady() will return true

                vm.componentsReadyCount = 0;
                vm.componentReadyPercent = 0;
                vm.processingMessage = '';

                Object.keys(statusesObject).forEach(function (componentId) {

                    componentData = vm.dashboardDataService.getComponentById(componentId);
                    componentStatus = vm.dashboardDataService.getComponentStatus(componentId);

                    // console.log('DashboardController.componentData.name', componentData.name);
                    // console.log('DashboardController.componentStatus', componentStatus);


                    if ((componentData.type === 'control') && componentStatus === dashboardComponentStatuses.INIT) {

                        // console.log("DashboardController.starting_control... ", componentData.name)

                        vm.dashboardDataService.registerControl(componentId);
                        vm.dashboardDataService.setComponentStatus(componentId, dashboardComponentStatuses.START)
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    }

                    if (componentStatus === 'ACTIVE') {

                        vm.componentsReadyCount = vm.componentsReadyCount + 1;

                        vm.componentReadyPercent = Math.floor(vm.componentsReadyCount / (vm.totalComponents / 100))

                    }

                    if (!vm.processingMessage && componentStatus === 'PROCESSING') {
                        vm.processingMessage = 'Component <b>' + componentData.name + '</b> initializing...'
                    }

                    // console.log('componentData', componentData);

                })

                if (vm.dashboardDataService.areControlsReady()) {

                    console.log('DashboardController.COMPONENT_STATUS_CHANGE controls is ready, initing other components', statusesObject)
                    // Second loop to init other components
                    Object.keys(statusesObject).forEach(function (componentId) {

                        componentData = vm.dashboardDataService.getComponentById(componentId);
                        componentStatus = vm.dashboardDataService.getComponentStatus(componentId);

                        console.log("DashboardController.trying_component...", componentData.name)

                        if (componentData.type !== 'control' && componentStatus === dashboardComponentStatuses.INIT) {

                            console.log("DashboardController.starting_component... ", componentData.name)

                            vm.dashboardDataService.setComponentStatus(componentId, dashboardComponentStatuses.START)
                            // Really strange thing
                            // Do not remove
                            // Problem exist in case when you have only 2 iframes components
                            setTimeout(() => {
                                vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                            })

                        }

                    })
                } else {
                    console.log('DashboardController.controls are not ready statusesObject', statusesObject)
                }

                if (vm.totalComponents !== 0) {
                    if (vm.totalComponents === vm.componentsReadyCount) {
                        vm.processing = false;
                    }
                }

                // console.log('DashboardController.COMPONENT_STATUS_CHANGE statusesObject', statusesObject)

            });


        };

        vm.broadcastToChildren = function (data) {

            console.log("Dashboard.broadcastToChildren", data);

            if (data) {
                data['meta'] = {
                    'origin': 'finmars'
                }
            }

            document.querySelectorAll('iframe').forEach(iframe => {
                iframe.contentWindow.postMessage(data, '*'); // In practice, use a more specific target origin
            });

        }

        vm.toggleCache = function () {

            vm.state = vm.dashboardDataService?.getLayoutState();

            vm.state.ignore_cache = !vm.state.ignore_cache;

            vm.dashboardDataService.setLayoutState(vm.state);

            vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);
        }

        vm.initEventListeners = function () {

            // THATS CRAZY
            // also look at dashboardDataService.setComponentOutput
            // seems Keycloak uses also small iframe and it sends some data to it, but it not JSON
            // So we need to check if data is JSON or not
            window.addEventListener('message', function (event) {
                // Security checks and message handling here...
                // Update the dashboard state and broadcast if necessary
                console.trace();
                console.log("setEventListeners.event from child iframes", event);

                // Check if event.data is a valid JSON object
                try {
                    // Attempt to parse event.data as JSON
                    var data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

                    // Update the dashboard state and broadcast if necessary
                    console.log("setEventListeners.event from child iframes", data);

                    // IN CASE OF EXTERNAL EXTENSIONS/MODULES Could write to postMessage
                    // szhitenev 2024-09-11 DO NOT REMOVE
                    if (data && data.hasOwnProperty('meta')) {

                        if (data['meta'].hasOwnProperty('origin')) {
                            if (data['meta']['origin'] === 'finmars') {

                                vm.state = data;

                                vm.dashboardDataService.setLayoutState(data);
                                vm.broadcastToChildren(data);
                            }
                        }
                    }
                } catch (e) {
                    // Log an error if event.data is not valid JSON
                    console.error("Received data is not a valid JSON object:", event.data);
                }
                vm.processing = false;

            });

            vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                console.log('COMPONENT_STATUS_CHANGE');

                var state = JSON.parse(JSON.stringify(vm.dashboardDataService.getLayoutState()));

                vm.broadcastToChildren(state)

            });

            vm.initDashboardComponents();

            // Set hard limit for initial loading
            vm.processingTimeout = setTimeout(function () {

                console.log("Dashboard Loading too long. hide progress bar")

                vm.processing = false;
                $scope.$apply();

            }, 1000 * 20)

            vm.dashboardEventService.addEventListener(dashboardEvents.DASHBOARD_LAYOUT_CHANGE, function () {
                vm.processing = true;

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

        };

        vm.init();

    }

}());
