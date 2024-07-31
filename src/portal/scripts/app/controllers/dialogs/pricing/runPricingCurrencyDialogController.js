/**
 * Created by szhitenev on 14.05.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/procedures/pricingProcedureService').default;
    var pricingPolicyService = require('../../../services/pricingPolicyService').default;
    var scheduleService = require('../../../services/scheduleService').default;
    var toastNotificationService = require('../../../../../../core/services/toastNotificationService').default;
    module.exports = function runPricingCurrencyDialogController($scope, $mdDialog, globalDataService, data) {

        console.log('runPricingCurrencyDialogController.data', data);

        var vm = this;
        var configurationCode = globalDataService.getDefaultConfigurationCode();

        vm.currency = data.currency;
        vm.contextData = data.contextData;

        if (vm.contextData && vm.contextData.report_date) {
            vm.report_date = vm.contextData.report_date;
        }

        vm.item = {};

        vm.pricingPolicies = [];

        vm.pricingPolicyFilter = {};


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            vm.dataObject = {};
            vm.dataObject.date_from =  vm.item.price_date_from;
            vm.dataObject.date_to = vm.item.price_date_to;
            vm.dataObject.pricing_policies = []
            vm.dataObject.instruments = []

            vm.dataObject.currencies = [vm.currency.user_code];

            Object.keys(vm.pricingPolicyFilter).forEach(function (key) {

                if (vm.pricingPolicyFilter[key]) {
                    vm.dataObject.pricing_policies.push(key);
                }

            });

            pricingPolicyService.runPricing(vm.dataObject).then(function (data) {
                // TODO pricingv2 task card to show progress
                toastNotificationService.success('Success. Schedule  is being processed');

                $mdDialog.hide({status: 'disagree'});
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