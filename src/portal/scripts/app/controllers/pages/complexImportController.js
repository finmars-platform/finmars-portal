/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');

    var complexImportService = require('../../services/complex-import/complexImportService');
    var complexImportValidateService = require('../../services/complex-import/complexImportValidateService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('ComplexImport', 'initialized');

        var vm = this;

        vm.config = {
            delimiter: ','
        };

        vm.readyStatus = {
            scheme: false,
            processing: false
        };

        vm.state = null; // validate or import
        vm.counter = 0;
        vm.activeItemTotal = 0;

        vm.loadIsAvailable = function () {
            if (vm.config.scheme != null && vm.config.file !== null && vm.config.file !== undefined) {
                return true;
            }
            return false;
        };

        vm.getSchemeList = function () {
            complexImportSchemeService.getList().then(function (data) {

                vm.schemes = data.results;
                vm.readyStatus.scheme = true;
                $scope.$apply();

            });
        };

        vm.updateEntitySchemes = function () {
            vm.getSchemeList();
        };

        vm.createScheme = function ($event) {

            $mdDialog.show({
                controller: 'ComplexImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/complex-import/complex-import-scheme-create-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            }).then(function () {

                vm.getSchemeList();

            })

        };

        vm.editScheme = function ($event) {
            $mdDialog.show({
                controller: 'ComplexImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/complex-import/complex-import-scheme-edit-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            })
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.counterData = {};

        function updateCounter(index, config) {

            vm.counterData[index] = config;

            vm.counter = 0;

            var keys = Object.keys(vm.counterData);

            keys.forEach(function (key) {

                if (vm.counterData[key]) {
                    if (vm.counterData[key].hasOwnProperty('task_status')) {

                        if (vm.counterData[key].task_status === 'SUCCESS') {
                            vm.counter = vm.counter + 1;
                        }

                    } else {
                        vm.counter = vm.counter + 1;
                    }
                }

            });

            $scope.$apply()
        }

        vm.getTransactionImportProgress = function () {

            var result = {};

            var keys = Object.keys(vm.counterData);

            var currentAction;
            var currentActionIndex;

            var schemeObject;

            vm.schemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            keys.forEach(function (key) {

                if (vm.counterData[key].hasOwnProperty('error_handling') && vm.counterData[key].hasOwnProperty('task_status')) {

                    if (vm.counterData[key].task_status !== 'SUCCESS') {
                        currentAction = vm.counterData[key];
                        currentActionIndex = key;
                    }

                }

            });



            if (currentAction && currentActionIndex && schemeObject) {

                // console.log('currentActionIndex', currentActionIndex);

                result.text = 'Processing ' + schemeObject.actions[currentActionIndex].action_notes + ':';
                result.current = currentAction.processed_rows;
                result.total = currentAction.total_rows;
            }

            return result;
        };

        vm.validate = function ($event) {

            vm.counterData = {};

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);

            // console.log('vm.config', vm.config);

            var schemeObject;

            vm.schemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            vm.status = 'PROGRESS';
            vm.state = 'validate';
            vm.counter = 0;
            vm.activeItemTotal = schemeObject.actions.length;

            $mdDialog.show({
                controller: 'LoaderDialogController as vm',
                templateUrl: 'views/dialogs/loader-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        isCancelable: false,
                        current: vm.counter,
                        total: vm.activeItemTotal,
                        text: 'Validation Progress:',
                        status: vm.status,
                        callback: function () {
                            return {
                                current: vm.counter,
                                total: vm.activeItemTotal,
                                status: vm.status,
                                additional: [
                                    vm.getTransactionImportProgress()
                                ]
                            }
                        }
                    }
                }

            });

            complexImportValidateService.validateImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                // console.log('data', data);

                vm.status = 'SUCCESS';

                vm.readyStatus.processing = false;

                if (data.errors.length === 0) {

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            success: {
                                title: "Success validation",
                                description: '<p>File is valid.</p>'
                            }
                        }

                    });

                } else {

                    $mdDialog.show({
                        controller: 'ComplexImportValidationErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/complex-import/complex-import-validation-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                complexImportScheme: schemeObject,
                                validationResults: data
                            }
                        }
                    })

                }


            })

        };


        vm.import = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);

            // console.log('vm.config', vm.config);

            var schemeObject;

            vm.schemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            vm.counterData = {};
            vm.status = 'PROGRESS';
            vm.state = 'validate';
            vm.counter = 0;
            vm.activeItemTotal = schemeObject.actions.length;


            $mdDialog.show({
                controller: 'LoaderDialogController as vm',
                templateUrl: 'views/dialogs/loader-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        isCancelable: false,
                        current: vm.counter,
                        total: vm.activeItemTotal,
                        text: 'Validation Progress:',
                        status: vm.status,
                        callback: function () {
                            return {
                                current: vm.counter,
                                total: vm.activeItemTotal,
                                status: vm.status
                            }
                        }
                    }
                }

            });

            complexImportValidateService.validateImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                // console.log('validation data', data);

                vm.status = 'SUCCESS';

                var errorsCount = 0;

                data.errors.forEach(function (error) {
                    errorsCount = errorsCount + error.length;
                });

                if (errorsCount === 0) {

                    vm.state = 'import';
                    vm.counter = 0;
                    vm.activeItemTotal = schemeObject.actions.length;

                    setTimeout(function () {

                        vm.status = 'PROGRESS';

                        $mdDialog.show({
                            controller: 'LoaderDialogController as vm',
                            templateUrl: 'views/dialogs/loader-dialog-view.html',
                            targetEvent: $event,
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true,
                            locals: {
                                data: {
                                    isCancelable: false,
                                    current: vm.counter,
                                    total: vm.activeItemTotal,
                                    text: 'Import Progress:',
                                    status: vm.status,
                                    callback: function () {
                                        return {
                                            current: vm.counter,
                                            total: vm.activeItemTotal,
                                            status: vm.status
                                        }
                                    }
                                }
                            }

                        });

                        vm.counterData = {};

                        complexImportService.startImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                            // console.log('data', data);

                            vm.status = 'SUCCESS';
                            vm.readyStatus.processing = false;

                            errorsCount = 0;

                            data.errors.forEach(function (error) {
                                errorsCount = errorsCount + error.length;
                            });

                            if (errorsCount === 0) {

                                $mdDialog.hide();

                                var description = '';

                                description = '<div>' +
                                    '<div>Imports in total: ' + schemeObject.actions.length + '</div>' +
                                    '</div><br/>';

                                // console.log('description', description);

                                description = description + '<div> You have successfully imported file </div>';

                                $mdDialog.show({
                                    controller: 'SuccessDialogController as vm',
                                    templateUrl: 'views/dialogs/success-dialog-view.html',
                                    targetEvent: $event,
                                    preserveScope: true,
                                    multiple: true,
                                    autoWrap: true,
                                    skipHide: true,
                                    locals: {
                                        success: {
                                            title: "Success",
                                            description: description
                                        }
                                    }

                                });

                            } else {

                                $mdDialog.show({
                                    controller: 'ComplexImportValidationErrorsDialogController as vm',
                                    templateUrl: 'views/dialogs/complex-import/complex-import-validation-errors-dialog-view.html',
                                    targetEvent: $event,
                                    preserveScope: true,
                                    multiple: true,
                                    autoWrap: true,
                                    skipHide: true,
                                    locals: {
                                        data: {
                                            complexImportScheme: schemeObject,
                                            validationResults: data
                                        }
                                    }
                                })

                            }


                        }).catch(function (reason) {

                            // console.log('here? ', reason);

                            vm.readyStatus.processing = false;

                            vm.status = 'SUCCESS';

                            $mdDialog.show({
                                controller: 'ValidationDialogController as vm',
                                templateUrl: 'views/dialogs/validation-dialog-view.html',
                                targetEvent: $event,
                                preserveScope: true,
                                multiple: true,
                                autoWrap: true,
                                skipHide: true,
                                locals: {
                                    validationData: {
                                        message: "An error occurred. Please try again later"
                                    }
                                }
                            });

                            $scope.$apply();

                        })

                    }, 500)

                } else {

                    vm.readyStatus.processing = false;
                    vm.status = 'SUCCESS';

                    $mdDialog.show({
                        controller: 'ComplexImportValidationErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/complex-import/complex-import-validation-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                complexImportScheme: schemeObject,
                                validationResults: data
                            }
                        }
                    })

                }
            })

        };

        vm.init = function () {
            vm.getSchemeList();
        };

        vm.init();

    };

}());