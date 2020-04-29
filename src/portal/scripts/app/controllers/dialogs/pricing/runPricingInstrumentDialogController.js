/**
 * Created by szhitenev on 29.04.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');
    var pricingPolicyService = require('../../../services/pricingPolicyService');


    module.exports = function ($scope, $mdDialog, data) {

        console.log('runPricingInstrumentDialogController.data', data);

        var vm = this;

        vm.instrument = data.instrument;
        vm.report_date = data.report_date;
        vm.item = {};

        vm.pricingPolicies = [];

        vm.pricingPolicyFilter = {};


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.type = 2; // Created By Instrument Type
            vm.item.name = 'name_placeholder'; // backend will reassign this property
            vm.item.user_code = 'user_code_placeholder'; // backend will reassign this property

            vm.item.instrument_filters = vm.instrument.user_code;

            vm.item.pricing_policy_filters = [];

            Object.keys(vm.pricingPolicyFilter).forEach(function (key) {

                if (vm.pricingPolicyFilter[key]) {
                    vm.item.pricing_policy_filters.push(key);
                }

            });

            if (vm.item.pricing_policy_filters) {
                vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.join(',');
            }


            pricingProcedureService.create(vm.item).then(function (data) {

                vm.item = data;

                pricingProcedureService.runProcedure(data.id, data).then(function (data) {

                    $mdDialog.hide({status: 'agree'});

                });
            })

        };

        vm.getPricingPolicies = function () {

            pricingPolicyService.getList({
                pageSize: 1000
            }).then(function (data) {

                vm.pricingPolicies = data.results.map(function (item) {

                    vm.pricingPolicyFilter[item.user_code] = false;

                    return {
                        id: item.user_code,
                        name: item.user_code
                    }

                });

                $scope.$apply();

            })

        };


        vm.init = function () {

            if (vm.report_date) {
                vm.item.price_date_from = vm.report_date;
                vm.item.price_date_to = vm.report_date;
            }

            vm.getPricingPolicies();

        };

        vm.init();

    }

}());