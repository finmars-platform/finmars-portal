/**
 * Created by szhitenev on 02.06.2023.
 */
(function () {

    'use strict';

    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.readyStatus = {data: false};


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.id) {

                transactionTypeGroupService.update(vm.id, vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            } else {

                transactionTypeGroupService.create(vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            }


        };

        vm.getItem = function () {

            transactionTypeGroupService.getByKey(vm.id).then(function (data) {

                vm.item = data;

                vm.readyStatus.data = true;

                $scope.$apply();

            })

        };


        vm.init = function () {

            if (data.item) {

                vm.id = data.item.id;

                vm.getItem();

            } else {
                vm.readyStatus.data = true;
            }


        };

        vm.init();

    }

}());