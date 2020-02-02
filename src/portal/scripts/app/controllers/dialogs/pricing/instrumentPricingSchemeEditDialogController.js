/**
 * Created by szhitenev on 30.01.2020.
 */
(function(){

    'use strict';

    var instrumentPricingSchemeService = require('../../../services/pricing/instrumentPricingSchemeService');

    module.exports = function($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.itemId = data.item.id;

        vm.item = {};
        vm.types = [];

        vm.readyStatus = {types: false, scheme: false};

        vm.getTypes = function () {

            instrumentPricingSchemeService.getTypes().then(function (data) {

                vm.types = data.results;

                console.log('vm.types', vm.types);

                vm.readyStatus.types = true;

                $scope.$apply();

            })

        };

        vm.getItem = function () {

            instrumentPricingSchemeService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                vm.readyStatus.scheme = true;

                console.log('data', data);

                $scope.$apply();

            })

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            instrumentPricingSchemeService.update(vm.item.id, vm.item).then(function (data) {

                console.log('data', data);

                $mdDialog.hide({status: 'agree', data: {item: vm.item}});

            })

        };

        vm.init = function () {

            vm.getItem();
            vm.getTypes();

        };

        vm.init();

    }

}());