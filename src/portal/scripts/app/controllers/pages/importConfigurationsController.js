/**
 * Created by szhitenev on 27.06.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.configurationFile = null;

        vm.configurationFileIsAvailable = function () {
            return vm.configurationFile !== null && vm.configurationFile !== undefined;
        };

        var checkExtension = function (file, $event) {

            return new Promise(function (resolve, reject) {

                if (file.name && file.name.indexOf('.fcfg') === file.name.length - '.fcfg'.length) {

                    resolve(true);

                } else {


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

                        vm.configurationFile = null;
                        reject('wrong file extension');

                    });
                }

            })


        };

        vm.onFileLoad = function (file, $event) {

            vm.configFileNotes = null;

            if (file) {

                checkExtension(file, $event).then(function () {

                    var reader = new FileReader();
                    reader.readAsText(vm.configurationFile);
                    reader.onload = function (evt) {

                        if (evt.target.result) {
                            var parsedFile = JSON.parse(evt.target.result);

                            if (parsedFile.notes) {
                                vm.configFileNotes = parsedFile.notes;
                            }

                        }

                        $scope.$apply();

                    };

                });

            } else {
                $scope.$apply();
            }

        };

        vm.openImportConfigurationManager = function ($event) {

            var reader = new FileReader();

            reader.readAsText(vm.configurationFile);

            reader.onload = function (evt) {

                try {

                    var file = JSON.parse(evt.target.result);

                    $mdDialog.show({
                        controller: 'ConfigurationImportDialogController as vm',
                        templateUrl: 'views/dialogs/configuration-import/configuration-import-dialog-view.html',
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