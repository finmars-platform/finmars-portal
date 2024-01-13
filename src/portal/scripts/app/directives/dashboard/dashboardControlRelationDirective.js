(function () {

    'use strict';

    const metaService = require('../../services/metaService').default;

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var directivesEvents = require('../../services/events/directivesEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var EventService = require('../../services/eventService');
    var expressionService = require('../../services/expression.service');

    // Control picker for date is deprecated here
    // moved to dashboardControlDateDirective to reduce complexity of this code
    // FN-2320 2023-11-10 szhitenev

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
            templateUrl: 'views/directives/dashboard/dashboard-control-relation-view.html',
            link: function (scope, elem, attr) {

                scope.selOptions = [];
                scope.entityType = null;

                scope.entityData = {
                    value: null
                }

                scope.selectorType = null;


                scope.getEntityTypeByContentType = function (contentType) {
                    return metaContentTypesService.findEntityByContentType(contentType);
                };

                let entitiesList = [];

                scope.getOptionsForSelectors = async function () {

                    entitiesList = [];
                    scope.selOptions = [];

                    const args = [
                        scope.entityType,
                        {
                            pageSize: 1000,
                            page: 1,
                        },
                    ];

                    entitiesList = await metaService.loadDataFromAllPages(
                        entityResolverService.getListLight,
                        args
                    );

                    scope.selOptions = entitiesList.map(entity => {
                        return {id: entity.user_code, name: entity.short_name}
                    })

                    scope.$apply(function () {

                        setTimeout(function () {
                            $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                ev.stopPropagation();
                            });
                        }, 100);

                    });

                };

                /** Load options for multi selector when it is opened */
                scope.getDataForMultiselect = function () {

                    return new Promise(function (resolve, reject) {

                        entityResolverService.getList(scope.entityType, {pageSize: 1000}).then(function (data) {

                            var options = data.results.map(function (item) {
                                return {id: item.user_code, name: item.short_name};
                            });

                            resolve(options);

                        }).catch(function (e) {
                            reject(e);
                        });
                    })
                };

                scope.valueChanged = function (changedValue) {

                    console.log('valueChanged', scope.item.data.store);
                    console.log('valueChanged.value', scope.item.data.store.value);

                    scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                    scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_CHANGE);

                };

                // This is component init itself
                const initComponent = async function () {

                    scope.processing = true;

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);
                    scope.entityType = scope.getEntityTypeByContentType(scope.componentData.settings.content_type);

                    scope.selectorType = entityResolverService.getSelectByEntityType(scope.entityType);

                    // TODO WTF for currency special select? Need discussion
                    if (scope.entityType === 'currency') {
                        scope.selectorType = 'dropdownSelect';
                    }

                    await scope.getOptionsForSelectors();

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

                                console.log("dashboard.control.relation.invalid_expression", error)

                                scope.item.data.store.value = null;

                                scope.dashboardDataService.setComponentOutput(scope.componentData.user_code, scope.item.data.store.value);

                                scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                                scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                                scope.processing = false;

                            })

                        } else {

                            if (scope.componentData.settings.multiple) {
                                scope.item.data.store.value = [];
                            } else {
                                scope.item.data.store.value = null;
                            }
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

                    scope.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {

                        scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.PROCESSING);
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                        initComponent();

                    })

                    scope.dashboardEventService.addEventListener(dashboardEvents.DASHBOARD_STATE_CHANGE, function () {

                        var value = scope.dashboardDataService.getComponentOutput(scope.componentData.user_code)

                        scope.item.data.store.value = value;

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