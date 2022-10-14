/**
 * Created by mevstratov on 07.10.2022.
 */

(function () {

    'use strict';
    var cookieService = require('../../../../../core/services/cookieService');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var transactionTypeService = require('../../services/transactionTypeService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');

    var instrumentDownloadSchemeService = require('../../services/import/instrumentDownloadSchemeService');

    var pricingProcedureService = require('../../services/procedures/pricingProcedureService');
    var supersetService = require("../../services/supersetService");

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');
    // var embeddedsdk = require("@superset-ui/embedded-sdk");
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function dashboardFinmarsWidgetDirective($mdDialog, $state, globalDataService) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-finmars-widget-view.html',
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

                scope.date_to = null
                scope.portfolio = null

                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                        var componentsOutputs = scope.dashboardDataService.getAllComponentsOutputs();

                        console.log('componentsOutputs', componentsOutputs)

                        Object.keys(componentsOutputs).forEach(function (compKey) {

                            if (componentsOutputs[compKey]) {

                                try {

                                    if (componentsOutputs[compKey].name.indexOf('ate') !== -1) {
                                        if (componentsOutputs[compKey].data) {
                                            scope.date_to = componentsOutputs[compKey].data.value
                                        }
                                    }

                                    if (componentsOutputs[compKey].name.indexOf('ortfolio') !== -1) {
                                        if (componentsOutputs[compKey].data) {
                                            scope.portfolio = componentsOutputs[compKey].data.value
                                        }
                                    }

                                } catch (error) {
                                    console.log('could not fetch value')
                                }

                            }


                        })

                        scope.updateWidgetSettings();

                    });

                };

                scope.updateWidgetSettings = function () {


                    if (window.finmarsWidgetsInstance) {
                        window.finmarsWidgetsInstance.setOptions({
                            portfolioId: scope.portfolio, // Readme
                            date_to: scope.date_to, // Readme
                            date_from: undefined, // Readme
                            benchmark: 'sp_500', // Readme
                        })
                    } else {
                        console.warn("finmarsWidgetsInstance is not defined")
                    }


                    // setTimeout(() => {

                    // document.querySelector(scope.containerId).innerHTML = '';

                    // console.log('scope.portfolio ', scope.portfolio)
                    // console.log('scope.data ',scope.date_to )


                    // let FinmarsWidgets2 = new window.FinmarsWidgets({
                    //     apiUrl: baseUrl + '/v/',
                    //     workspace: scope.currentMasterUser.base_api_url,
                    //     apiToken: cookieService.getCookie('access_token'),
                    //     // websocketUrl: "wss://finmars.com/",
                    //     options: {
                    //         portfolioId: scope.portfolio, // Readme
                    //         date_to: scope.date_to, // Readme
                    //         date_from: undefined, // Readme
                    //         benchmark: 'sp_500', // Readme
                    //     },
                    //     widgets: [
                    //         {
                    //             name: scope.name,
                    //             container: scope.containerId// e.g. finmarsChart1
                    //         },
                    //         // {
                    //         //     name: "balance",
                    //         //     container: "#balance_datail" // e.g. finmarsChart1
                    //         // },
                    //         // {
                    //         //     name: "pl",
                    //         //     container: "#balance_pl" // e.g. finmarsChart1
                    //         // },
                    //         // {
                    //         //     name: "nav",
                    //         //     container: "#balance_nav" // e.g. finmarsChart1
                    //         // }
                    //     ]
                    // })


                    // }, 500)

                }

                scope.init = function () {


                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.id = scope.componentData.settings.id;
                    scope.name = scope.componentData.settings.name

                    scope.currentMasterUser = globalDataService.getMasterUser();
                    scope.containerId = '#finmars-widget-container-' + scope.id


                    scope.componentName = scope.componentData.custom_component_name

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initEventListeners();

                    setTimeout(function () {
                        if (!window.finmarsWidgetsInstance) {
                            window.finmarsWidgetsInstance = new window.FinmarsWidgets(
                                {
                                    apiUrl: baseUrl + '/v/',
                                    workspace: scope.currentMasterUser.base_api_url,
                                    apiToken: cookieService.getCookie('access_token')
                                }
                            );
                        }

                        window.finmarsWidgetsInstance.addWidget({
                            name: scope.name,
                            container: scope.containerId // e.g. finmarsChart1
                        })

                        scope.updateWidgetSettings()

                    }, 100);


                };

                scope.getSelectedText = function () {
                    return scope.componentName;
                }


                scope.init()


            }
        }
    }
}());