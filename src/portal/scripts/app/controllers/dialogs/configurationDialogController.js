/**
 * Created by szhitenev on 17.04.2023.
 */
(function () {

    'use strict';


    module.exports = function configurationDialog($scope, $mdDialog, globalDataService, toastNotificationService, configurationService, data) {

        var vm = this;

        vm.processing = false;

        vm.readyStatus = {data: false};

        vm.item = {}

        vm.defaultConfigurationCode = globalDataService.getDefaultConfigurationCode();

        vm.checkReadyStatus = function () {
            return vm.readyStatus.data;
        };


        vm.getItem = function (id) {

            configurationService.getByKey(id).then(function (data) {


                vm.item = data
                vm.readyStatus.data = true;

                vm.initManifestEditor();

                $scope.$apply();

            });
        }

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.generateManifestIfNotExists = function () {

            vm.item.manifest = {
                "name": vm.item.name,
                "configuration_code": vm.item.configuration_code,
                "version": vm.item.version,
                "description": vm.item.description,
                "date": new Date().toJSON().slice(0, 10),
                "dependencies": {},
            }

        }

        vm.agree = function ($event) {

            vm.processing = true;


            if (vm.item.id) {

                vm.item.manifest = JSON.parse(vm.editor.getValue());

                configurationService.update(vm.item.id, vm.item).then(function (data) {

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully saved');

                    vm.processing = false;

                    $mdDialog.hide({status: 'agree'});

                })
            } else {

                vm.generateManifestIfNotExists()

                configurationService.create(vm.item).then(function (data) {

                    // vm.item = data;

                    toastNotificationService.success("Configuration " + vm.item.user_code + ' was successfully created');

                    /*vm.processing = false;

                    vm.getItem(vm.item.id)*/
                    $mdDialog.hide( { status: 'agree', data: {configurationId: data.id} } );

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

                    vm.getItem(vm.item.id);

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

            $mdDialog.show({
                controller: 'SimpleLoginDialogController as vm',
                templateUrl: 'views/dialogs/simple-login-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    data: {

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

                        configurationService.pushConfigurationToMarketplace(vm.item.id, {
                            username: res.data.username,
                            password: res.data.password,
                            changelog: vm.changelog
                        }).then(function (data) {

                            vm.changelog = '';

                            toastNotificationService.success("Configuration pushed successfully");

                            vm.processing = false;
                            $scope.$apply();

                        })

                    })

                }
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

                    setTimeout(function () {
                        $mdDialog.hide({status: 'agree'});
                    }, 100);

                }
            })

        }

        vm.initManifestEditor = function () {

            setTimeout(function () {

                vm.editor = ace.edit('aceEditorManifest');
                vm.editor.setTheme("ace/theme/monokai");
                vm.editor.getSession().setMode("ace/mode/json");
                vm.editor.getSession().setUseWorker(false);
                vm.editor.setHighlightActiveLine(false);
                vm.editor.setShowPrintMargin(false);

                ace.require("ace/ext/language_tools");
                vm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                });
                vm.editor.setFontSize(14)
                vm.editor.setBehavioursEnabled(true);
                vm.editor.setValue(JSON.stringify(vm.item.manifest, null, 4))

                vm.editor.focus();
                vm.editor.navigateFileStart();

            }, 100)


        }


        vm.init = function () {

            if (data.id) {
                vm.getItem(data.id);
            } else {
                vm.initManifestEditor();

                vm.readyStatus.data = true;

            }

            vm.member = globalDataService.getMember()


        };

        vm.init();

    };

}());