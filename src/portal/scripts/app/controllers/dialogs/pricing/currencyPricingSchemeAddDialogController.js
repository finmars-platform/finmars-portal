/**
 * Created by szhitenev on 30.01.2020.
 */
(function(){

    'use strict';

    var currencyPricingSchemeService = require('../../../services/pricing/currencyPricingSchemeService');

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.item = {};
        vm.types = [];

        vm.readyStatus = {types: false};

        vm.getTypes = function(){

            currencyPricingSchemeService.getTypes().then(function (data) {

                vm.types = data.results;

                console.log('vm.types', vm.types);

                vm.readyStatus.types = true;

                $scope.$apply();

            })

        };


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            console.log('vm.item', vm.item);

            currencyPricingSchemeService.create(vm.item).then(function (data) {

                console.log('data', data);

                $mdDialog.hide({status: 'agree'});

            })

        };

        vm.init = function () {
            vm.getTypes();
        };

        vm.init();

    }

}());