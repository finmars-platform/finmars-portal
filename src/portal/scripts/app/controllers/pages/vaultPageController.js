/**
 * Created by szhitenev on 24.06.2023.
 */
(function () {

    'use strict';

    var historyService = require('../../services/historyService');
    var configurationService = require('../../services/configurationService');
    var vaultService = require('../../services/vaultService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;


    module.exports = function vaultPageController($scope, $state, $stateParams, $mdDialog, globalDataService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};
        vm.vaultTokenIsSet = false;

        vm.filters = {}

        vm.toggleShowSecrets = function (item) {

            item.showSecrets = !item.showSecrets;

        }

        vm.getSecrets = function (engine) {

            vaultService.getListSecrets(engine['engine_name']).then(function (data) {

                console.log('vm.getSecrets.data', data);

                var secret_items = []

                if (data.hasOwnProperty('data')) {

                    var secrets_keys = data['data']['keys']

                    secrets_keys.forEach(function (key) {

                        secret_items.push({
                            path: key
                        })
                    })
                }

                engine.secrets = secret_items;
                $scope.$apply();

            })

        }


        vm.getData = function () {

            vm.readyStatus.data = false;

            vaultService.getListEngines().then(function (data) {

                console.log('vm.getListEngines.data', data);

                vm.engines = data;

                vm.engines.forEach(function (engine) {

                    vm.getSecrets(engine);

                })

                vm.readyStatus.data = true;

                $scope.$apply();

            })

        };

        vm.createEngine = function ($event) {

            $mdDialog.show({
                controller: 'SaveAsDialogController as vm',
                templateUrl: 'views/dialogs/save-as-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        name: 'finmars'
                    }
                }
            }).then(function (res) {

                console.log('res', res);

                if (res.status === 'agree') {

                    vaultService.createEngine({
                        'engine_name': res.data.name
                    }).then(function (data) {

                        vm.getData();

                        toastNotificationService.success("Engine created successfully");

                    })

                }


            })

        }

        vm.editSecret = function ($event, engine, secret) {

            vaultService.getSecretMetadata(engine.engine_name, secret.path).then(function (secret_metadata) {

                var version = Object.keys(secret_metadata['data']['versions']).length;

                vaultService.getSecret(engine.engine_name, secret.path, version).then(function (secret_data) {

                    console.log('editSecret.data', secret_data);

                    $mdDialog.show({
                        controller: 'VaultSecretDialogController as vm',
                        templateUrl: 'views/dialogs/vault-secret-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            data: {
                                engine_name: engine.engine_name,
                                path: secret.path,
                                data: secret_data['data']['data']
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            vaultService.updateSecret({
                                "engine_name": engine['engine_name'],
                                "path": res.data.path,
                                "data": res.data.data,
                                "version": version
                            }).then(function (data) {

                                vm.getSecrets(engine);

                                toastNotificationService.success("Secret updated successfully");

                                $scope.$apply();


                            })

                        }

                    })

                })

            })
        }

        vm.createSecret = function ($event, engine) {

            $mdDialog.show({
                controller: 'VaultSecretDialogController as vm',
                templateUrl: 'views/dialogs/vault-secret-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    data: {
                        engine_name: engine.engine_name
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    vaultService.createSecret({
                        "engine_name": engine['engine_name'],
                        "path": res.data.path,
                        "data": res.data.data
                    }).then(function (data) {

                        vm.getSecrets(engine);

                        toastNotificationService.success("Secret created successfully");

                        $scope.$apply();


                    })

                }

            })

        }

        vm.deleteSecret = function ($event, engine, secret) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want delete secret " + secret.path + "?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);

                if (res.status === 'agree') {

                    vaultService.deleteSecret({
                        "engine_name": engine['engine_name'],
                        "path": secret.path
                    }).then(function (data) {

                        console.log('vm.deleteSecret.data', data);

                        vm.getSecrets(engine);

                        toastNotificationService.success("Secret deleted successfully");

                        $scope.$apply();

                    })

                }
            })


        }

        vm.deleteEngine = function ($event, engine) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want delete engine " + engine.engine_name + "?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    vaultService.deleteEngine({
                        "engine_name": engine['engine_name']
                    }).then(function (data) {

                        console.log('vm.deleteSecret.data', data);

                        vm.getData();

                        toastNotificationService.success("Engine deleted successfully");

                        $scope.$apply();

                    })

                }
            })


        }

        vm.seal = function ($event) {

            vaultService.seal().then(function (data) {

                toastNotificationService.success("Vault is sealed.");

                vm.getStatus();

                vm.getData();

            })

        }

        vm.unseal = function ($event) {

            $mdDialog.show({
                controller: 'UnsealVaultDialogController as vm',
                templateUrl: 'views/dialogs/unseal-vault-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    data: {}
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    vaultService.unseal(res.data.key).then(function (data) {

                        toastNotificationService.success("Unseal Key provided successfully");

                        vm.getStatus();

                        vm.getData();

                    })

                }
            })

        }

        vm.initVault = function ($event) {

            vm.initProcessing = true;

            vaultService.initVault().then(function (initData) {

                vm.initVaultData = initData.data

                vm.initProcessing = false;
                $scope.$apply();

            })

        }

        vm.goToVault = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "I saved keys of my vault and ready proceed."
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    vm.initVaultData = null;

                    vm.getStatus();

                    vm.getData();

                }

            })

        }

        vm.getStatus = function () {

            vm.readyStatus.health = false;

            vaultService.getHealth().then(function (healthData) {

                vm.isInited = healthData.data.initialized

                vm.readyStatus.health = true;

                $scope.$apply();

                if (vm.isInited) {

                    vaultService.getStatus().then(function (data) {

                        console.log('vm.getStatus.data', data);

                        vm.status = data;

                        if (vm.status.data) {

                            vm.statusData = JSON.stringify(vm.status.data, null, 4)

                            vm.isSealed = vm.status.data.sealed

                        }

                        $scope.$apply();

                    });

                } else {

                    $scope.$apply();
                }

            })
        }

        vm.setVaultToken = function ($event) {

            vaultService.setVaultToken(vm.currentMasterUser.base_api_url, vm.vaultToken).then(function (data) {

                toastNotificationService.info("Vault token is set. System is going to restart.");

                vm.vaultTokenIsSet = true;

                $scope.$apply();

            })

        }

        vm.init = function () {

            vm.currentMasterUser = globalDataService.getMasterUser();

            vm.getStatus();

            vm.getData();

        };

        vm.init();

    };

}());