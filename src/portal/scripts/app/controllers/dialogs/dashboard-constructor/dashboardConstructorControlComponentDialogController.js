/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');
    var evRvLayoutsHelper = require('../../../helpers/evRvLayoutsHelper');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService) {

        var vm = this;
        vm.processing = false;

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'control',
                id: null, // should be generated before create
                name: '',
                settings: {

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
                key: 'portfolios.portfolio'
            },
            {
                name: 'Account',
                key: 'accounts.account'
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
                key: 'currencies.currency'
            },
            {
                name: 'Strategy 1',
                key: 'strategies.strategy1'
            },
            {
                name: 'Strategy 2',
                key: 'strategies.strategy2'
            },
            {
                name: 'Strategy 3',
                key: 'strategies.strategy3'
            },
            {
                name: 'Pricing Policy',
                key: 'instruments.pricingpolicy'
            }
        ];

        vm.defaultValue = {
            mode: 2,
            entity_type: null,
            layout: null,
            report_field: {},
            setValue: null
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.settings.value_type = parseInt(vm.item.settings.value_type, 10);

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

            vm.componentsTypes = dataService.getComponents()

        };

        vm.isRequiredDefaultValue = function () {
            var dateValueType = 40;
            var contentTypesThatNeedsDefaultValues = [
                'portfolios.portfolio',
                'accounts.account',
                'currencies.currency',
                'strategies.strategy1',
                'strategies.strategy2',
                'strategies.strategy3',
                'instruments.pricingpolicy'
            ];

            return vm.item.settings.value_type === dateValueType || contentTypesThatNeedsDefaultValues.includes(vm.item.settings.content_type);

        };

        vm.reportTypeChange = function() {

            vm.defaultValue.layout = null;
            vm.defaultValue.report_field = null;

            vm.processing = true;

            uiService.getListLayout(vm.defaultValue.entity_type).then(function (data) {

                var layouts = data.results;
                vm.layoutsWithLinkToFilters = evRvLayoutsHelper.getDataForLayoutSelectorWithFilters(layouts);
                vm.processing = false;

                $scope.$apply();

            }).catch(function() {
                vm.processing = false;
            });

        };


        vm.onRvLayoutChange = function () {

            if (!vm.defaultValue.layout) {
                return;
            }

            vm.processing = true;
            $scope.$apply();

            vm.defaultValue.report_field = null;

            var layoutId = vm.defaultValue.layout;

            uiService.getListLayoutByKey(layoutId).then(function (layout) {

                vm.reportFields = getReportFields(vm.defaultValue.entity_type, layout);

                if (vm.defaultValue.entity_type === 'balance-report') {

                    vm.defaultValue.report_field = vm.reportFields[0];

                }

                vm.processing = false;

                $scope.$apply();

            }).catch(function() {
                vm.processing = false;
            });

        };


        var getReportFields = function (reportType, layout) {

            var defaultValueReportFields = {
                'balance-report': [
                    {key: 'report_date', name: 'Date'}
                ],
                'pl-report': [
                    {key: 'pl_first_date', name: 'Date from (excl)'},
                    {key: 'report_date', name: 'Date to (incl)'}
                ],
                'transaction-report': [
                    {key: 'begin_date', name: 'Date from (incl)'},
                    {key: 'end_date', name: 'Date to (incl)'}
                ]
            };

            return defaultValueReportFields[reportType].map(function (field) {
                return {
                    key: field.key,
                    name: field.name,
                    value: layout.data.reportOptions[field.key]
                }
            })
        };

        vm.init()
    }

}());
