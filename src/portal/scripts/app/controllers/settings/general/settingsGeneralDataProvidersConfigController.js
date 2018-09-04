/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var dataProvidersService = require('../../../services/import/dataProvidersService');

    module.exports = function ($scope, $stateParams, $mdDialog, $state) {

        logService.controller('SettingsGeneralDataProvidersConfigController', 'initialized');

        var vm = this;

        vm.providerId = $stateParams.dataProviderId;

        vm.provider = {};

        vm.readyStatus = {provider: false};

        dataProvidersService.getConfig(vm.providerId).then(function (data) {
            vm.provider = data.results[0];

            vm.readyStatus.provider = true;
            $scope.$apply();
        });

        vm.saveConfig = function ($event) {

            $event.preventDefault();
            $event.stopPropagation();

            var formData = new FormData();

            if (!vm.provider.provider) {

                vm.provider.provider = 1;
            }

            formData.append('p12cert', vm.provider.p12cert);
            formData.append('password', vm.provider.password);
            formData.append('provider', vm.provider.provider);

            if (vm.provider.id) {

                dataProvidersService.setConfig(vm.provider.id, formData).then(function (data) {

                    console.log('test!', data);

                    if (data.status == 200 || data.status == 201) {
                        $mdDialog.show({
                            controller: 'SuccessDialogController as vm',
                            templateUrl: 'views/dialogs/success-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                success: {
                                    title: "",
                                    description: "You have you have successfully add sertificate"
                                }
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        }).then(function () {
                            $state.go('app.settings.general.data-providers');
                        });

                    }

                });

            } else {

                dataProvidersService.createConfig(formData).then(function (value) {

                    if (data.status == 200 || data.status == 201) {
                        $mdDialog.show({
                            controller: 'SuccessDialogController as vm',
                            templateUrl: 'views/dialogs/success-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                success: {
                                    title: "",
                                    description: "You have you have successfully add sertificate"
                                }
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        }).then(function () {
                            $state.go('app.settings.general.data-providers');
                        });

                    }

                });

            }


        }


    }

}());