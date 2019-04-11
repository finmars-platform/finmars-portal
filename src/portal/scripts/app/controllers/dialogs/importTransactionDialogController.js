/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/import/dataProvidersService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var instrumentService = require('../../services/instrumentService');
    var currencyService = require('../../services/currencyService');

    var instrumentTypeService = require('../../services/instrumentTypeService');
    var instrumentDailyPricingModelService = require('../../services/instrument/instrumentDailyPricingModelService');
    var importPriceDownloadSchemeService = require('../../services/import/importPriceDownloadSchemeService');

    var importTransactionService = require('../../services/import/importTransactionService');
    var instrumentPaymentSizeDetailService = require('../../services/instrument/instrumentPaymentSizeDetailService');
    var instrumentAttributeTypeService = require('../../services/instrument/instrumentAttributeTypeService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('TransactionMappingDialogController', 'initialized');

        console.log('mdDialog is ', $mdDialog);

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

        vm.config = {
            delimiter: ',',
            mode: 1
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

        vm.startImport = function ($event) {

            new Promise(function (resolve, reject) {

                vm.validateConfig = Object.assign({}, vm.config);

                vm.validate(resolve, $event)

            }).then(function (res) {

                if (vm.validateConfig.error_rows.length) {

                    vm.validateConfig.process_mode = 'validate';

                    $mdDialog.show({
                        controller: 'ImportTransactionErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/import-transaction-errors-dialog-view.html',
                        locals: {
                            data: vm.validateConfig
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

                    })

                } else {
                    vm.load($event);
                }

            })

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
            }

            importTransactionService.validateImport(formData).then(function (data) {

                vm.validateConfig = data;

                if (vm.validateConfig.task_status === 'SUCCESS') {

                    console.log('VALIDATE IMPORT data', data);

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
            }

            importTransactionService.startImport(formData).then(function (data) {

                vm.config = data;

                if (vm.config.task_status === 'SUCCESS') {

                    if (vm.config.error_rows.length === 0) {

                        // vm.finishedSuccess = true;

                        var description = '';

                        description = '<div>' +
                            '<div>Rows total: ' + data.total_rows + '</div>' +
                            '<div>Rows success import: ' + data.total_rows - data.error_rows.length + '</div>' +
                            '<div>Rows fail import: ' + data.error_rows.length + '</div>' +
                            '</div><br/>';

                        description = description + '<div> You have successfully imported transactions file </div>';

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
                            controller: 'ImportTransactionErrorsDialogController as vm',
                            templateUrl: 'views/dialogs/import-transaction-errors-dialog-view.html',
                            locals: {
                                data: vm.config
                            },
                            targetEvent: $event,
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true,
                        })
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
                })

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
                templateUrl: 'views/dialogs/transaction-import-scheme-dialog-view.html',
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
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {
            instrumentService.create(vm.config.instrument).then(function (data) {

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    locals: {
                        success: {
                            title: "",
                            description: "You have you have successfully add instrument " + vm.config.instrument.user_code + " (user code)."
                        }
                    },
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true
                }).then(function () {
                    $mdDialog.hide({res: 'agree'});
                });

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    locals: {
                        validationData: reason.message
                    },
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true
                })


            })

        };

    };

}());