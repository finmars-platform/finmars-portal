/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/procedures/pricingProcedureService').default;

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.readyStatus = false;
        vm.creating = false;

        vm.item = {
            instrument_type_filters: [],
            pricing_policy_filters: [],
            portfolio_filters: [],

            instrument_pricing_scheme_filters: [],
            currency_pricing_scheme_filters: [],

            instrument_pricing_condition_filters: [2, 3],
            currency_pricing_condition_filters: [2, 3],
        };

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

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.creating = true;

            var pprocedureData = JSON.parse(angular.toJson(vm.item));

            if (pprocedureData.price_date_from_expr) {
                pprocedureData.price_date_from = null
            }

            if (pprocedureData.price_date_to_expr) {
                pprocedureData.price_date_to = null
            }

            if (pprocedureData.portfolio_filters) {
                pprocedureData.portfolio_filters = pprocedureData.portfolio_filters.join(',');
            }

            if (pprocedureData.pricing_policy_filters) {
                pprocedureData.pricing_policy_filters = pprocedureData.pricing_policy_filters.join(',');
            }

            if (pprocedureData.instrument_type_filters) {
                pprocedureData.instrument_type_filters = pprocedureData.instrument_type_filters.join(',');
            }

            if (pprocedureData.instrument_pricing_scheme_filters) {
                pprocedureData.instrument_pricing_scheme_filters = pprocedureData.instrument_pricing_scheme_filters.join(',');
            }

            if (pprocedureData.instrument_pricing_condition_filters) {
                pprocedureData.instrument_pricing_condition_filters = pprocedureData.instrument_pricing_condition_filters.join(',');
            }

            if (pprocedureData.currency_pricing_scheme_filters) {
                pprocedureData.currency_pricing_scheme_filters = pprocedureData.currency_pricing_scheme_filters.join(',');
            }

            if (pprocedureData.currency_pricing_condition_filters) {
                pprocedureData.currency_pricing_condition_filters = pprocedureData.currency_pricing_condition_filters.join(',');
            }

            pricingProcedureService.create(pprocedureData).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };

        /*vm.getPortfolios = function () {

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

        };*/

        vm.init = function () {

            if (data.item) {
                vm.item = data.item;
            }

            pricingProcedureService.loadRelatedData().then(function (relatedData) {

                vm.instrumentTypes = relatedData.instrumentTypes;
                vm.pricingPolicies = relatedData.pricingPolicies;
                vm.portfolios = relatedData.portfolios;

                vm.instrumentPricingSchemes = relatedData.instrumentPricingSchemes;
                vm.currencyPricingSchemes = relatedData.currencyPricingSchemes;

                vm.readyStatus = true;
                $scope.$apply();

            });

        };

        vm.init();

    }

}());