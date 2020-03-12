(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var DashboardComponentDataService = require('../../services/dashboard/dashboardComponentDataService');
    var DashboardComponentEventService = require('../../services/dashboard/dashboardComponentEventService');

    module.exports = function ($mdDialog) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-view.html',
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

                    if (componentData.type === 'report_viewer_split_panel') {
                        componentData.type = 'report_viewer';
                    }

                    if (componentData.custom_component_name) {
                        scope.customName = componentData.custom_component_name;
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

                scope.openComponentSettingsEditorDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'DashboardReportViewerComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.vm.componentData
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            componentData = res.data.item;

                            scope.vm.componentData = componentData;

                            if (componentData.custom_component_name) {
                                scope.customName = componentData.custom_component_name;
                            } else {
                                scope.customName = null;
                            }

                            scope.dashboardDataService.updateComponent(componentData);

                            if (scope.fillInModeData) { // Reloading corresponding component inside tabs from it's filled in copy
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
                        tab_number: scope.vm.tabNumber,
                        row_number: scope.vm.rowNumber,
                        column_number: scope.vm.columnNumber,
                        item: scope.item,
                        entityViewerDataService: entityViewerDataService,
                        attributeDataService: attributeDataService,
                        dashboardComponentEventService: scope.dashboardComponentEventService // needed to update component inside tabs
                    };

                };

                scope.disableFillInMode = function () {
                    scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.UPDATE_VIEWER_TABLE_COLUMNS);
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

                    }

                };

                scope.init = function () {

                    scope.initEventListeners();

                    if (!scope.fillInModeData) {

                        scope.dashboardDataService.setComponentRefreshRestriction(scope.item.data.id, false);

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