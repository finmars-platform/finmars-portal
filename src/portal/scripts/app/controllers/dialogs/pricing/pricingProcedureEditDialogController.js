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

        vm.itemId = data.item.id;

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

        vm.item = {};
        vm.readyStatus = {content: false};

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

            pricingProcedureService.update(vm.item.id, vm.item).then(function (data) {

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

        vm.getItem = function () {

            pricingProcedureService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                if (vm.item.pricing_policy_filters) {

                    vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.split(',');

                }

                if (vm.item.instrument_filters) {

                    vm.item.instrument_filters = vm.item.instrument_filters.split(',');

                }

                if (vm.item.instrument_type_filters) {

                    vm.item.instrument_type_filters = vm.item.instrument_type_filters.split(',');

                }


                if (vm.item.price_date_to || vm.item.price_date_to_expr) {
                    vm.item.isRange = true
                }


                if (vm.item.price_date_from_expr) {

                    vm.toggleStatus.price_date_from = 'expr';

                    if (vm.item.isRange) {
                        vm.toggleStatus.date_both = 'expr';
                    }

                }

                if (vm.item.price_date_to_expr) {
                    vm.toggleStatus.price_date_to = 'expr';

                    if (vm.item.isRange) {
                        vm.toggleStatus.date_both = 'expr';
                    }
                }

                if (vm.item.price_balance_date_expr) {
                    vm.toggleStatus.price_balance_date = 'expr';
                }

                if (vm.item.accrual_date_from_expr) {
                    vm.toggleStatus.accrual_date_from = 'expr';
                }

                if (vm.item.accrual_date_to_expr) {
                    vm.toggleStatus.accrual_date_to = 'expr';
                }

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getItem();

            vm.getInstruments();
            vm.getInstrumentTypes();
            vm.getPricingPolicies();

        };

        vm.init();

    }

}());