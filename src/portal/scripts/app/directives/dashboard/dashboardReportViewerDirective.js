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
                fillInModeCallback: '&?'
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

                //var attributesDataService = null;
                //var columnsToManage = null;
                // var viewerTableCols = null;

                /*if (scope.item.data.user_settings) {

                    if (scope.item.data.user_settings.manage_columns) {
                        columnsToManage = scope.item.data.user_settings.manage_columns;
                    }

                }*/

                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentType: scope.item,
                    entityType: scope.item.data.settings.entity_type,
                    startupSettings: scope.item.data.settings,
                    userSettings: scope.item.data.user_settings,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService,
                    dashboardComponentDataService: scope.dashboardComponentDataService,
                    dashboardComponentEventService: scope.dashboardComponentEventService
                };

                /*scope.addColumnToReport = function (attribute) {

                    var colData = JSON.parse(JSON.stringify(attribute));

                    colData.columns = true;
                    viewerTableCols.push(colData);

                    scope.vm.dashboardComponentDataService.setViewerTableColumns(viewerTableCols);
                    scope.vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.UPDATE_VIEWER_TABLE_COLUMNS);

                };*/

                /*scope.saveReportLayout = function () {
                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.SAVE_VIEWER_TABLE_CONFIGURATION);
                };*/

                scope.turnOnFillInMode = function () {

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

                    /*scope.vm.dashboardComponentEventService.addEventListener(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED, function () {
                        attributesDataService = scope.vm.dashboardComponentDataService.getAttributeDataService();
                    });*/

                    /*scope.vm.dashboardComponentEventService.addEventListener(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED, function () {

                        var attributes = attributesDataService.getAllAttributesByEntityType(scope.vm.entityType);
                        viewerTableCols = scope.vm.dashboardComponentDataService.getViewerTableColumns();

                        if (columnsToManage && columnsToManage.length > 0) {

                            scope.availableForAdditionCols = attributes.filter(function (attr) {

                                if (columnsToManage.indexOf(attr.key) !== -1) {

                                    for (var i = 0; i < viewerTableCols.length; i++) {
                                        if (viewerTableCols[i].key === attr.key) {
                                            return false;
                                        }
                                    }

                                    return true;
                                }

                                return false;

                            });

                        }

                    });*/
                };

                scope.init = function () {

                    scope.initEventListeners();

                    scope.dashboardDataService.setComponentStatus(scope.vm.componentType.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE)

                };

                scope.init()

            }
        }
    }
}());