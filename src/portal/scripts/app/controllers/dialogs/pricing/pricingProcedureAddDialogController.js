/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

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

                    m.item.price_date_from_expr = null;
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

            pricingProcedureService.create(vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };

        vm.init = function () {

        };

        vm.init();

    }

}());