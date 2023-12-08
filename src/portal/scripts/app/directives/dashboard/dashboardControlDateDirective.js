(function () {

    'use strict';

    const metaService = require('../../services/metaService');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var directivesEvents = require('../../services/events/directivesEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');
    var expressionService = require('../../services/expression.service');

    var EventService = require('../../services/eventService');

    module.exports = function (metaContentTypesService, entityResolverService, uiService, reportHelper) {
        return {
            restriction: 'E',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '=',
            },
            templateUrl: 'views/directives/dashboard/dashboard-control-date-view.html',
            link: function (scope, elem, attr) {

                scope.processing = false;

                scope.valueChanged = function (changedValue) {

                    console.log('valueChanged', scope.item.data.store);
                    console.log('valueChanged.value', scope.item.data.store.value);

                    scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                    scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);

                };

                function getTodaysDate() {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                    const day = String(today.getDate()).padStart(2, '0');

                    return `${year}-${month}-${day}`;
                }

                const initComponent = async function () {

                    scope.processing = true;

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.buttons = [];

                    if (!scope.item.data.store) scope.item.data.store = {};


                    if (!scope.item.data.store.value) {

                        // No value found in layout, trying to calculate default value

                        if (scope.componentData.settings.default_value_expression) {

                            expressionService.getResultOfExpression({
                                expression: scope.componentData.settings.default_value_expression,
                                is_eval: true
                            }).then(function (data) {

                                if (data.result) {
                                    scope.item.data.store.value = data.result;
                                }

                                scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                                scope.processing = false;
                                scope.$apply();

                            }).catch(function (error) {

                                console.log("dashboard.control.date.invalid_expression", error)

                                scope.item.data.store.value = getTodaysDate();

                                scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                                scope.processing = false;

                            })

                        } else {

                            scope.item.data.store.value = getTodaysDate();
                            scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            scope.processing = false;

                        }

                    } else {

                        // Value set from layout state, just activate component

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        scope.processing = false;
                    }


                };

                var init = function () {


                    /*
                     * IMPORTANT: listeners should be added BEFORE
                     * setting status INIT and dispatching event COMPONENT_STATUS_CHANGE.
                     * Otherwise they will not be active when dashboardController dispatches
                     * events in reaction to event COMPONENT_STATUS_CHANGE.
                     * */
                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) {

                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                            initComponent();

                        }

                    });

                    scope.dashboardEventService.addEventListener(dashboardEvents.DASHBOARD_STATE_CHANGE, function () {

                        var value = scope.dashboardDataService.getComponentOutput(scope.componentData.user_code)

                        scope.item.data.store.value = value;

                    })

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        initComponent();

                    })

                    // Component put himself in INIT Status
                    // so that dashboard manager can start processing it
                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                }

                init();

            }
        }
    }
}());