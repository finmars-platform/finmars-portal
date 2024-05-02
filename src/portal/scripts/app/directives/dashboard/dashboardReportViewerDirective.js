const dashboardEvents = require("../../services/dashboard/dashboardEvents");
const dashboardComponentStatuses = require("../../services/dashboard/dashboardComponentStatuses");
(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var evEvents = require('../../services/entityViewerEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    module.exports = function ($mdDialog, dashboardHelper, metaContentTypesService) {
        return {
            restriction: 'E',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
                fillInModeData: '=?' // data about component inside tabs for filled in component
            },
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-view.html',
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: 'processing',
                    disabled: false
                };

                var componentData;
                var componentElem = elem[0].querySelector('.dashboardComponent');

                if (scope.item && scope.item.data) {

                    componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.type === 'report_viewer_split_panel') {
                        componentData.type = 'report_viewer';
                    }

                    if (componentData.custom_component_name) {
                        scope.customName = componentData.custom_component_name;
                    }

                }

                if (componentData && !componentData.settings.filters) {
                    componentData.settings.filters = {
                        show_filters_area: false,
                        show_use_from_above_filters: false,
                    }
                }

                scope.showFiltersArea = componentData.settings.filters.show_filters_area;
                scope.showUseFromAboveFilters = componentData.settings.filters.show_use_from_above_filters;

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentData: componentData,
                    entityType: componentData.settings.entity_type,
                    contentType: metaContentTypesService.findContentTypeByEntity(componentData.settings.entity_type),
                    componentElement: componentElem,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService
                };

                if (scope.fillInModeData) {
                    scope.vm.entityViewerDataService = scope.fillInModeData.entityViewerDataService;
                    scope.vm.attributeDataService = scope.fillInModeData.attributeDataService;
                }

                scope.openComponentSettingsEditorDialog = function ($event) {

                    var dashboardComponents = scope.dashboardDataService.getComponents();

                    $mdDialog.show({
                        controller: 'DashboardReportViewerComponentSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/dashboard/component-settings/dashboard-report-viewer-component-settings-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
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


                            if (res.action === 'save') {
                                dashboardHelper.saveComponentSettingsFromDashboard(scope.dashboardDataService, componentData, true);
                            }

                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            scope.disableFillInMode();

                        }

                    })

                };

                scope.toggleFilterBlock = function () {
                    dashboardHelper.toggleFilterBlock(scope);
                };

                scope.openMissingPricesDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'ReportPriceCheckerDialogController as vm',
                        templateUrl: 'views/dialogs/report-missing-prices/report-price-checker-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        locals: {
                            data: {
                                missingPricesData: scope.missingPricesData,
                                evDataService: scope.evDataService
                            }
                        }
                    })

                };

                scope.init = function () {

                    console.log("DASHBOARD.REPORT.INIT")

                    scope.readyStatus.data = 'processing'

                    // scope.initEventListeners();

                    scope.vm.componentData.settings.components.topPart = false; // for already existing layouts

                    scope.dashboardDataService.setComponentRefreshRestriction(scope.item.data.id, false);

                    // Will be set to active inside DashboardReportViewerController
                    // scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                    // scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    setTimeout(function () {
                        scope.readyStatus.data = 'ready';
                        scope.$apply();
                    }, 1000)

                };


                scope.dashboardInit = function () {

                    // Component put himself in INIT Status
                    // so that dashboard manager can start processing it
                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) {
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                            scope.init();
                        }

                    });

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        scope.init();

                    })

                }

                scope.dashboardInit();

            }
        }
    }
}());