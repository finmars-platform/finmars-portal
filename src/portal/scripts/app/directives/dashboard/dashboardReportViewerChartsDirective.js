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
                fillInModeData: '=?' // data about component inside tabs for filled in component
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: false
                };

                scope.dashboardComponentDataService = new DashboardComponentDataService;
                scope.dashboardComponentEventService = new DashboardComponentEventService;

                var componentData;

                if (scope.item && scope.item.data) {
                    componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.chart_custom_name) {
                        scope.customName = componentData.chart_custom_name;
                    }

                }

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentData: componentData,
                    entityType: componentData.settings.entity_type,
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

                    var attributeDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerChartsComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-charts-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.vm.componentData,
                            attributeDataService: attributeDataService
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            componentData = res.data.item;

                            scope.vm.componentData = componentData;
                            scope.vm.entityType = componentData.settings.entity_type;

                            if (componentData.chart_custom_name) {
                                scope.customName = componentData.chart_custom_name;
                            } else {
                                scope.customName = null;
                            }

                            scope.dashboardDataService.updateComponent(componentData);

                            if (scope.fillInModeData) {
                                // Reloading corresponding component inside tabs from it's filled in copy
                                scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            }

                            scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        }

                    })

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
                        dashboardComponentEventService: scope.dashboardComponentEventService // needed to update component inside tabs
                    }

                };

                scope.disableFillInMode = function () {
                    scope.fillInModeData = null;
                };

                scope.clearUseFromAboveFilters = function () {
                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS);
                };

                scope.initEventListeners = function () {

                    if (!scope.fillInModeData) {

                        scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                            var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                            if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                                scope.readyStatus.data = true;

                                setTimeout(function () {
                                    scope.$apply();
                                },0)

                            }

                        });

                        scope.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {

                            if (scope.item && scope.item.data) {
                                componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                                if (componentData.chart_custom_name) {
                                    scope.customName = componentData.chart_custom_name;
                                }
                            }

                            scope.vm.componentData = componentData;
                            scope.vm.entityType = componentData.settings.entity_type;

                            scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_CONTENT_OF_COMPONENT);

                        });

                    }

                };

                scope.init = function () {

                    scope.initEventListeners();

                    if (!scope.fillInModeData) {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
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