/**
 * Created by szhitenev on 04.03.2020.
 */
(function () {

    'use strict';

    var currencyHistoryErrorService = require('../../services/pricing/currencyHistoryErrorService');

    module.exports = function ($scope, $mdDialog, $state, entityId) {

        var vm = this;

        vm.entityId = entityId;

        vm.readyStatus = {
            entity: false
        };

        vm.checkReadyStatus = function () {

            return vm.readyStatus.entity;
        };

        vm.getItem = function () {

            return new Promise(function (res, rej) {

                currencyHistoryErrorService.getByKey(vm.entityId).then(function (data) {

                    vm.entity = data;

                    vm.readyStatus.entity = true;

                    $scope.$apply();


                });

            });

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


        vm.save = function ($event) {

            currencyHistoryErrorService.update(vm.entityId, vm.entity).then(function (data) {

                $mdDialog.hide({res: 'agree', data: data});


            });

        };


        vm.init = function () {

            vm.getItem()
        };

        vm.init();


    }

}());