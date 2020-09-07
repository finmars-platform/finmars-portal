(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var uiService = require('../../services/uiService');

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
                    data: 'processing',
                    disabled: false
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

                var saveComponentSettings = function () {

                    var listLayout = scope.dashboardDataService.getListLayout();

                    if (listLayout) {

                        var layoutData = listLayout.data;

                        for (var i = 0; i < layoutData.components_types.length; i++) {

                            if (layoutData.components_types[i].id === componentData.id) {

                                layoutData.components_types[i] = JSON.parse(JSON.stringify(componentData));
                                scope.dashboardDataService.setListLayout(listLayout);

                                uiService.updateDashboardLayout(listLayout.id, listLayout).then(function (data) {

                                    $mdDialog.show({
                                        controller: 'InfoDialogController as vm',
                                        templateUrl: 'views/info-dialog-view.html',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: false,
                                        locals: {
                                            info: {
                                                title: 'Success',
                                                description: "Dashboard component settings saved."
                                            }
                                        }
                                    });

                                });

                                break;

                            }

                        }

                    }

                };

                scope.openComponentSettingsEditorDialog = function ($event) {

                    var dashboardComponents = scope.dashboardDataService.getComponents();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-component-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        autoWrap: true,
                        multiple: true,
                        locals: {
                            item: scope.vm.componentData,
                            data: {
                                dashboardComponents: dashboardComponents
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            componentData = res.data.item;

                            scope.dashboardDataService.updateComponent(componentData);

                            /*if (scope.fillInModeData) { // Reloading corresponding component inside tabs from it's filled in copy
                                scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            }*/

                            if (res.action === 'save') {
                                saveComponentSettings();
                            }

                            if (scope.fillInModeData) {

                                scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            } else {

                                scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            }

                            scope.disableFillInMode();

                            /*scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);*/

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
                    var tableComponents = scope.fillInModeData.entityViewerDataService.getComponents();
                    tableComponents.sidebar = false;
                    scope.fillInModeData.entityViewerDataService.setComponents(tableComponents);

                    scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.UPDATE_VIEWER_TABLE_COLUMNS);
                    scope.fillInModeData = null;
                };

                scope.clearUseFromAboveFilters = function () {
                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS);
                };

                scope.initEventListeners = function () {

                    if (scope.fillInModeData) { // if dashboard is in fillIn mode

                        scope.dashboardComponentEventService.addEventListener(dashboardEvents.OPEN_COMPONENT_EDITOR, function () {

                            var attributeDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();

                            $mdDialog.show({
                                controller: 'DashboardConstructorReportViewerComponentDialogController as vm',
                                templateUrl: 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-component-dialog-view.html',
                                multiple: true,
                                locals: {
                                    item: scope.vm.componentData,
                                    dataService: scope.dashboardDataService,
                                    eventService: {},
                                    attributeDataService: attributeDataService,
                                    data: {
                                        openedFromDashboard: true
                                    }
                                }

                            }).then(function (res) {

                                if (res.status === 'agree') {

                                    if (componentData.custom_component_name) {
                                        scope.customName = componentData.custom_component_name;
                                    } else {
                                        scope.customName = null;
                                    }

                                    scope.dashboardDataService.updateComponent(componentData);

                                    scope.fillInModeData.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);


                                    if (res.action === 'save') {
                                        saveComponentSettings();
                                    }

                                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.RELOAD_COMPONENT);
                                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                                }

                            });

                        });

                    } else {

                        scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                            var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                            if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                                scope.readyStatus.data = 'ready';

                                setTimeout(function () {
                                    scope.$apply();
                                }, 0)

                            } else if (status === dashboardComponentStatuses.ERROR) {

                                scope.compErrorMessage = 'ERROR';
                                var componentError = scope.dashboardDataService.getComponentError(scope.item.data.id);

                                if (componentError) {
                                    scope.compErrorMessage = 'ERROR: ' + componentError.displayMessage;
                                }

                                scope.readyStatus.data = 'error';

                                setTimeout(function () {
                                    scope.$apply();
                                }, 0)

                            }

                        });

                    }

                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {

                        componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                        scope.vm.componentData = componentData;

                        if (componentData.custom_component_name) {
                            scope.customName = componentData.custom_component_name;
                        } else {
                            scope.customName = null;
                        }

                    });

                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.COMPONENT_BLOCKAGE_ON, function () {

                        console.log('scope.readyStatus.disabled = true;')
                        console.log(Date.now());
                        scope.readyStatus.disabled = true;

                    });

                    scope.dashboardComponentEventService.addEventListener(dashboardEvents.COMPONENT_BLOCKAGE_OFF, function () {

                        console.log('scope.readyStatus.disabled = false;')
                        console.log(Date.now());

                        scope.readyStatus.disabled = false;

                    });

                };

                scope.init = function () {

                    scope.initEventListeners();

                    if (scope.fillInModeData) {

                        scope.readyStatus.data = 'ready';

                    } else {

                        scope.dashboardDataService.setComponentRefreshRestriction(scope.item.data.id, false);

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    }

                };

                scope.init()

            }
        }
    }
}());