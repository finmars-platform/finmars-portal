/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var newMemberSetupConfigurationService = require('../../services/newMemberSetupConfigurationService');

    module.exports = function ($scope, $mdDialog, item) {

        var vm = this;

        vm.item = Object.assign({}, item);

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.toggleMode = function () {
            vm.isFromMarketplace = !vm.isFromMarketplace;
            vm.item.target_configuration_code = null;
            vm.item.target_configuration_version = null;
            vm.file = null;
        }

        vm.agree = function () {

            if (vm.file) {

                vm.item.file = vm.file

                newMemberSetupConfigurationService.update(vm.item.id, vm.item
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            } else {

                newMemberSetupConfigurationService.update(vm.item.id, vm.item
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            }

        }
    }

}());