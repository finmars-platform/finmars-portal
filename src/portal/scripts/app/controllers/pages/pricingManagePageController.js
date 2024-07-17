/**
 * Created by szhitenev on 29.01.2020.
 */
(function () {

    'use strict';

    var pricingPolicyService = require('../../services/pricingPolicyService').default;
    var currencyService = require('../../services/currencyService').default;
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

    module.exports = function ($scope, $mdDialog, instrumentService) {

        var vm = this;

        vm.readyStatus = {content: false};
        vm.items = [];
        vm.pricingPolicies = [];
        vm.pricingModel = [];


        vm.instruments = [];
        vm.instrumentModel = [];

        vm.currencies = [];
        vm.currencyModel = [];

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

        vm.getInstruments = function () {
            instrumentService.getListLight().then(function (data) {

                vm.instruments = data.results.map((item) => {
                    return {
                        id: item.user_code,
                        name: item.name
                    }
                });

                vm.readyStatus.content = true;

                $scope.$apply();
            })
        };

        vm.getCurrencies = function () {
            currencyService.getListLight().then(function (data) {

                vm.currencies = data.results.map((item) => {
                    return {
                        id: item.user_code,
                        name: item.name
                    }
                });

                vm.readyStatus.content = true;

                $scope.$apply();
            })
        };

        vm.runPricing = function () {
            vm.data = {}
            vm.data.date_from = vm.item.date_from;
            vm.data.date_to = vm.item.date_to;
            vm.data.pricing_policies = vm.pricingModel;
            vm.data.currencies = vm.currencyModel;
            vm.data.instruments = vm.instrumentModel;

            pricingPolicyService.runPricing(vm.data).then(function (data) {
                // TODO pricingv2 task card to show progress
                toastNotificationService.success('Success. Schedule  is being processed');

                $mdDialog.hide({status: 'disagree'});
            })
        }

        vm.init = function () {
            vm.getPricingPolicies();
            vm.getInstruments();
            vm.getCurrencies();
        };

        vm.init();

    };

}());