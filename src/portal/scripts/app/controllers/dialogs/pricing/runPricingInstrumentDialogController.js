/**
 * Created by szhitenev on 29.04.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/procedures/pricingProcedureService').default;
    var pricingPolicyService = require('../../../services/pricingPolicyService').default;
    var toastNotificationService = require('../../../../../../core/services/toastNotificationService').default;


    module.exports = function runPricingInstrumentDialogController($scope, $mdDialog, globalDataService, data) {

        console.log('runPricingInstrumentDialogController.data', data);

        var vm = this;
        var configurationCode = globalDataService.getDefaultConfigurationCode();

        vm.instrument = data.instrument;
        vm.contextData = data.contextData;
        vm.pricingPolicyFilter = {};
        if (vm.contextData && vm.contextData.report_date) {
            vm.report_date = vm.contextData.report_date;
        }

        vm.item = {
            currencies: vm.instrument?.pricing_currency_object?.user_code ? [vm.instrument.pricing_currency_object.user_code] : [],
            pricing_policies: []
        };

        if (vm.instrument.isInstrument) {
            vm.item.currencies = [];
        }

        if (vm.instrument.configuration_code) {
            vm.item.instrument_types = [vm.instrument.user_code];
        } else {
            vm.item.instruments = [vm.instrument.user_code];
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.getPricingPolicies = function () {
            pricingPolicyService.getList().then(function (data) {

                vm.pricingPolicies = data.results.map((item) => {
                    return {
                        id: item.user_code,
                        name: item.name
                    }
                });

                vm.readyStatus.content = true;

                $scope.$apply();
            })
        };

        vm.agree = function () {
            Object.keys(vm.pricingPolicyFilter).forEach(function (key) {

                if (vm.pricingPolicyFilter[key]) {
                    vm.item.pricing_policies.push(key);
                }

            });
            pricingPolicyService.runPricing(vm.item).then(function (data) {
                toastNotificationService.success('Success. Schedule  is being processed');
                // TODO pricingv2 task card to show progress
                $mdDialog.hide({status: 'disagree'});
            })

        };


        vm.init = function () {
            vm.getPricingPolicies()
        };

        vm.init();

    }

}());