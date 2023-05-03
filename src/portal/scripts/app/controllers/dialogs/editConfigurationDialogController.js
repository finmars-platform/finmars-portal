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

            var formData = new FormData();

            formData.append('name', vm.item.name);
            formData.append('user_code', vm.item.user_code);
            formData.append('notes', vm.item.notes);
            formData.append('target_configuration_code', vm.item.target_configuration_code);
            formData.append('target_configuration_version', vm.item.target_configuration_version);
            formData.append('target_configuration_is_package', vm.item.target_configuration_is_package);

            if (vm.file) {


                formData.append('file', vm.file);

                newMemberSetupConfigurationService.update(vm.item.id, formData
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            } else {

                newMemberSetupConfigurationService.update(vm.item.id, formData
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            }

        }
    }

}());