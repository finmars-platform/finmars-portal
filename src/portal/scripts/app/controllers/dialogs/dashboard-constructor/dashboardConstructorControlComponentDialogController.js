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

        if (vm.item.defaultValue) {

            vm.defaultValue = vm.item.defaultValue;

        } else {

            vm.defaultValue = {
                mode: 2,
                entity_type: null,
                layout: null,
                report_field: null,
                setValue: null
            };

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

            vm.getLayoutsList();

        };


        vm.onRvLayoutChange = function () {

            if (!vm.defaultValue.layout) {
                return;
            }

            vm.defaultValue.report_field = null;

            vm.requestReportFieldsFromLayout(vm.defaultValue.layout);


        };


        vm.requestReportFieldsFromLayout = function (layoutId) {

            vm.processing = true;
            $scope.$apply();

            return uiService.getListLayoutByKey(layoutId).then(function (layout) {

                vm.reportFields = getReportFields(vm.defaultValue.entity_type, layout);


                if (vm.defaultValue.report_field) {

                    vm.defaultValue.report_field = vm.reportFields.find(function(reportField) {

                        return reportField.key === vm.defaultValue.report_field;

                    });

                }

                if (vm.defaultValue.entity_type === 'balance-report') {

                    vm.defaultValue.report_field = vm.reportFields[0];

                }

                vm.processing = false;

                $scope.$apply();

            }).catch(function() {

                vm.processing = false;
                $scope.$apply();

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
                };
            });
        };

        var getItemDefaultValue = function (defaultValue) {

            if (defaultValue.mode === 1) {
                return {mode: 1, setValue: defaultValue.setValue};
            }

            if (defaultValue.mode === 0) {
                return {
                    mode: 0,
                    entity_type: defaultValue.entity_type,
                    layout: defaultValue.layout,
                    report_field: defaultValue.report_field.key
                };
            }

            return null;

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.settings.value_type = parseInt(vm.item.settings.value_type, 10);
            var defaultValue = getItemDefaultValue(vm.defaultValue);

            if (defaultValue) {

                vm.item.defaultValue = defaultValue;

            } else {

                delete vm.item.defaultValue;

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

        vm.getLayoutsList = function () {
            vm.processing = true;

            return uiService.getListLayout(vm.defaultValue.entity_type).then(function (data) {

                var layouts = data.results;
                vm.layoutsWithLinkToFilters = evRvLayoutsHelper.getDataForLayoutSelectorWithFilters(layouts);
                vm.processing = false;

                $scope.$apply();

            }).catch(function() {
                vm.processing = false;
                $scope.$apply();
            });

        };

        vm.isValidDefaultValue = function () {

            if (vm.defaultValue.mode === 0) { // Get default value

                return vm.defaultValue.entity_type
                    && vm.defaultValue.layout
                    && vm.defaultValue.report_field
                    && Object.keys(vm.defaultValue.report_field).length > 0;

            }

            if (vm.defaultValue.mode === 1) { // Set default value

                return Boolean(Date.parse(vm.defaultValue.setValue));

            }

            return vm.defaultValue.mode === 2  // No default value

        };


        vm.init = function () {

            vm.componentsTypes = dataService.getComponents();

            if (vm.defaultValue.mode !== 0) {
                return;
            }

            vm.getLayoutsList().then(function () {

                vm.requestReportFieldsFromLayout(vm.defaultValue.layout);

            });


        };

        vm.init()
    }

}());