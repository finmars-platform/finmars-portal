/**
 * Created by szhitenev on 14.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var dataProvidersService = require('../../services/import/dataProvidersService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var entitySchemesService = require('../../services/import/entitySchemesService');
    var instrumentService = require('../../services/instrumentService');
    var currencyService = require('../../services/currencyService');

    var instrumentTypeService = require('../../services/instrumentTypeService');
    var instrumentDailyPricingModelService = require('../../services/instrument/instrumentDailyPricingModelService');
    var importPriceDownloadSchemeService = require('../../services/import/importPriceDownloadSchemeService');

    var importEntityService = require('../../services/import/importEntityService');
    var instrumentPaymentSizeDetailService = require('../../services/instrument/instrumentPaymentSizeDetailService');
    var instrumentAttributeTypeService = require('../../services/instrument/instrumentAttributeTypeService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('ImportEntityDialogControllers', 'initialized');

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

        vm.entity = {};

        vm.config = {
            mode: 1,

        };

        vm.loadIsAvailable = function () {
            if (vm.readyStatus.processing == false && vm.config.scheme != null) {
                return true;
            }
            return false;
        };

        vm.dailyModels = [];
        vm.priceDownloadSchemes = [];
        vm.instrumentTypes = [];
        vm.currencies = [];

        vm.dynAttributes = {};


        metaContentTypesService.findEntityByAPIContentType().then(function (data) {
            vm.listOfEntities = data;
            $scope.$apply();
        });

        vm.getSchemeList = function () {
            entitySchemesService.getEntitiesSchemesList().then(function (data) {
                vm.entitySchemes = data.results;
                vm.readyStatus.mapping = true;
                $scope.$apply();
            });
        };
        vm.getSchemeList();

        vm.filterSchemesByEntity = function (entityId) {
            vm.entitySchemes = [];
            entitySchemesService.getEntitySchemesByModel(entityId).then(function (data) {
                vm.entitySchemes = data.results;
                $scope.$apply();
            });
        };

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

        vm.load = function ($event) {
            vm.readyStatus.processing = true;
            //vm.config.task = 81;

            var formData = new FormData();

            if (vm.config.task_id) {
                formData.append('task_id', vm.config.task_id);
            } else {
                console.log('csv data for upload', vm.config);
                formData.append('files', vm.config.file);
                formData.append('schema', vm.config.scheme);
                formData.append('error_handling', vm.config.error_handling);
            }

            importEntityService.startImport(formData).then(function (data) {
                console.log('data', data);

                if (data.status != 500) {
                    vm.config = data.response;

                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    // if (vm.config.task_status == 'SUCCESS') {
                    //
                    //
                    //     if (vm.config.error_rows.length == 0) {
                    //         vm.finishedSuccess = true;
                    //     } else {
                    //         $mdDialog.show({
                    //             controller: 'ImportTransactionErrorsDialogController as vm',
                    //             templateUrl: 'views/dialogs/import-transaction-errors-dialog-view.html',
                    //             targetEvent: $event,
                    //             locals: {
                    //                 data: vm.config
                    //             },
                    //             preserveScope: true,
                    //             autoWrap: true,
                    //             skipHide: true
                    //         })
                    //     }
                    //
                    //     vm.readyStatus.processing = false;
                    //     vm.dataIsImported = true;
                    //
                    // } else {
                    //     setTimeout(function () {
                    //         vm.load();
                    //     }, 1000)
                    //
                    // }
                }
                if (data.status == 500) {
                    $mdDialog.show({
                        controller: 'ImportEntityErrorController as vm',
                        templateUrl: 'views/dialogs/import-entity-error-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            errorData: data.response
                        }
                    })
                }
            });

            // importEntityService.startImport(formData).then(function (data) {
            //     console.log('data', data);
            //     if (data.status != 500) {
            //         vm.config = data.response;
            //         if (vm.config.task_status == 'SUCCESS') {
            //
            //
            //             if (vm.config.error_rows.length == 0) {
            //                 vm.finishedSuccess = true;
            //             } else {
            //                 $mdDialog.show({
            //                     controller: 'ImportTransactionErrorsDialogController as vm',
            //                     templateUrl: 'views/dialogs/import-transaction-errors-dialog-view.html',
            //                     targetEvent: $event,
            //                     locals: {
            //                         data: vm.config
            //                     },
            //                     preserveScope: true,
            //                     autoWrap: true,
            //                     skipHide: true
            //                 })
            //             }
            //
            //             vm.readyStatus.processing = false;
            //             vm.dataIsImported = true;
            //
            //
            //         } else {
            //             setTimeout(function () {
            //                 vm.load();
            //             }, 1000)
            //
            //         }
            //     }
            //     if (data.status == 500) {
            //         $mdDialog.show({
            //             controller: 'ValidationDialogController as vm',
            //             templateUrl: 'views/dialogs/validation-dialog-view.html',
            //             targetEvent: $event,
            //             locals: {
            //                 validationData: "An error occurred. Please try again later"
            //             },
            //             preserveScope: true,
            //             autoWrap: true,
            //             skipHide: true
            //         })
            //     }
            //
            //
            // })
        };

        vm.recalculate = function () {
            vm.mappedFields.forEach(function (item) {
                vm.config.task_result_overrides[item.key] = item.value;
            });
            vm.load();
        };

        vm.openEditMapping = function ($event) {
            $mdDialog.show({
                controller: 'EntityMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/entity-mapping-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    transactionSchemeService.update(vm.config.scheme, res.data).then(function () {
                        //vm.getList();
                        $scope.$apply();
                    })
                }
                if (res.res === 'agree') {
                    if (vm.entity.id) {
                        vm.filterSchemesByEntity(vm.entity.id);
                    }
                    else {
                        vm.getSchemeList();
                    }
                }
            });
        };

        vm.createScheme = function ($event, entity) {
            $mdDialog.show({
                controller: 'EntitySchemeCreationDialogController as vm',
                templateUrl: 'views/dialogs/entity-scheme-creation-dialog.html',
                targetEvent: $event,
                multiple: true,
                locals: {
                    entity: entity
                }
            }).then(function (res) {
                console.log('response after creation is', res);
                if (res.status) {
                    console.log(res);
                }
                if (res.res === 'agree') {
                    if (vm.entity.id) {
                        vm.filterSchemesByEntity(vm.entity.id);
                    }
                    else {
                        vm.getSchemeList();
                    }
                }
            });
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {
            instrumentService.create(vm.config.instrument).then(function (data) {
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "",
                                description: "You have you have successfully add instrument " + vm.config.instrument.user_code + " (user code)."
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function () {
                        $mdDialog.hide({res: 'agree'});
                    });

                }
                if (data.status == 400 || data.status == 500) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: data.response
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }
            });

        };

    };

}());