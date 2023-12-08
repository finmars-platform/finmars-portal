/**
 * Created by szhitenev on 11.11.2023.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, uiService, dashboardConstructorMethodsService, reportHelper, dashboardHelper, entityResolverService, item, dataService, multitypeFieldService) {

        var vm = this;
        vm.processing = false;
        vm.readyStatus = {
            layouts: false
        };

        if (item) {
            vm.item = item;
            delete vm.item.defaultValue;
        } else {
            vm.item = {
                type: 'control',
                id: null, // should be generated before create
                name: '',
                settings: {
                    value_type: 100
                }
            }
        }

        vm.componentsTypes = [];

        vm.contentTypes = [
            {
                name: 'Instrument',
                key: 'instruments.instrument'
            },
            {
                name: 'Portfolio',
                key: 'portfolios.portfolio',
                entityType: 'portfolio',
                reportOptionsKey: 'portfolios'
            },
            {
                name: 'Account',
                key: 'accounts.account',
                entityType: 'account',
                reportOptionsKey: 'accounts'
            },
            {
                name: 'Counterparty',
                key: 'counterparties.counterparty'
            },
            {
                name: 'Responsible',
                key: 'counterparties.responsible'
            },
            {
                name: 'Currency',
                key: 'currencies.currency',
                entityType: 'currency',
                reportOptionsKey: 'report_currency'
            },
            {
                name: 'Strategy 1',
                key: 'strategies.strategy1',
                entityType: 'strategy-1',
                reportOptionsKey: 'strategies1'
            },
            {
                name: 'Strategy 2',
                key: 'strategies.strategy2',
                entityType: 'strategy-2',
                reportOptionsKey: 'strategies2'
            },
            {
                name: 'Strategy 3',
                key: 'strategies.strategy3',
                entityType: 'strategy-3',
                reportOptionsKey: 'strategies3'
            },
            {
                name: 'Pricing Policy',
                key: 'instruments.pricingpolicy',
                entityType: 'pricing-policy',
                reportOptionsKey: 'pricing_policy'
            }
        ];

        vm.currentContentType = null;

        vm.onMultipleChange = function () {
            vm.defaultValue.setValue = null;
            vm.defaultValue.setValueName = null;
            vm.defaultValue.setValueObject = {};
        };

        vm.getContentTypeByKey = function (key) {

            return vm.contentTypes.find(function (type) {

                return type.key === key;

            });

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.currentContentType && vm.currentContentType.key) {

                vm.item.settings.content_type = vm.currentContentType.key;

            } else {

                delete vm.item.settings.content_type;

            }

            if (vm.item.id) {

                dataService.updateComponentById(vm.item);

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponents(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            vm.componentsTypes = dataService.getComponents();

            vm.currentContentType = vm.getContentTypeByKey(vm.item.settings.content_type);

        };

        vm.init();

    }

}());