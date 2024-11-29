/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var newMemberSetupConfigurationService = require('../../services/newMemberSetupConfigurationService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.configurationFileIsAvailable = function () {
            return vm.file !== null && vm.file !== undefined
        };

        vm.item = {
            notes: '',
        };

        vm.configurationCannelArray = [
            { title: 'Stable', value: 'stable' },
            { title: 'Release Candidate', value: 'rc' }
        ];

        vm.isFromMarketplace = true;

        vm.toggleMode = function () {
            vm.isFromMarketplace = !vm.isFromMarketplace;
            vm.item.target_configuration_code = null;
            vm.item.target_configuration_version = null;
            vm.item.target_configuration_channel = vm.configurationCannelArray[0].value;
            vm.item.target_configuration_is_package = false;
            vm.file = null;
        }

        vm.agree = function () {

            var formData = new FormData();

            formData.append('name', vm.item.name);
            formData.append('user_code', vm.item.user_code);
            formData.append('configuration_code', vm.item.configuration_code);
            formData.append('notes', vm.item.notes);
            formData.append('target_configuration_code', vm.item.target_configuration_code);
            formData.append('target_configuration_version', vm.item.target_configuration_version);
            formData.append('target_configuration_channel', vm.item.target_configuration_channel);
            formData.append('target_configuration_is_package', !!vm.item.target_configuration_is_package);

            if (vm.file) {

                formData.append('file', vm.file);

                newMemberSetupConfigurationService.create(formData
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            } else {

                newMemberSetupConfigurationService.create(formData
                ).then(function (value) {

                    $mdDialog.hide({status: 'agree'});

                });

            }


        };
    }

}());