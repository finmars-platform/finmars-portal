/**
 * Created by szhitenev on 17.04.2023.
 */
(function () {

    'use strict';

    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var metaService = require('../../services/metaService');

    var modelService = require('../../services/modelService');


    var configurationService = require('../../services/configurationService');
    var marketplaceService = require('../../services/marketplaceService');

    module.exports = function configurationDialog($scope, $mdDialog, globalDataService, toastNotificationService, data) {

        var vm = this;

        vm.processing = false;

        vm.readyStatus = {data: false};

        vm.item = {}

        vm.checkReadyStatus = function () {
            return vm.readyStatus.data;
        };


        vm.getItem = function (id) {

            configurationService.getByKey(id).then(function (data) {

                vm.item = data
                vm.readyStatus.data = true;

                $scope.$apply();

            });
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            vm.processing = true;

            if (vm.item.id) {

                configurationService.update(vm.item.id, vm.item).then(function (data) {

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully saved');

                    vm.processing = false;

                    $mdDialog.hide({status: 'agree'});

                })
            } else {

                configurationService.create(vm.item).then(function (data) {

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully created');

                    vm.processing = false;

                    $mdDialog.hide({status: 'agree'});

                })

            }

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm.item,
                        entityType: 'configuration',
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem();

                }
            })

        }

        vm.exportToStorage = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "It will overwrite your existing exported configuration."
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    configurationService.update(vm.item.id, vm.item).then(function (data) {

                        vm.item = data;

                        configurationService.exportConfiguration(vm.item.id).then(function (data) {

                            toastNotificationService.success("Configuration exported successfully");

                            // downloadFileHelper.downloadFile(data, "application/zip", vm.activeConfiguration.name + '.zip');

                        })

                    })

                }
            })

        }

        vm.pushConfiguration = function ($event) {

            vm.processing = true;

            configurationService.update(vm.item.id, vm.item).then(function (data) {

                vm.item = data;

                configurationService.pushConfigurationToMarketplace(vm.item.id, {

                    changelog: vm.changelog

                }).then(function (data) {

                    vm.changelog = '';

                    toastNotificationService.success("Configuration pushed successfully");

                    vm.processing = false;
                    $scope.$apply();

                })

            })

        }

        vm.deleteConfiguration = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure that you want to delete configuration " + vm.item.user_code + "? It will affect whole system. Be careful!"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                console.log('res', res);
                if (res.status === 'agree') {

                    configurationService.deleteByKey(vm.item.id);

                    $mdDialog.hide({status: 'agree'});

                }
            })

        }


        vm.init = function () {

            if (data.id) {
                vm.getItem(data.id);
            } else {

                vm.readyStatus.data = true;

            }

            vm.member = globalDataService.getMember()


        };

        vm.init();

    };

}());