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
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var instrumentService = require('../../services/instrumentService');
    var currencyService = require('../../services/currencyService');

    var instrumentTypeService = require('../../services/instrumentTypeService');
    var instrumentDailyPricingModelService = require('../../services/instrument/instrumentDailyPricingModelService');
    var importPriceDownloadSchemeService = require('../../services/import/importPriceDownloadSchemeService');

    var importInstrumentService = require('../../services/import/importInstrumentService');
    var instrumentPaymentSizeDetailService = require('../../services/instrument/instrumentPaymentSizeDetailService');
    var instrumentAttributeTypeService = require('../../services/instrument/instrumentAttributeTypeService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('InstrumentMappingDialogController', 'initialized');

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
            instrument_code: "USP16394AG62 Corp",
            mode: 1,
            provider: 1,
            instrument_download_scheme: 19 // remove that
        };

        vm.dailyModels = [];
        vm.priceDownloadSchemes = [];
        vm.instrumentTypes = [];
        vm.currencies = [];

        vm.dynAttributes = {};

        var providerId = 1; //TODO HARD REFACTOR CODE BLOOMBERG PROVIDER

        instrumentSchemeService.getList(providerId).then(function (data) {
            vm.instrumentSchemes = data.results;
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
            vm.dynAttributes['id_' + item.attribute_type].classifiers.forEach(function (classifier) {
                if (classifier.id == item.classifier) {
                    result = classifier.name;
                }
            });
            return result;
        };

        vm.load = function () {
            vm.readyStatus.processing = true;
            //vm.config.task = 81;
            importInstrumentService.startImport(vm.config).then(function (data) {
                console.log('data', data);
                vm.config = data;
                if (data.task_object.status == 'D' && data.instrument !== null) {
                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    vm.mappedFields = [];

                    var keysDict = [];

                    if (Object.keys(vm.config["task_result_overrides"]).length > 0) {
                        keysDict = vm.config["task_result_overrides"];
                    } else {
                        keysDict = vm.config["task_result"]
                    }

                    var keys = Object.keys(keysDict);
                    var i;
                    for (i = 0; i < keys.length; i = i + 1) {
                        vm.mappedFields.push({
                            key: keys[i],
                            value: keysDict[keys[i]]
                        })
                    }

                    var promises = [];

                    vm.config.instrument.attributes.forEach(function (attribute) {
                        if (attribute.attribute_type_object.value_type == 30) {
                            promises.push(instrumentAttributeTypeService.getByKey(attribute.attribute_type));
                        }
                    });


                    Promise.all(promises).then(function (data) {

                        data.forEach(function (item) {
                            vm.dynAttributes['id_' + item.id] = item;
                        });

                        $scope.$apply();
                    })


                } else {
                    setTimeout(function () {
                        vm.load();
                    }, 1000)

                }

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
                controller: 'InstrumentMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/instrument-mapping-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.instrument_download_scheme
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    instrumentSchemeService.update(vm.config.instrument_download_scheme, res.data).then(function () {
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
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.hide({res: 'agree'});
                }
                if (data.status == 400) {
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