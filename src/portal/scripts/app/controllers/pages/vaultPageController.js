/**
 * Created by szhitenev on 24.06.2023.
 */
(function () {

    'use strict';

    var historyService = require('../../services/historyService');
    var configurationService = require('../../services/configurationService');
    var vaultService = require('../../services/vaultService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function vaultPageController($scope, $state, $stateParams, $mdDialog, configurationService) {

        var vm = this;

        vm.items = [];
        vm.readyStatus = {data: false};

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
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        name: 'Finmars'
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

        vm.createSecret = function ($event, engine) {

            $mdDialog.show({
                controller: 'VaultSecretDialogController as vm',
                templateUrl: 'views/dialogs/vault-secret-dialog-view.html',
                parent: angular.element(document.body),
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
                parent: angular.element(document.body),
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
                parent: angular.element(document.body),
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

        vm.init = function () {

            vm.getData();

        };

        vm.init();

    };

}());