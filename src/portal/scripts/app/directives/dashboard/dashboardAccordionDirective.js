(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var transactionTypeService = require('../../services/transactionTypeService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');

    var instrumentDownloadSchemeService = require('../../services/import/instrumentDownloadSchemeService');

    var pricingProcedureService = require('../../services/procedures/pricingProcedureService').default;

    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

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

                scope.syncAccordionBackdrop = function () {

                    elem = document.querySelector('.dashboard-component-id-' + scope.item.data.id)

                    var container = $(elem).parent().parent().parent().parent().parent().parent()[0] // wtf? todo refactor

                    // console.log('accordion_elem', elem);
                    // console.log('accordion_elem container', container);

                    var backdrop = document.querySelector('.dashboard-accordion-backdrop-id' + scope.item.data.id)

                    if (!backdrop) {

                        var div = document.createElement('div')
                        div.classList.add('dashboard-accordion-backdrop')
                        div.classList.add('dashboard-accordion-backdrop-id' + scope.item.data.id)

                        backdrop = container.appendChild(div)
                    }

                    backdrop.classList.remove('hidden');

                    if (scope.item.data.folded) {

                        backdrop.classList.add('hidden');

                    } else {

                        var accordions = document.querySelectorAll('.dashboard-accordion-component')

                        var currentRowNumber = scope.rowNumber;
                        var nextAccordionRowNumber;
                        var nextAccordion;
                        var currentAccordionIndex;

                        var currentAccordionHeightInRows;


                        accordions.forEach(function (item, index) {

                            if (item.classList.contains('dashboard-component-id-' + scope.item.data.id)) {
                                currentAccordionIndex = index
                            }

                            if (currentAccordionIndex + 1 === index) {
                                nextAccordion = item
                            }


                        })

                        if (nextAccordion) {
                            nextAccordionRowNumber = parseInt(nextAccordion.dataset.rowNumber, 10)

                            // console.log('nextAccordionRowNumber', nextAccordionRowNumber);

                            currentAccordionHeightInRows = nextAccordionRowNumber - currentRowNumber;

                        } else {

                            var rows = container.querySelectorAll('.dashboard-rows-holder')

                            currentAccordionHeightInRows = 0

                            rows.forEach(function (item) {

                                var rowNum = parseInt(item.dataset.row, 10)

                                if (rowNum > currentRowNumber) {
                                    currentAccordionHeightInRows = currentAccordionHeightInRows + 1;
                                }

                            })

                        }

                        // console.log('currentRowNumber', currentRowNumber);
                        // console.log('currentAccordionHeightInRows', currentAccordionHeightInRows);

                        currentAccordionHeightInRows = currentAccordionHeightInRows - 1;

                        if (currentAccordionHeightInRows < 0) {
                            currentAccordionHeightInRows = 0;
                        }

                        var parentRow = $(elem).parentElement.parentElement.parentElement.parentElement;

                        backdrop.style.top = parentRow.offsetTop + 60 + 'px';
                        backdrop.style.height = currentAccordionHeightInRows * 64 + 'px';

                    }


                }

                scope.toggleAccordion = function ($event, item) {

                    item.data.folded = !item.data.folded;

                    console.log("here?", $event.target)

                    setTimeout(function () {
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.RESIZE);
                    }, 100); // need for resize query .folded rows

                    scope.syncAccordionBackdrop();
                }

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.componentName = scope.componentData.custom_component_name

                    console.log("Accordion data ", scope.componentData);

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    setTimeout(function () {

                        scope.syncAccordionBackdrop();

                    }, 0)

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

                }

                scope.dashboardInit();


            }
        }
    }
}());