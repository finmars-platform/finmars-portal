(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var transactionTypeService = require('../../services/transactionTypeService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');

    var instrumentDownloadSchemeService = require('../../services/import/instrumentDownloadSchemeService');

    var pricingProcedureService = require('../../services/procedures/pricingProcedureService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function dashboardAccordionDirective($mdDialog, $state) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-accordion-view.html',
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

                scope.toggleAccordion = function ($event, item) {

                    item.data.folded = !item.data.folded;

                    setTimeout(function () {
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.RESIZE);
                    }, 100); // need for resize query .folded rows
                }

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.componentName = scope.componentData.custom_component_name

                    console.log("Accordion data ", scope.componentData);

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initEventListeners();

                };

                scope.init()


            }
        }
    }
}());