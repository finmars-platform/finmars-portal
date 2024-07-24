/**
 * Created by szhitenev on 29.04.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/procedures/pricingProcedureService').default;
    var pricingPolicyService = require('../../../services/pricingPolicyService').default;
    ;


    module.exports = function runPricingInstrumentDialogController($scope, $mdDialog, globalDataService, data) {

        console.log('runPricingInstrumentDialogController.data', data);

        var vm = this;
        var configurationCode = globalDataService.getDefaultConfigurationCode();

        vm.instrument = data.instrument;
        vm.contextData = data.contextData;

        if (vm.contextData && vm.contextData.report_date) {
            vm.report_date = vm.contextData.report_date;
        }

        vm.item = {
            currencies: [],
            instruments: [vm.instrument.id],
            pricing_policies: []
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            pricingPolicyService.runPricing(vm.item).then(function (data) {
                // TODO pricingv2 task card to show progress
                $mdDialog.hide({status: 'disagree'});
            })

        };


        vm.init = function () {

        };

        vm.init();

    }

}());