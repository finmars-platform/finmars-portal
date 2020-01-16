(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var DashboardComponentDataService = require('../../services/dashboard/dashboardComponentDataService');
    var DashboardComponentEventService = require('../../services/dashboard/dashboardComponentEventService');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-charts-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
                updateDashboardLayoutCallback: '&?'
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: false
                };

                if (scope.item && scope.item.data && scope.item.data.chart_custom_name) {
                    scope.customName = scope.item.data.chart_custom_name;
                }

                scope.dashboardComponentDataService = new DashboardComponentDataService;
                scope.dashboardComponentEventService = new DashboardComponentEventService;

                scope.vm = {
                    componentType: scope.item,
                    entityType: scope.item.data.settings.entity_type,
                    startupSettings: scope.item.data.settings,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService,
                    dashboardComponentDataService: scope.dashboardComponentDataService,
                    dashboardComponentEventService: scope.dashboardComponentEventService
                };

                scope.openComponentSettingsDialog = function ($event) {

                    var attributeDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerChartsComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-charts-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.vm.componentType,
                            attributeDataService: attributeDataService
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.item = res.data.item;
                            scope.vm.componentType = scope.item;
                            scope.vm.entityType = scope.item.data.settings.entity_type;
                            scope.vm.startupSettings = scope.item.data.settings;

                            if (scope.item.data.chart_custom_name) {
                                scope.customName = scope.item.data.chart_custom_name;
                            } else {
                                scope.customName = null;
                            }

                            if (scope.updateDashboardLayoutCallback) {
                                setTimeout(function () {
                                    scope.updateDashboardLayoutCallback({tabNumber: scope.tabNumber, rowNumber: scope.rowNumber, socketData: scope.item});
                                }, 400);
                            }

                            scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        }

                    })

                };

                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.vm.componentType.data.id);

                        if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                            scope.readyStatus.data = true;

                            setTimeout(function () {
                                scope.$apply();
                            },0)

                        }

                    });

                };

                scope.init = function () {

                    scope.initEventListeners();

                    scope.dashboardDataService.setComponentStatus(scope.vm.componentType.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                };

                scope.init()

            }
        }
    }
}());