(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');


    module.exports = function () {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-control-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.fields = [];
                scope.entityType = null;

                scope.getEntityTypeByContentType = function (contentType) {

                    if (contentType === 'instruments.instrument') {
                        return 'instrument'
                    }

                    if (contentType === 'portfolios.portfolio') {
                        return 'portfolio'
                    }

                    if (contentType === 'accounts.account') {
                        return 'account'
                    }

                    if (contentType === 'currencies.currency') {
                        return 'currency'
                    }

                    if (contentType === 'instruments.pricingpolicy') {
                        return 'pricing-policy'
                    }

                };

                scope.getData = function () {

                    entityResolverService.getList(scope.entityType).then(function (data) {

                        scope.fields = data.results;

                        scope.$apply(function () {

                            setTimeout(function () {
                                $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                    ev.stopPropagation();
                                });
                            }, 100);
                        });

                    });
                };


                scope.valueChanged = function () {

                    console.log('valueChanged', scope.item.data.store);
                    console.log('valueChanged.value', scope.item.data.store.value);

                    var componentsOutputs = scope.dashboardDataService.getAllComponentsOutputs();
                    var compsKeys = Object.keys(componentsOutputs);

                    if (compsKeys.length > 0) {
                        compsKeys.forEach(function (compKey) {
                            componentsOutputs[compKey].changedLast = false;
                        });
                        scope.dashboardDataService.setAllComponentsOutputs(componentsOutputs);
                    }

                    var changedData = {
                        changedLast: true,
                        data: null
                    };

                    if (scope.item.data.store) {
                        changedData.data = JSON.parse(JSON.stringify(scope.item.data.store));
                    }

                    scope.dashboardDataService.setComponentOutput(scope.item.data.id, changedData);
                    scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id);

                    if (scope.item.data.settings.auto_refresh) {
                        scope.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
                    }


                };

                scope.clearValue = function () {

                    scope.item.data.store.value = null;
                    scope.item.data.store.name = '';
                    scope.valueChanged()

                };

                scope.initEventListeners = function(){

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if(status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                };

                scope.init = function () {

                    scope.entityType = scope.getEntityTypeByContentType(scope.item.data.settings.content_type);

                    if (!scope.item.data.store) {
                        scope.item.data.store = {} // "store" - property for all dashboard data related properties
                    }

                    console.log('scope.item', scope);

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);


                    scope.initEventListeners()


                };

                scope.init();


            }
        }
    }
}());