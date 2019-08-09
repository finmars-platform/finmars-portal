/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var dataProvidersService = require('../../../services/import/dataProvidersService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralDataProvidersController', 'initialized');

        var vm = this;

        vm.dataProviders = [];
        vm.testCertificateConfig = {};

        vm.readyStatus = {dataProviders: false, configs: false};

        vm.getProviders = function () {

            dataProvidersService.getList().then(function (data) {
                vm.dataProviders = data;
                vm.readyStatus.dataProviders = true;

                vm.getConfigs();

                $scope.$apply();
            });

        };

        vm.getConfigs = function () {

            dataProvidersService.getConfigs().then(function (data) {
                vm.configs = data.results;
                vm.readyStatus.configs = true;


                vm.dataProviders.forEach(function (provider) {

                    provider.has_p12cert = false;

                    vm.configs.forEach(function (config) {

                        if (provider.id === config.provider) {
                            provider.has_p12cert = config.has_p12cert;
                        }

                        if (provider.id === config.provider) {
                            provider.is_valid = config.is_valid;
                        }


                    })

                });


                $scope.$apply();
            });


        };

        vm.requestTestCertificate = function(resolve) {

            dataProvidersService.bloombergTestCertificate(vm.testCertificateConfig).then(function (data) {

                vm.testCertificateConfig = data;

                console.log('data', data);

                if(data.task_object.status === 'D') {
                    resolve(data);
                } else {
                    setTimeout(function () {
                        vm.requestTestCertificate(resolve);
                    }, 1000)
                }

            })

        };

        vm.testBloombergCall = function() {

            console.log("Test bloomberg request")

            vm.testCertificateConfig = {};

            new Promise(function (resolve, reject) {

                vm.requestTestCertificate(resolve, {})

            }).then(function (data) {

                console.log('testBloombergCall data', data);

                vm.getConfigs();

            })


        };

        vm.init = function () {

            vm.getProviders();

        };

        vm.init();


        /*$mdDialog.show({
            controller: 'WarningDialogController as vm',
            templateUrl: 'views/warning-dialog-view.html',
            clickOutsideToClose: false,
            locals: {
                warning: {
                    title: 'Bloomberg certificate import',
                    description: 'Error'
                }
            }
        });

        $mdDialog.show({
            controller: 'SuccessDialogController as vm',
            templateUrl: 'views/dialogs/success-dialog-view.html',
            autoWrap: true,
            locals: {
                success: {
                    title: "Bloomberg certificate import",
                    description: "Success"
                }
            }

        });*/

    }

}());