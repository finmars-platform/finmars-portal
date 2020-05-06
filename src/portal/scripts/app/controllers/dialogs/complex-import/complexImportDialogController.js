/**
 * Created by szhitenev on 14.03.2018.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var complexImportSchemeService = require('../../../services/import/complexImportSchemeService');

    var complexImportService = require('../../../services/complex-import/complexImportService');
    var complexImportValidateService = require('../../../services/complex-import/complexImportValidateService');

    module.exports = function complexImportDialogController($scope, $mdDialog) {

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
                    data: {

                    }
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
            $mdDialog.hide({status: 'disagree'});
        };

        function updateCounter() {

            vm.counter = vm.counter + 1;

            $scope.$apply()
        }


        vm.validate = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);

            console.log('vm.config', vm.config);

            var schemeObject;

            vm.schemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            vm.state = 'validate';
            vm.counter = 0;
            vm.activeItemTotal = schemeObject.actions.filter(function (item) {
                return !item.skip
            }).length;

            vm.skippedItem = schemeObject.actions.filter(function (item) {
                return item.skip
            }).length;

            complexImportValidateService.validateImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                console.log('data', data);

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

            console.log('vm.config', vm.config);

            var schemeObject;

            vm.schemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            vm.state = 'validate';
            vm.counter = 0;
            vm.activeItemTotal = schemeObject.actions.filter(function (item) {
                return !item.skip
            }).length;

            vm.skippedItem = schemeObject.actions.filter(function (item) {
                return item.skip
            }).length;

            complexImportValidateService.validateImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                console.log('validation data', data);

                var errorsCount = 0;

                data.errors.forEach(function (error) {
                    errorsCount = errorsCount + error.length;
                });

                if (errorsCount === 0) {

                    vm.state = 'import';
                    vm.counter = 0;
                    vm.activeItemTotal = schemeObject.actions.filter(function (item) {
                        return !item.skip
                    }).length;

                    vm.skippedItem = schemeObject.actions.filter(function (item) {
                        return item.skip
                    }).length;

                    complexImportService.startImport(vm.config.file, vm.config.delimiter, schemeObject, updateCounter).then(function (data) {

                        console.log('data', data);

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

                            console.log('description', description);

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

                        console.log('here? ', reason);

                        vm.readyStatus.processing = false;

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

                } else {

                    vm.readyStatus.processing = false;

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