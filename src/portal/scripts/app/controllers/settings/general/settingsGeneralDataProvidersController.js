/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var dataProvidersService = require('../../../services/import/dataProvidersService');

    var bloombergDataProviderService = require('../../../services/data-providers/bloombergDataProviderService');

    module.exports = function settingsGeneralDataProvidersController($scope, $mdDialog) {

        var vm = this;

        vm.dataProviders = [];
        vm.testCertificateConfig = {};
        vm.testCertificateProcessing = false;

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

        vm.requestTestCertificate = function (resolve) {

            dataProvidersService.bloombergTestCertificate(vm.testCertificateConfig).then(function (data) {

                vm.testCertificateConfig = data;

                console.log('data', data);

                if (data.task_object.status === 'D') {
                    resolve({status: 'success'});
                } else if(data.task_object.status === 'E') {
                    resolve({status: 'error'});
                }else {
                    setTimeout(function () {
                        vm.requestTestCertificate(resolve);
                    }, 1000)
                }

            })

        };

        vm.testBloombergCall = function ($event) {

            console.log("Test bloomberg request")

            vm.testCertificateConfig = {};
            vm.testCertificateProcessing = true;

            new Promise(function (resolve, reject) {

                vm.requestTestCertificate(resolve, {})

            }).then(function (data) {

                console.log('testBloombergCall data', data);

                vm.testCertificateProcessing = false;
                $scope.$apply();


                if(data.status === 'success') {

                    vm.getBloombergCredentialList();

                }

                if(data.status === 'error') {

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        autoWrap: true,
                        multiple: true,
                        skipHide: true,
                        locals: {
                            info: {
                                title: 'Warning',
                                description: 'Something wrong with Certificate/Password.'
                            }
                        }
                    })

                }



            })


        };

        vm.getBloombergCredentialList = function(){

            vm.readyStatus.bloombergCredentials = false;

            bloombergDataProviderService.getCredentialList().then(function (data) {

                vm.bloombergCredentials = data.results;

                vm.readyStatus.bloombergCredentials = true;


                if(!vm.bloombergCredentials.length) {
                    vm.bloombergCredentials = [{
                        id: 'new'
                    }]
                }

                console.log('vm.bloombergCredentials', vm.bloombergCredentials);

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getProviders();
            vm.getBloombergCredentialList();

        };

        vm.init();


    }

}());