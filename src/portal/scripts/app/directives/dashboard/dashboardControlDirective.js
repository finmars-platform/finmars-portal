(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');

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

                    scope.dashboardDataService.setComponentOutput(scope.item.data.id, scope.item.data.store);
                    scope.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + scope.item.data.id)

                };

                scope.clearValue = function () {

                    scope.item.data.store.value = null;
                    item.data.store.name = '';
                    scope.valueChanged()

                };

                scope.init = function () {

                    scope.entityType = scope.getEntityTypeByContentType(scope.item.data.settings.content_type);

                    if (!scope.item.data.store) {
                        scope.item.data.store = {} // "store" - property for all dashboard data related properties
                    }


                };

                scope.init();


            }
        }
    }
}());