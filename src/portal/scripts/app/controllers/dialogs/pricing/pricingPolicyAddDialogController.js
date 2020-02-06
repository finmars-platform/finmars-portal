/**
 * Created by szhitenev on 30.01.2020.
 */
(function(){

    'use strict';

    var pricingPolicyService = require('../../../services/pricingPolicyService');

    var currencyPricingSchemeService = require('../../../services/pricing/currencyPricingSchemeService');
    var instrumentPricingSchemeService= require('../../../services/pricing/instrumentPricingSchemeService');

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.item = {};
        vm.types = [];

        vm.currencyPricingSchemes = [];
        vm.instrumentPricingSchemes = [];

        vm.readyStatus = {content: false, currencyPricingSchemes: false, instrumentPricingSchemes: false};

        vm.getCurrencyPricingSchemesList = function () {

            currencyPricingSchemeService.getList().then(function (data) {

                vm.currencyPricingSchemes = data.results;

                vm.readyStatus.currencyPricingSchemes = true;

                $scope.$apply();

            })

        };

        vm.getInstrumentPricingSchemesList = function () {

            instrumentPricingSchemeService.getList().then(function (data) {

                vm.instrumentPricingSchemes = data.results;

                vm.readyStatus.instrumentPricingSchemes = true;

                $scope.$apply();

            })

        };


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            pricingPolicyService.create(vm.item).then(function (data) {

                vm.item = data;

                $mdDialog.hide({status: 'agree', data: {item: vm.item}});

            });

        };

        vm.init = function () {

            vm.getCurrencyPricingSchemesList();
            vm.getInstrumentPricingSchemesList();

        };

        vm.init();

    }

}());