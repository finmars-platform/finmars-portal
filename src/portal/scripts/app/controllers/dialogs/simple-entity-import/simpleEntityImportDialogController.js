/**
 * Created by szhitenev on 14.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var metaService = require('../../../services/metaService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');

    var importEntityService = require('../../../services/import/importEntityService');

    var baseUrlService = require('../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    module.exports = function ($scope, $mdDialog) {

        logService.controller('ImportEntityDialogControllers', 'initialized');

        var vm = this;

        vm.readyStatus = {
            mapping: false,
            processing: false,
            dailyModel: false,
            priceDownloadScheme: false,
            instrumentType: false,
            currency: false
        };
        vm.dataIsImported = false;
        vm.activeContentType = null;

        vm.config = {
            delimiter: ',',
            error_handler: 'break',
            mode: 'skip',
            missing_data_handler: 'throw_error',
            classifier_handler: 'skip'
        };

        vm.loadIsAvailable = function () {
            if (vm.config.scheme != null && vm.config.file !== null && vm.config.file !== undefined) {
                return true;
            }
            return false;
        };

        vm.contentTypes = metaContentTypesService.getListForSimpleEntityImport();

        vm.getSchemeList = function () {

            var options = {filters: {'content_type': vm.activeContentType}};

            csvImportSchemeService.getList(options).then(function (data) {
                vm.entitySchemes = data.results;
                vm.readyStatus.mapping = true;
                $scope.$apply();
            });

        };

        vm.checkExtension = function (file, extension, $event) {
            console.log('file', file);

            if (file) {

                var ext = file.name.split('.')[1]

                if (ext !== extension) {

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

                        vm.config.file = null;
                    });

                }

            }

        };

        vm.getSchemeList();

        vm.updateEntitySchemes = function () {
            vm.getSchemeList();
        };

        vm.validate = function ($event, mode) {

            return new Promise(function (resolve, reject) {

                vm.readyStatus.processing = true;

                var formData = new FormData();

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handler', vm.config.error_handler);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('mode', vm.config.mode);
                formData.append('missing_data_handler', vm.config.missing_data_handler);
                formData.append('classifier_handler', vm.config.classifier_handler);

                console.log('vm.config', vm.config);

                var schemeObject;

                vm.entitySchemes.forEach(function (scheme) {

                    if (scheme.id == vm.config.scheme) {
                        schemeObject = scheme;
                    }

                });

                importEntityService.validateImport(formData).then(function (data) {

                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    var hasErrors = false;

                    data.stats.forEach(function (item) {

                        if (item.level === 'error') {
                            hasErrors = true;
                        }

                    });

                    if (!hasErrors) {

                        resolve({status: 'agree'})

                    } else {

                        data.process_mode = mode;

                        console.log('data', data);

                        $mdDialog.show({
                            controller: 'SimpleEntityImportErrorsDialogController as vm',
                            templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-errors-dialog-view.html',
                            targetEvent: $event,
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true,
                            locals: {
                                data: {
                                    validationResult: data,
                                    scheme: schemeObject,
                                    config: vm.config
                                }
                            }
                        }).then(function (res) {

                            if (res && res.status === 'agree') {
                                resolve({status: 'agree'})
                            } else {
                                resolve({status: 'disagree'});
                            }

                        })


                    }


                }).catch(function (reason) {

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

                    resolve({status: 'disagree'});

                    $scope.$apply();

                })

            })
        };

        vm.validateImport = function ($event) {

            vm.validate($event, 'validate').then(function (res) {
                if (res.status === 'agree') {
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
                                description: "Validation successful"
                            }
                        }

                    });

                }
            });


        };

        vm.getFileUrl = function(id) {

            return baseUrl + 'file-reports/file-report/' + id + '/view/';

        };

        vm.load = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);
            formData.append('error_handler', vm.config.error_handler);
            formData.append('delimiter', vm.config.delimiter);
            formData.append('mode', vm.config.mode);
            formData.append('missing_data_handler', vm.config.missing_data_handler);
            formData.append('classifier_handler', vm.config.classifier_handler);

            console.log('vm.config', vm.config);

            var schemeObject;

            vm.entitySchemes.forEach(function (scheme) {

                if (scheme.id == vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            importEntityService.startImport(formData).then(function (data) {

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                var hasErrors = false;

                console.log('data', data);

                $mdDialog.hide();

                var description = '';

                var errorsCount = 0;

                data.stats.forEach(function (item) {

                    if (item.level === 'error') {
                        errorsCount = errorsCount + 1;
                    }

                });

                if (vm.config.error_handler === 'continue') {

                    description = '<div>' +
                        '<div>Rows total: ' + (data.total - 1) + '</div>' +
                        '<div>Rows success import: ' + (data.stats - errorsCount) + '</div>' +
                        '<div>Rows fail import: ' + errorsCount + '</div>' +
                        '</div><br/>';

                }

                if (vm.config.error_handler === 'break') {

                    description = '<div>' +
                        '<div>Rows total: ' + (data.total - 1) + '</div>' +
                        '<div>Rows success import: ' + (data.stats.length - errorsCount) + '</div>' +
                        '<div>Rows fail import: ' + errorsCount + '</div>' +
                        '</div><br/>';

                }

                console.log('description', description);

                description = description + '<div> You have successfully imported csv file </div>';


                description = description + '<div><a href="'+ vm.getFileUrl(data.stats_file_report) +'" download>Download Report File</a></div>';

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
        };

        vm.createScheme = function ($event) {

            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-create-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {}
                }
            }).then(function () {

                vm.getSchemeList();

            })

        };

        vm.editScheme = function ($event) {
            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-edit-dialog-view.html',
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

        vm.import = function ($event) {

            vm.validate($event, 'import').then(function (res) {

                if (res.status === 'agree') {
                    vm.load();
                }


            })

        }

    };

}());