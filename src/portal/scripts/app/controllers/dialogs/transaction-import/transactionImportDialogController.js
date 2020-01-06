/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var metaService = require('../../../services/metaService');
    var dataProvidersService = require('../../../services/import/dataProvidersService');
    var scheduleService = require('../../../services/import/scheduleService');
    var attributeTypeService = require('../../../services/attributeTypeService');
    var transactionSchemeService = require('../../../services/import/transactionSchemeService');
    var instrumentService = require('../../../services/instrumentService');
    var currencyService = require('../../../services/currencyService');

    var instrumentTypeService = require('../../../services/instrumentTypeService');
    var instrumentDailyPricingModelService = require('../../../services/instrument/instrumentDailyPricingModelService');
    var importPriceDownloadSchemeService = require('../../../services/import/importPriceDownloadSchemeService');

    var importTransactionService = require('../../../services/import/importTransactionService');
    var instrumentPaymentSizeDetailService = require('../../../services/instrument/instrumentPaymentSizeDetailService');
    var instrumentAttributeTypeService = require('../../../services/instrument/instrumentAttributeTypeService');


    var baseUrlService = require('../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    module.exports = function ($scope, $mdDialog) {

        logService.controller('TransactionMappingDialogController', 'initialized');

        console.log('mdDialog is ', $mdDialog);

        var vm = this;

        vm.fileLocal = null;

        vm.readyStatus = {
            mapping: false,
            processing: false,
            dailyModel: false,
            priceDownloadScheme: false,
            instrumentType: false,
            currency: false
        };
        vm.dataIsImported = false;

        vm.config = {
            delimiter: ',',
            mode: 1,
            missing_data_handler: 'throw_error',
            error_handling: 'break'
        };

        vm.validateConfig = {
            mode: 1
        };

        vm.loadIsAvailable = function () {
            return !vm.readyStatus.processing && vm.config.scheme && vm.config.error_handling;
        };

        vm.dailyModels = [];
        vm.priceDownloadSchemes = [];
        vm.instrumentTypes = [];
        vm.currencies = [];

        vm.dynAttributes = {};

        transactionSchemeService.getList().then(function (data) {
            vm.transactionSchemes = data.results;
            vm.readyStatus.mapping = true;
            $scope.$apply();
        });

        instrumentDailyPricingModelService.getList().then(function (data) {
            vm.dailyModels = data;
            vm.readyStatus.dailyModel = true;
            $scope.$apply();
        });

        importPriceDownloadSchemeService.getList().then(function (data) {
            vm.priceDownloadSchemes = data.results;
            vm.readyStatus.priceDownloadScheme = true;
            $scope.$apply();
        });

        instrumentPaymentSizeDetailService.getList().then(function (data) {
            vm.paymentSizeDefaults = data;
            $scope.$apply();
        });

        instrumentTypeService.getList().then(function (data) {
            vm.instrumentTypes = data.results;
            vm.readyStatus.instrumentType = true;
            $scope.$apply();
        });

        currencyService.getList().then(function (data) {
            vm.currencies = data.results;
            vm.readyStatus.currency = true;
            $scope.$apply();
        });

        vm.appendString = function (string) {
            var code = vm.config.instrument_code.split(' ')[0];
            vm.config.instrument_code = code + ' ' + string;
        };

        vm.resolveAttributeNode = function (item) {
            var result = '';
            if (item.hasOwnProperty('classifier_object') && item.classifier_object !== null) {
                return item.classifier_object.name;
            }
            vm.dynAttributes['id_' + item.attribute_type].classifiers.forEach(function (classifier) {
                if (classifier.id == item.classifier) {
                    result = classifier.name;
                }
            });
            return result;
        };

        vm.checkExtension = function ($event) {
            console.log('vm.config.file', vm.config.file);

            if (vm.config.file) {

                var ext = vm.config.file.name.split('.')[1]

                if (ext !== 'csv') {

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
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            vm.config.file = null;
                        }
                    });

                }

            }

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

        vm.findError = function (item, type, state) {

            var message = '';
            var haveError = false;

            if (type == 'entityAttr') {
                if (vm.config.errors.hasOwnProperty(item)) {
                    message = vm.config.errors[item].join(' ');
                    haveError = true;
                }
            }

            if (type == 'dynAttr') {
                //console.log('item', item);
                if (vm.config.errors.hasOwnProperty('attribute_type_' + item.attribute_type)) {
                    message = vm.config.errors['attribute_type_' + item.attribute_type].join(' ');
                    haveError = true;
                }
            }

            if (state == 'message') {
                return message
            } else {
                return haveError;
            }
        };

        vm.validateImport = function ($event) {

            new Promise(function (resolve, reject) {

                vm.validateConfig = Object.assign({}, vm.config);

                vm.validate(resolve, $event)

            }).then(function (data) {

                if (vm.validateConfig.error_rows.length) {

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

                        vm.validateConfig = {};
                        vm.readyStatus.processing = false;

                    });


                } else {

                    vm.validateConfig = {};
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

                vm.validateConfig = Object.assign({}, vm.config);

                vm.validate(resolve, $event)

            }).then(function (data) {

                if (vm.validateConfig.error_rows.length) {

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
                    vm.load($event);
                }

            }).catch(function (error) {
                console.log("error occured", error);
            });


        };

        vm.getFileUrl = function(id) {

            return baseUrl + 'file-reports/file-report/' + id + '/view/';

        };

        vm.validate = function (resolve) {
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

                $scope.$apply();

                console.log('VALIDATE IMPORT data', data);

                if (vm.validateConfig.task_status === 'SUCCESS') {

                    // console.log('VALIDATE IMPORT data', data);

                    resolve(data)

                } else {

                    setTimeout(function () {
                        vm.validate(resolve);
                    }, 1000)

                }


            })

        };

        vm.load = function ($event) {
            vm.readyStatus.processing = true;
            //vm.config.task = 81;

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

                $scope.$apply();

                if (vm.config.task_status === 'SUCCESS') {

                    // vm.finishedSuccess = true;

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

                            description = '<div>' +
                                '<div>Rows total: ' + data.total_rows + '</div>' +
                                '<div>Rows success import: ' + (data.error_row_index - 1) + '</div>' +
                                '<div>Rows fail import: ' + error_rows.length + '</div>' +
                                '</div><br/>';

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


                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                } else {

                    setTimeout(function () {
                        vm.load();
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

            })


        };

        vm.recalculate = function () {
            vm.mappedFields.forEach(function (item) {
                vm.config.task_result_overrides[item.key] = item.value;
            });
            vm.load();
        };

        vm.openEditMapping = function ($event) {
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
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    transactionSchemeService.update(vm.config.scheme, res.data).then(function () {
                        //vm.getList();
                        $scope.$apply();
                    })
                }
            });
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


    };

}());