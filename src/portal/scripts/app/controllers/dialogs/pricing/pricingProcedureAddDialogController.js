/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');

    var instrumentService = require('../../../services/instrumentService');
    var instrumentTypeService = require('../../../services/instrumentTypeService');
    var pricingPolicyService = require('../../../services/pricingPolicyService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.instruments = [];
        vm.pricingPolicies = [];

        vm.pricing_policy_filters = [];
        vm.instrument_filters = [];

        vm.toggleStatus = {
            'date_both': 'datepicker',
            'price_date_from': 'datepicker',
            'price_date_to': 'datepicker',
            'price_balance_date': 'datepicker',
            'accrual_date_from': 'datepicker',
            'accrual_date_to': 'datepicker'
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

            if (vm.item.isRange) {

                vm.item.date_both = null;
                vm.item.date_both_expr = null;

            } else {

                if (vm.item.date_both_expr) {

                    vm.item.price_date_from = null;
                    vm.item.price_date_to = null;

                    vm.item.price_date_from_expr = vm.item.date_both_expr;
                    vm.item.price_date_to_expr = vm.item.date_both_expr;

                } else {

                    vm.item.price_date_from_expr = null;
                    vm.item.price_date_to_expr = null;

                    vm.item.price_date_from = vm.item.date_both;
                    vm.item.price_date_to = vm.item.date_both;

                }
            }

            if (vm.item.price_date_from_expr) {
                vm.item.price_date_from = null
            }

            if (vm.item.price_date_to_expr) {
                vm.item.price_date_to = null
            }

            if (vm.item.price_balance_date_expr) {
                vm.item.price_balance_date = null
            }

            if (vm.item.accrual_date_from_expr) {
                vm.item.accrual_date_from = null
            }

            if (vm.item.accrual_date_to_expr) {
                vm.item.accrual_date_to = null
            }

            if (vm.item.pricing_policy_filters) {
                vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.join(',');
            }

            if (vm.item.instrument_filters) {
                vm.item.instrument_filters = vm.item.instrument_filters.join(',');
            }

            if (vm.item.instrument_type_filters) {
                vm.item.instrument_type_filters = vm.item.instrument_type_filters.join(',');
            }

            pricingProcedureService.create(vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };

        vm.getInstruments = function () {

            instrumentService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.instruments = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.instruments', vm.instruments);

                $scope.$apply();

            })

        };

        vm.getInstrumentTypes = function () {

            instrumentTypeService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.instrument_types = data.results.map(function (item) {

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                console.log('vm.instrument_types', vm.instrument_types);

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

        vm.init = function () {

            vm.getPricingPolicies();
            vm.getInstrumentTypes();
            vm.getInstruments();

        };

        vm.init();

    }

}());