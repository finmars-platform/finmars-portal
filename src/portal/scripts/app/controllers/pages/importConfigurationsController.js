/**
 * Created by szhitenev on 27.06.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.configurationFile = null;

        vm.configurationFileIsAvailable = function () {
            return vm.configurationFile !== null && vm.configurationFile !== undefined
        };

        vm.checkExtension = function (file, $event) {
            console.log('file', file);

            if (file) {

                var ext = file.name.split('.')[1]

                if (ext !== 'fcfg') {

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "Warning!",
                                description: 'You are trying to load incorrect file'
                            }
                        },
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true

                    }).then(function () {

                        if (file === vm.configurationFile) {
                            vm.configurationFile = null;
                        } else {
                            vm.mappingFile = null;
                        }

                    });

                }

            }

        };

        vm.openImportConfigurationManager = function ($event) {

            var reader = new FileReader();

            reader.readAsText(vm.configurationFile);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);
                    console.log("import config file", file);
                    $mdDialog.show({
                        controller: 'SettingGeneralConfigurationPreviewFileDialogController as vm',
                        templateUrl: 'views/dialogs/settings-general-configuration-preview-file-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                file: file,
                                rawFile: vm.configurationFile
                            }
                        }
                    }).then(function (res) {

                        vm.configurationFile = null;

                    }).catch(function (reason) {

                        vm.configurationFile = null;

                    })

                } catch (error) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            warning: {
                                title: 'Error',
                                description: 'Unable to read it. This file is corrupted.'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    });

                    vm.configurationFile = null;


                }

            }

        };

    }

}());