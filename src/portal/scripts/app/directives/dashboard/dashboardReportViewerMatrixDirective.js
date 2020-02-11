(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var DashboardComponentDataService = require('../../services/dashboard/dashboardComponentDataService');
    var DashboardComponentEventService = require('../../services/dashboard/dashboardComponentEventService');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-matrix-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
                fillInModeData: '=?',
                updateDashboardLayoutCallback: '&?'
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: false
                };

                if (scope.item && scope.item.data && scope.item.data.custom_component_name) {
                    scope.customName = scope.item.data.custom_component_name;
                }

                scope.dashboardComponentDataService = new DashboardComponentDataService;
                scope.dashboardComponentEventService = new DashboardComponentEventService;

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentType: scope.item,
                    entityType: scope.item.data.settings.entity_type,
                    startupSettings: scope.item.data.settings,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService,
                    dashboardComponentDataService: scope.dashboardComponentDataService,
                    dashboardComponentEventService: scope.dashboardComponentEventService
                };

                if (scope.fillInModeData) {
                    scope.vm.entityViewerDataService = scope.fillInModeData.entityViewerDataService;
                    scope.vm.attributeDataService = scope.fillInModeData.attributeDataService;
                }

                scope.openComponentSettingsDialog = function ($event) {

                    var attributeDataService = scope.dashboardComponentDataService.getAttributeDataService();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerMatrixComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-matrix-component-settings-dialog-view.html',
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

                            if (scope.item.data.custom_component_name) {
                                scope.customName = scope.item.data.custom_component_name;
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

                            if (scope.fillInModeData) {

                                scope.fillInModeData.item = res.data.item;
                                scope.fillInModeData.redrawTableCallback();

                            }

                        }

                    })

                };

                scope.updateViewerTable = function () {
                    scope.item = scope.fillInModeData.item;
                    scope.vm.componentType = scope.item;
                    scope.vm.entityType = scope.item.data.settings.entity_type;
                    scope.vm.startupSettings = scope.item.data.settings;

                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                };

                scope.enableFillInMode = function () {

                    var entityViewerDataService = scope.vm.dashboardComponentDataService.getEntityViewerDataService();
                    var attributeDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();

                    scope.fillInModeData = {
                        tab_number: scope.tabNumber,
                        row_number: scope.rowNumber,
                        column_number: scope.columnNumber,
                        item: scope.item,
                        entityViewerDataService: entityViewerDataService,
                        attributeDataService: attributeDataService,
                        redrawTableCallback: scope.updateViewerTable // needed to update table of original component
                    }

                };

                scope.disableFillInMode = function () {
                    scope.fillInModeData = null;
                };

                scope.initEventListeners = function () {

                    if (!scope.fillInModeData) {

                        scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                            var status = scope.dashboardDataService.getComponentStatus(scope.vm.componentType.data.id);

                            if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                                scope.readyStatus.data = true;

                                setTimeout(function () {
                                    scope.$apply();
                                },0)

                            }

                        });

                    }

                };


                scope.init = function () {

                    scope.initEventListeners();

                    if (!scope.fillInModeData) {

                        scope.dashboardDataService.setComponentStatus(scope.vm.componentType.data.id, dashboardComponentStatuses.INIT);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    } else {
                        scope.readyStatus.data = true;
                    }

                };

                scope.init()

            }
        }
    }
}());