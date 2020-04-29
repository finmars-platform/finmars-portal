(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var DashboardComponentDataService = require('../../services/dashboard/dashboardComponentDataService');
    var DashboardComponentEventService = require('../../services/dashboard/dashboardComponentEventService');

    module.exports = function () {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-report-viewer-grand-total-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.readyStatus = {
                    data: 'processing'
                };

                scope.dashboardComponentDataService = new DashboardComponentDataService;
                scope.dashboardComponentEventService = new DashboardComponentEventService;

                var componentData;

                console.log('componentData scope.item', scope.item);

                if (scope.item && scope.item.data) {
                    componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.custom_component_name) {
                        scope.customName = componentData.custom_component_name;
                    }

                }


                scope.vm = {
                    tabNumber: scope.tabNumber,
                    rowNumber: scope.rowNumber,
                    columnNumber: scope.columnNumber,
                    componentData: componentData,
                    //componentType: scope.item,
                    entityType: componentData.settings.entity_type,
                    //startupSettings: scope.item.data.settings,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService,
                    dashboardComponentDataService: scope.dashboardComponentDataService,
                    dashboardComponentEventService: scope.dashboardComponentEventService
                };

                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // Init calculation of a component

                            scope.readyStatus.data = 'ready';

                            setTimeout(function () {
                                scope.$apply();
                            },0)

                        } else if (status === dashboardComponentStatuses.ERROR) {

                            scope.compErrorMessage = 'ERROR';
                            var componentError = scope.dashboardDataService.getComponentError(scope.item.data.id);

                            if (componentError) {
                                scope.compErrorMessage = 'ERROR: ' + componentError.displayMessage;
                            }

                            scope.readyStatus.data = 'error';

                            setTimeout(function () {
                                scope.$apply();
                            },0)

                        }

                    });

                };

                scope.clearUseFromAboveFilters = function () {
                    scope.dashboardComponentEventService.dispatchEvent(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS);
                };

                scope.init = function () {

                    scope.initEventListeners();

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                };

                scope.init()


            }
        }
    }
}());