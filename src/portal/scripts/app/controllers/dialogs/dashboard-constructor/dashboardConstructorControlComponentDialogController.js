/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../../services/uiService');
    var entityResolverService = require('../../../services/entityResolverService');

    var evRvLayoutsHelper = require('../../../helpers/evRvLayoutsHelper');

    module.exports = function ($scope, $mdDialog, item, dataService, eventService) {

        var vm = this;
        vm.processing = false;

        if (item) {
            vm.item = item;
            delete vm.item.defaultValue;
        } else {
            vm.item = {
                type: 'control',
                id: null, // should be generated before create
                name: '',
                settings: {

                }
            }
        }

        vm.layouts = [];
        vm.layoutsWithLinkToFilters = [];
        vm.reportFields = [];
        vm.multiselectItems = [];

        if (vm.item.settings.defaultValue) {

            vm.defaultValue = vm.item.settings.defaultValue;

        } else {

            vm.defaultValue = {
                mode: 2,
                entity_type: null,
                layout: null,
                report_field: null,
                setValue: null,
                setValueName : null,
                setValueTitle: null
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
                key: 'portfolios.portfolio',
                relationType: 'portfolio',
                reportOptionsKey: 'portfolios'
            },
            {
                name: 'Account',
                key: 'accounts.account',
                relationType: 'account',
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
                relationType: 'currency',
                reportOptionsKey: 'report_currency'
            },
            {
                name: 'Strategy 1',
                key: 'strategies.strategy1',
                relationType: 'strategy-1',
                reportOptionsKey: 'strategies1'
            },
            {
                name: 'Strategy 2',
                key: 'strategies.strategy2',
                relationType: 'strategy-2',
                reportOptionsKey: 'strategies2'
            },
            {
                name: 'Strategy 3',
                key: 'strategies.strategy3',
                relationType: 'strategy-3',
                reportOptionsKey: 'strategies3'
            },
            {
                name: 'Pricing Policy',
                key: 'instruments.pricingpolicy',
                relationType: 'pricing-policy',
                reportOptionsKey: 'pricing_policy'
            }
        ];

        vm.currentContentType = null;

        vm.valueTypes = [
            {code: 10, name: 'Text' },
            {code: 20, name: 'Number' },
            {code: 40, name: 'Date' },
            {code: 100, name: 'Relation' },
        ];

        vm.isRequiredDefaultValue = function () {

            var isDateSelected = vm.item.settings.value_type === 40;
            var isRelationNeedDefaultValue = vm.currentContentType && vm.currentContentType.relationType;

            return isDateSelected || isRelationNeedDefaultValue;

        };

        vm.clearDefaultValue = function () {

            vm.defaultValue.layout = null;
            vm.defaultValue.entity_type = null;
            vm.defaultValue.setValue = null;
            vm.defaultValue.setValueName = null;
            vm.defaultValue.setValueTitle = null;
            vm.multiselectItems = [];

        };

        vm.onReportTypeChange = function() {

            vm.defaultValue.layout = null;
            vm.defaultValue.report_field = null;
            vm.layoutsWithLinkToFilters = [];
            vm.reportFields = [];

            vm.getLayoutsList();

        };

        vm.isTransactionReportDisabled = function () {

            if (!vm.currentContentType) {

                return false;

            }

            return vm.currentContentType.key === 'currencies.currency' || vm.currentContentType.key === 'instruments.pricingpolicy';

        };

        vm.onLayoutChange = function () {

            if (!vm.defaultValue.layout) {

                return;

            }

            if (vm.item.settings.value_type !== 40) { // not Date

                return;

            }

            vm.defaultValue.report_field = null;

            vm.extractReportFieldsFromLayout(vm.defaultValue.layout);

            $scope.$apply();

        };

        vm.extractReportFieldsFromLayout = function (layoutId) {

            var layout = vm.layouts.find(function (item) {

                return item.id === layoutId;

            });

            vm.reportFields = getReportFields(vm.defaultValue.entity_type, layout);


            if (vm.defaultValue.reportOptionsKey) {

                vm.defaultValue.report_field = vm.reportFields.find(function(reportField) {

                    return reportField.key === vm.defaultValue.reportOptionsKey;

                });

            }

            if (vm.defaultValue.entity_type === 'balance-report') {

                vm.defaultValue.report_field = vm.reportFields[0];

            }

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

                var setValueLabel = vm.currentContentType ? vm.currentContentType.name : '';

                return {
                    mode: 1,
                    setValue: defaultValue.setValue,
                    setValueName: defaultValue.setValueName,
                    setValueLabel: setValueLabel
                };

            }

            if (defaultValue.mode === 0) {

                var result = {
                    mode: 0,
                    entity_type: defaultValue.entity_type,
                    layout: defaultValue.layout
                }

                if (vm.item.settings.value_type === 40) { // Date

                    result.reportOptionsKey = defaultValue.report_field.key

                }

                if (vm.item.settings.value_type === 100) { // Relations

                    result.reportOptionsKey = vm.currentContentType.reportOptionsKey;

                }

                return result;

            }

            return null;

        };

        vm.getLayoutsList = function () {
            vm.processing = true;

            return uiService.getListLayout(vm.defaultValue.entity_type).then(function (data) {

                vm.layouts = data.results;

                vm.layoutsWithLinkToFilters = evRvLayoutsHelper.getDataForLayoutSelectorWithFilters(vm.layouts);

                vm.processing = false;
                $scope.$apply();

            }).catch(function() {

                vm.processing = false;
                $scope.$apply();

            });

        };

        vm.isValidDefaultValue = function () {

            if (vm.defaultValue.mode === 0) { // Get default value

                if (vm.item.settings.value_type === 40) { // Date

                    return vm.defaultValue.entity_type
                        && vm.defaultValue.layout
                        && vm.defaultValue.report_field
                        && Object.keys(vm.defaultValue.report_field).length > 0;

                }

                return vm.defaultValue.entity_type
                    && vm.defaultValue.layout

            }

            if (vm.defaultValue.mode === 1) { // Set default value

                if (vm.item.settings.value_type === 40) { //Date

                    return Boolean(Date.parse(vm.defaultValue.setValue));

                }

                if (Array.isArray(vm.defaultValue.setValue)) {

                    return vm.defaultValue.setValue.length > 0;

                }

                return Boolean(vm.defaultValue.setValue);

            }

            return vm.defaultValue.mode === 2  // No default value

        };

        vm.getCurrentValueTypeName = function () {

            var code = vm.item.settings.value_type;

            var valueType = vm.valueTypes.find(function (type) {

                return type.code === code;

            });

            if (!valueType) {

                return;

            }

            if (code === 100) { // Relation

                var contentTypeName = vm.currentContentType ? '/' + vm.currentContentType.name : '';

                return valueType.name + contentTypeName;
            }

            return valueType.name;

        };

        vm.getContentTypeByKey = function (key) {

            return vm.contentTypes.find(function (type) {

                return type.key === key;

            });

        };

        vm.getDataForMultiselect = function () {

            return entityResolverService.getList(vm.currentContentType.relationType);

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.settings.value_type = parseInt(vm.item.settings.value_type, 10);

            if (vm.currentContentType && vm.currentContentType.key) {

                vm.item.settings.content_type = vm.currentContentType.key;

            } else {

                delete vm.item.settings.content_type;

            }

            var defaultValue = getItemDefaultValue(vm.defaultValue);

            if (defaultValue) {

                vm.item.settings.defaultValue = defaultValue;

            } else {

                delete vm.item.settings.defaultValue;

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

            if (vm.item.settings.multiple) {

                vm.getDataForMultiselect().then(function (resData) {

                    vm.multiselectItems = JSON.parse(JSON.stringify(resData.results));

                });

            }


            if (vm.defaultValue.mode !== 0) { // user selected NOT 'Get default value'

                return;

            }

            vm.getLayoutsList().then(function () {

                vm.extractReportFieldsFromLayout(vm.defaultValue.layout);

            });


        };

        vm.init();
    }

}());