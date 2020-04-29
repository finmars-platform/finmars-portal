/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');

    var portfolioService = require('../../../services/portfolioService');
    var instrumentTypeService = require('../../../services/instrumentTypeService');
    var pricingPolicyService = require('../../../services/pricingPolicyService');

    var instrumentPricingSchemeService = require('../../../services/pricing/instrumentPricingSchemeService');
    var currencyPricingSchemeService = require('../../../services/pricing/currencyPricingSchemeService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.readyStatus = {procedure: false};

        vm.portfolios = [];
        vm.pricingPolicies = [];
        vm.instrumentTypes = [];
        vm.instrumentPricingSchemes = [];
        vm.currencyPricingSchemes = [];


        vm.portfolio_filters = [];
        vm.pricing_policy_filters = [];
        vm.instrument_type_filters = [];
        vm.instrument_pricing_scheme_filters = [];
        vm.currency_pricing_scheme_filters = [];


        vm.toggleStatus = {
            'price_date_from': 'datepicker',
            'price_date_to': 'datepicker'
        };

        vm.toggle = function (key) {

            if (vm.toggleStatus[key] === 'datepicker') {
                vm.toggleStatus[key] = 'expr'
            } else {
                vm.toggleStatus[key] = 'datepicker'
            }

            vm.item[key] = null;
            vm.item[key + '_expr'] = null;

        };

        vm.item = {};
        vm.readyStatus = {content: false};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {


            if (vm.item.price_date_from_expr) {
                vm.item.price_date_from = null
            }

            if (vm.item.price_date_to_expr) {
                vm.item.price_date_to = null
            }

            if (vm.item.portfolio_filters) {
                vm.item.portfolio_filters = vm.item.portfolio_filters.join(',');
            }

            if (vm.item.pricing_policy_filters) {
                vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.join(',');
            }

            if (vm.item.instrument_type_filters) {
                vm.item.instrument_type_filters = vm.item.instrument_type_filters.join(',');
            }

            if (vm.item.instrument_pricing_scheme_filters) {
                vm.item.instrument_pricing_scheme_filters = vm.item.instrument_pricing_scheme_filters.join(',');
            }

            if (vm.item.instrument_pricing_condition_filters) {
                vm.item.instrument_pricing_condition_filters = vm.item.instrument_pricing_condition_filters.join(',');
            }

            if (vm.item.currency_pricing_scheme_filters) {
                vm.item.currency_pricing_scheme_filters = vm.item.currency_pricing_scheme_filters.join(',');
            }

            if (vm.item.currency_pricing_condition_filters) {
                vm.item.currency_pricing_condition_filters = vm.item.currency_pricing_condition_filters.join(',');
            }

            pricingProcedureService.update(vm.item.id, vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});
            })

        };

        vm.getPortfolios = function () {

            portfolioService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.portfolios = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.portfolios', vm.portfolios);

                $scope.$apply();

            })

        };

        vm.getInstrumentPricingSchemes = function () {

            instrumentPricingSchemeService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.instrumentPricingSchemes = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.instrumentPricingSchemes', vm.instrumentPricingSchemes);

                $scope.$apply();

            })

        };

        vm.getCurrencyPricingSchemes = function () {

            currencyPricingSchemeService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.currencyPricingSchemes = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.currencyPricingSchemes', vm.currencyPricingSchemes);

                $scope.$apply();

            })

        };

        vm.getInstrumentTypes = function () {

            instrumentTypeService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.instrumentTypes = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.instrumentTypes', vm.instrumentTypes);

                $scope.$apply();

            })

        };

        vm.getPricingPolicies = function () {

            pricingPolicyService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.pricingPolicies = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                $scope.$apply();

            })

        };

        vm.getItem = function () {

            pricingProcedureService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                if (vm.item.portfolio_filters) {

                    vm.item.portfolio_filters = vm.item.portfolio_filters.split(',');

                }

                if (vm.item.pricing_policy_filters) {

                    vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.split(',');

                }

                if (vm.item.instrument_type_filters) {

                    vm.item.instrument_type_filters = vm.item.instrument_type_filters.split(',');

                }

                if (vm.item.instrument_pricing_scheme_filters) {

                    vm.item.instrument_pricing_scheme_filters = vm.item.instrument_pricing_scheme_filters.split(',');

                }

                if (vm.item.instrument_pricing_condition_filters) {

                    vm.item.instrument_pricing_condition_filters = vm.item.instrument_pricing_condition_filters.split(',');

                }

                if (vm.item.currency_pricing_scheme_filters) {

                    vm.item.currency_pricing_scheme_filters = vm.item.currency_pricing_scheme_filters.split(',');

                }

                if (vm.item.currency_pricing_condition_filters) {

                    vm.item.currency_pricing_condition_filters = vm.item.currency_pricing_condition_filters.split(',');

                }

                if (vm.item.price_date_from_expr) {

                    vm.toggleStatus.price_date_from = 'expr';

                }

                if (vm.item.price_date_to_expr) {

                    vm.toggleStatus.price_date_to = 'expr';

                }

                vm.readyStatus.procedure = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getItem();

            vm.getInstrumentTypes();
            vm.getPricingPolicies();
            vm.getPortfolios();

            vm.getInstrumentPricingSchemes();
            vm.getCurrencyPricingSchemes();

        };

        vm.init();

    }

}());