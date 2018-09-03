/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var configurationService = require('../../../services/configurationService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.configurationFile = null;
        vm.mappingFile = null;

        vm.configurationFileIsAvailable = function () {
            return vm.configurationFile !== null && vm.configurationFile !== undefined
        };

        vm.mappingFileIsAvailable = function () {
            return vm.mappingFile !== null && vm.mappingFile !== undefined
        };

        vm.importConfiguration = function ($event) {

            var reader = new FileReader();

            reader.readAsText(vm.configurationFile);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);

                    $mdDialog.show({
                        controller: 'SettingGeneralConfigurationPreviewFileDialogController as vm',
                        templateUrl: 'views/dialogs/settings-general-configuration-preview-file-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            file: file
                        }
                    }).then(function (res) {

                        vm.configurationFile = null;

                    });

                } catch (error) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: true,
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

        vm.importMapping = function ($event) {

            var reader = new FileReader();

            reader.readAsText(vm.mappingFile);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);

                    $mdDialog.show({
                        controller: 'SettingGeneralMappingPreviewFileDialogController as vm',
                        templateUrl: 'views/dialogs/settings-general-mapping-preview-file-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            file: file
                        }
                    }).then(function (res) {

                        vm.mappingFile = null;

                    });

                } catch (error) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: true,
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

                    vm.mappingFile = null;

                }

            }

        }

    }

}());