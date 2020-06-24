/**
 * Created by mevstratov on 24.06.2019.
 */
(function () {

    'use strict';

    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');
    var importTransactionService = require('../../services/import/importTransactionService');

    var baseUrlService = require('../../services/baseUrlService');
    var usersService = require('../../services/usersService');

    var baseUrl = baseUrlService.resolve();

    module.exports = function transactionImportController($scope, $mdDialog) {

        var vm = this;

        vm.fileLocal = null;

        vm.readyStatus = {
            schemes: false,
            processing: false
        };
        vm.dataIsImported = false;

        vm.config = {
            delimiter: ',',
            mode: 1,
            missing_data_handler: 'throw_error',
            error_handling: 'break'
        };

        vm.processing = false;
        vm.loaderData = {};

        vm.validateConfig = {
            mode: 1
        };

        vm.hasSchemeEditPermission = false;

        vm.loadIsAvailable = function () {
            return !vm.readyStatus.processing && vm.config.scheme && vm.config.error_handling;
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

        vm.validateImport = function ($event) {

            new Promise(function (resolve, reject) {

                vm.validateConfig = Object.assign({}, vm.config);

                vm.processing = true;

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status,
                };

                vm.validate(resolve, $event)

            }).then(function (data) {

                vm.processing = false;

                var errorsCount = 0;

                vm.validateConfig.error_rows.forEach(function (item) {

                    if (item.level === 'error') {
                        errorsCount = errorsCount + 1;
                    }

                });

                if (errorsCount) {

                    data.process_mode = 'validate';

                    var transactionScheme;

                    vm.transactionSchemes.forEach(function (scheme) {

                        if (scheme.id === vm.config.scheme) {
                            transactionScheme = scheme;
                        }

                    });

                    vm.validateConfig.file = {};
                    vm.validateConfig.file.name = vm.fileLocal.name;

                    $mdDialog.show({
                        controller: 'TransactionImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/transaction-import/transaction-import-errors-dialog-view.html',
                        locals: {
                            data: {
                                validationResult: data,
                                scheme: transactionScheme,
                                config: vm.validateConfig
                            }
                        },
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function (res) {

                        // vm.validateConfig = {};
                        vm.readyStatus.processing = false;

                    });


                } else {

                    // vm.validateConfig = {};
                    vm.readyStatus.processing = false;

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
                                description: 'Validation successful'
                            }
                        }

                    });

                }

            })

        };

        vm.startImport = function ($event) {

            new Promise(function (resolve, reject) {

                vm.processing = true

                vm.validateConfig = Object.assign({}, vm.config);

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status
                };


                vm.validate(resolve, $event)

            }).then(function (data) {

                var errorsCount = 0;

                vm.validateConfig.error_rows.forEach(function (item) {

                    if (item.level === 'error') {
                        errorsCount = errorsCount + 1;
                    }

                });

                if (errorsCount) {

                    var transactionScheme;

                    vm.transactionSchemes.forEach(function (scheme) {

                        if (scheme.id === vm.config.scheme) {
                            transactionScheme = scheme;
                        }

                    });


                    var config = Object.assign({}, vm.config);


                    config.file = {};
                    config.file.name = vm.fileLocal.name;

                    $mdDialog.show({
                        controller: 'TransactionImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/transaction-import/transaction-import-errors-dialog-view.html',
                        locals: {
                            data: {
                                validationResult: data,
                                scheme: transactionScheme,
                                config: config
                            }
                        },
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function (res) {

                        if (res.status === 'agree') {
                            vm.load($event);
                        } else {
                            vm.validateConfig = {};
                            vm.readyStatus.processing = false;
                        }

                    });


                } else {
                    console.log("load triggered");

                    vm.loaderData = {
                        current: vm.config.processed_rows,
                        total: vm.config.total_rows,
                        text: 'Import Progress:',
                        status: vm.config.task_status
                    };

                    vm.load($event);
                }

            }).catch(function (error) {
                console.log("error occured", error);
            });


        };

        vm.validate = function (resolve, $event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            if (vm.validateConfig.task_id) {
                formData.append('task_id', vm.validateConfig.task_id);
            } else {

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handling', vm.config.error_handling);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('missing_data_handler', vm.config.missing_data_handler);

                vm.fileLocal = vm.config.file;
            }

            importTransactionService.validateImport(formData).then(function (data) {

                vm.validateConfig = data;

                vm.loaderData = {
                    current: vm.validateConfig.processed_rows,
                    total: vm.validateConfig.total_rows,
                    text: 'Validation Progress:',
                    status: vm.validateConfig.task_status,
                };

                $scope.$apply();

                console.log('VALIDATE IMPORT data', data);

                if (vm.validateConfig.task_status === 'SUCCESS') {

                    resolve(data)

                } else {

                    setTimeout(function () {
                        vm.validate(resolve, $event);
                    }, 1000)

                }


            })

        };

        vm.getFileUrl = function(id) {

            return baseUrl + 'file-reports/file-report/' + id + '/view/';

        };

        vm.load = function ($event) {
            vm.processing = true;

            var formData = new FormData();

            if (vm.config.task_id) {
                formData.append('task_id', vm.config.task_id);
            } else {

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handling', vm.config.error_handling);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('missing_data_handler', vm.config.missing_data_handler);

                vm.fileLocal = vm.config.local;

            }

            var transactionScheme;

            vm.transactionSchemes.forEach(function (scheme) {

                if (scheme.id === vm.config.scheme) {
                    transactionScheme = scheme;
                }

            });

            importTransactionService.startImport(formData).then(function (data) {

                vm.config = data;

                vm.loaderData = {
                    current: vm.config.processed_rows,
                    total: vm.config.total_rows,
                    text: 'Import Progress:',
                    status: vm.config.task_status
                };

                $scope.$apply();

                if (vm.config.task_status === 'SUCCESS') {

                    var error_rows = data.error_rows.filter(function (item) {
                        return item.level === 'error';
                    });


                    var description = '';

                    if (!data.total_rows && error_rows.length === 0) {

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
                                    title: "Warning",
                                    description: 'Nothing to import, check file format!'
                                }
                            }

                        });

                    } else {

                        if (vm.config.error_handling === 'break') {

                            if (data.error_row_index) {
                                description = '<div>' +
                                    '<div>Rows total: ' + data.total_rows + '</div>' +
                                    '<div>Rows success import: ' + (data.error_row_index - 1) + '</div>' +
                                    '<div>Rows fail import: ' + error_rows.length + '</div>' +
                                    '</div><br/>';
                            } else {

                                description = '<div>' +
                                    '<div>Rows total: ' + data.total_rows + '</div>' +
                                    '<div>Rows success import: ' + data.total_rows + '</div>' +
                                    '<div>Rows fail import: ' + error_rows.length + '</div>' +
                                    '</div><br/>';
                            }



                        }

                        if (vm.config.error_handling === 'continue') {

                            description = '<div>' +
                                '<div>Rows total: ' + data.total_rows + '</div>' +
                                '<div>Rows success import: ' + (data.total_rows - error_rows.length) + '</div>' +
                                '<div>Rows fail import: ' + error_rows.length + '</div>' +
                                '</div><br/>';

                        }

                        description = description + '<div> You have successfully imported transactions file </div>';

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

                    }


                    vm.processing  = false;
                    vm.dataIsImported = true;

                } else {

                    setTimeout(function () {
                        vm.load($event);
                    }, 1000)

                }

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    locals: {
                        validationData: "An error occurred. Please try again later"
                    },
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                });

                vm.processing  = false;

            })


        };

        vm.editScheme = function ($event) {

            $mdDialog.show({
                controller: 'TransactionImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-dialog-view.html',
                locals: {
                    schemeId: vm.config.scheme
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    vm.getSchemeList();

                }

            });

        };

        vm.getMember = function () {

            usersService.getMyCurrentMember().then(function (data) {

                vm.currentMember = data;

                if(vm.currentMember.is_admin) {
                    vm.hasSchemeEditPermission = true
                }

                vm.currentMember.groups_object.forEach(function (group) {

                    if(group.permission_table) {

                        group.permission_table.configuration.forEach(function (item) {

                            if(item.content_type === 'integrations.complextransactionimportscheme') {
                                if (item.data.creator_change) {
                                    vm.hasSchemeEditPermission = true
                                }
                            }

                        })

                    }

                });

                console.log('hasSchemeEditPermission', vm.hasSchemeEditPermission);

                $scope.$apply();

            });

        };

        vm.getSchemeList = function(){

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.transactionSchemes = data.results;
                vm.readyStatus.schemes = true;
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