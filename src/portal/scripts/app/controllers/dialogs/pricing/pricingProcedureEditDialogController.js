/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.item = {};
        vm.readyStatus = {content: false};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            pricingProcedureService.update(vm.item.id, vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});
            })

        };

        vm.getItem = function () {

            pricingProcedureService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                if (vm.item.price_date_to) {
                    vm.item.isRange = true
                }

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getItem();

        };

        vm.init();

    }

}());