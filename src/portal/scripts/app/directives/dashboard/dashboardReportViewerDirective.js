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
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                console.log('Dashboard Report Viewer Component', scope);

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
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE)

                };

                scope.init()

            }
        }
    }
}());