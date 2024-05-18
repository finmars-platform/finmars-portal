(function () {

    /**
     * Created by szhitenev on 22.08.2023.
     */

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var evEvents = require('../../services/entityViewerEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    module.exports = function ($mdDialog, dashboardHelper, globalDataService) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-iframe-view.html',
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

                scope.lastSavedOutput = {};

                var componentData;
                var componentElem = elem[0].querySelector('.dashboardComponent');

                if (scope.item && scope.item.data) {
                    componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    if (componentData.chart_custom_name) {
                        scope.customName = componentData.chart_custom_name;
                    }

                }

                if (!componentData.settings.filters) {

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
                    componentElement: componentElem,
                    entityType: componentData.settings.entity_type,
                    dashboardDataService: scope.dashboardDataService,
                    dashboardEventService: scope.dashboardEventService
                };

                scope.toggleFilterBlock = function () {
                    dashboardHelper.toggleFilterBlock(scope);
                };

                scope.initEventListeners = function () {


                };


                scope.initIframe = function () {

                    console.log('initIframe.vm.componentData', scope.vm.componentData);

                    if (scope.vm.componentData.url_type == 'absolute_url') {
                        scope.vm.url = scope.vm.componentData.url
                    } else {

                        if (scope.vm.currentMasterUser.realm_code) {
                            scope.vm.url = window.location.origin + '/' + scope.vm.currentMasterUser.realm_code + '/' + scope.vm.currentMasterUser.space_code + scope.vm.componentData.url
                        } else {
                            // componentData.url must start from /
                            scope.vm.url = window.location.origin + '/' + scope.vm.currentMasterUser.base_api_url + scope.vm.componentData.url
                        }
                    }

                }

                scope.init = function () {

                    scope.readyStatus.data = 'ready';

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initIframe();

                    scope.initEventListeners(); // init listeners after component init

                }

                scope.dashboardInit = function () {

                    console.log("Iframe  vm", scope.vm);
                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.vm.currentMasterUser = globalDataService.getMasterUser();

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.retryCount = 0;

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        scope.init();

                    })

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) {
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                            scope.init();
                        }

                    });


                    //
                    //
                    // scope.initIframe();
                    //
                    // scope.initEventListeners(); // init listeners after component init
                    //
                    // scope.readyStatus.data = 'ready';


                };

                scope.dashboardInit()

            }
        }
    }
}());