/**
 * Created by mevstratov on 28.06.2022.
 */
(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var transactionTypeService = require('../../services/transactionTypeService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');

    var instrumentDownloadSchemeService = require('../../services/import/instrumentDownloadSchemeService');

    var pricingProcedureService = require('../../services/procedures/pricingProcedureService').default;
    var supersetService = require("../../services/supersetService");

    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;
    var embeddedsdk = require("@superset-ui/embedded-sdk");


    module.exports = function dashboardSupersetDashboardDirective($mdDialog, $state) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-superset-dashboard-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.itemsList = [];

                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                };

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.componentName = scope.componentData.custom_component_name


                    scope.id = scope.componentData.settings.id;
                    scope.supersetDomain = scope.componentData.settings.supersetDomain

                    scope.containerId = 'superset-container-' + scope.id

                    setTimeout(() => {
                        embeddedsdk.embedDashboard({
                            id: scope.id, // given by the Superset embedding UI
                            supersetDomain: scope.supersetDomain,
                            mountPoint: document.getElementById(scope.containerId), // any html element that can contain an iframe
                            fetchGuestToken: function () {

                                return new Promise(function (resolve, reject) {
                                    supersetService.getSecurityToken(scope.id).then((data) => {
                                        resolve(data.token);
                                    })
                                })

                            },
                            dashboardUiConfig: {hideTitle: true}, // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
                            debug: false
                        });
                    }, 500)

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initEventListeners();

                };

                scope.getSelectedText = function () {
                    return scope.componentName;
                }


                scope.init()


            }
        }
    }
}());