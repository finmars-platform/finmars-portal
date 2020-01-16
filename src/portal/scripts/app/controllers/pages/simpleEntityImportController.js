/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');

    var importEntityService = require('../../services/import/importEntityService');


    var baseUrlService = require('../../services/baseUrlService');
    var usersService = require('../../services/usersService');

    var baseUrl = baseUrlService.resolve();


    module.exports = function ($scope, $mdDialog) {

        logService.controller('SimpleEntityImportControllers', 'initialized');

        var vm = this;

        vm.readyStatus = {
            schemes: false,
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

        vm.processing = false;
        vm.loaderData = {};

        vm.validateConfig = {
            mode: 1
        };

        vm.hasSchemeEditPermission = false;

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
                vm.readyStatus.schemes = true;
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

        vm.updateEntitySchemes = function () {
            vm.getSchemeList();
        };

        vm.validate = function (resolve, $event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            if (vm.validateConfig.task_id) {

                formData.append('task_id', vm.validateConfig.task_id);

            } else {

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handler', vm.config.error_handler);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('mode', vm.config.mode);
                formData.append('missing_data_handler', vm.config.missing_data_handler);
                formData.append('classifier_handler', vm.config.classifier_handler);

            }

            console.log('vm.validateConfig', vm.validateConfig);

            importEntityService.validateImport(formData).then(function (data) {

                vm.validateConfig = data;

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status
                };

                $scope.$apply();

                if (vm.validateConfig.task_status === 'SUCCESS') {

                    console.log('resolve?');

                    resolve(data)

                } else {

                    setTimeout(function () {
                        vm.validate(resolve, $event);
                    }, 1000)

                }

            })

        };

        vm.validateImport = function ($event) {

            new Promise(function (resolve, reject) {

                vm.processing = true;

                vm.validateConfig = Object.assign({}, vm.config);

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status
                };

                vm.validate(resolve, $event)

            }).then(function (data) {

                vm.processing = false;

                console.log('validateImport.data', data);

                var hasErrors = false;

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                $scope.$apply();


                data.stats.forEach(function (item) {

                    if (item.level === 'error') {
                        hasErrors = true;
                    }

                });

                console.log('hasErrors', hasErrors);

                if (!hasErrors) {

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
                                description: "File is Valid"
                            }
                        }

                    });

                } else {

                    var schemeObject;

                    vm.entitySchemes.forEach(function (scheme) {

                        if (scheme.id == vm.config.scheme) {
                            schemeObject = scheme;
                        }

                    });

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
                    })

                }


            });


        };

        vm.import = function (resolve, $event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            if (vm.config.task_id) {

                formData.append('task_id', vm.config.task_id);

            } else {

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handler', vm.config.error_handler);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('mode', vm.config.mode);
                formData.append('missing_data_handler', vm.config.missing_data_handler);
                formData.append('classifier_handler', vm.config.classifier_handler);

            }

            console.log('vm.config', vm.config);

            importEntityService.startImport(formData).then(function (data) {

                vm.config = data;

                vm.loaderData = {
                    current: vm.config.processed_rows,
                    total: vm.config.total_rows,
                    text: 'Import Progress:',
                    status: vm.config.task_status
                };

                $scope.$apply();

                if (vm.config.task_status === 'SUCCESS') {

                    console.log('resolve?');

                    resolve(data)

                } else {

                    setTimeout(function () {
                        vm.import(resolve, $event);
                    }, 1000)

                }


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

        vm.getFileUrl = function(id) {

            return baseUrl + 'file-reports/file-report/' + id + '/view/';

        };

        vm.startImport = function ($event) {

            new Promise(function (resolve, reject) {

                delete vm.config.task_id;
                delete vm.config.task_status;

                vm.processing = true;

                vm.loaderData = {
                    current: vm.config.processed_rows,
                    total: vm.config.total_rows,
                    text: 'Import Progress:',
                    status: vm.config.task_status
                };

                vm.import(resolve, $event)

            }).then(function (data) {

                vm.processing = false;

                console.log('import.data', data);

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                $scope.$apply();


                var errors = data.stats.filter(function (item) {
                    return item.level === 'error'
                });

                console.log('errors', errors);


                var description;

                if (vm.config.error_handler === 'continue') {

                    description = '<div>' +
                        '<div>Rows total: ' + (data.total_rows - 1) + '</div>' +
                        '<div>Rows success import: ' + (data.stats.length - errors.length) + '</div>' +
                        '<div>Rows fail import: ' + errors.length + '</div>' +
                        '</div><br/>';

                }

                if (vm.config.error_handler === 'break') {

                    description = '<div>' +
                        '<div>Rows total: ' + (data.total_rows - 1) + '</div>' +
                        '<div>Rows success import: ' + (data.stats.length - errors.length) + '</div>' +
                        '<div>Rows fail import: ' + errors.length + '</div>' +
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


            });

        };

        vm.startImportWithValidation = function ($event) {

            return new Promise(function (resolve, reject) {

                vm.processing = true;

                vm.validateConfig = Object.assign({}, vm.config);

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status
                };

                vm.validate(resolve, $event)

            }).then(function (data) {

                vm.processing = false;

                console.log('validateImport.data', data);

                var hasErrors = false;

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                $scope.$apply();


                data.stats.forEach(function (item) {

                    if (item.level === 'error') {
                        hasErrors = true;
                    }

                });

                console.log('hasErrors', hasErrors);

                if (!hasErrors) {

                    vm.startImport($event);

                } else {

                    var schemeObject;

                    vm.entitySchemes.forEach(function (scheme) {

                        if (scheme.id == vm.config.scheme) {
                            schemeObject = scheme;
                        }

                    });

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
                            vm.startImport($event);
                        }

                    })

                }


            })

        }

        vm.getMember = function () {

            usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                if(vm.currentMember.is_admin) {
                    vm.hasSchemeEditPermission = true
                }

                vm.currentMember.groups_object.forEach(function (group) {

                    if(group.permission_table) {

                        group.permission_table.configuration.forEach(function (item) {

                            if(item.content_type === 'csv_import.csvimportscheme') {
                                if (item.data.creator_change) {
                                    vm.hasSchemeEditPermission = true
                                }
                            }

                        })

                    }

                });

                $scope.$apply();

            });

        };

        vm.init = function () {

            vm.getSchemeList();
            vm.getMember();

        };

        vm.init();

    };

}());