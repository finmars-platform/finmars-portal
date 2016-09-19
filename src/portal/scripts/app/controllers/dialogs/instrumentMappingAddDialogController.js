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

    module.exports = function ($scope, $mdDialog) {

        logService.controller('InstrumentMappingDialogController', 'initialized');

        var vm = this;

        vm.dataProviders = [];

        vm.readyStatus = {dataProviders: false, scheme: true};

        dataProvidersService.getList().then(function (data) {
            vm.dataProviders = data;
            vm.readyStatus.dataProviders = true;
            $scope.$apply();
        });

        vm.hidedEntityAttrs = ['factor_schedule_method',
            'accrual_calculation_schedule_method',
            'provider',
            'url',
            'scheme_name',
            'id',
            'attributes',
            'inputs'];

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs("instrument-scheme").map(function (item) {
            if (item.key == 'factor_schedule_method' || item.key == 'accrual_calculation_schedule_method') {
                return null;
            }
            return item;
        }).filter(function (item) {
            return !!item
        });
        vm.attrs = [];
        attributeTypeService.getList('instrument').then(function (data) {
            vm.attrs = data.results;
            $scope.$apply();
        });

        vm.scheme = {};

        var createEmptyScheme = function () {
            vm.scheme.attributes = [];
            var b;
            for (b = 0; b < vm.baseAttrs.length; b = b + 1) {
                vm.scheme[vm.baseAttrs[b].key] = ''
            }
            var i;
            for (i = 0; i < vm.entityAttrs.length; i = i + 1) {
                vm.scheme[vm.entityAttrs[i].key] = ''
            }
        };

        createEmptyScheme();

        vm.mapFields = [
            {
                key: 'name',
                caption: 'Name',
                required: true,
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'user_code',
                caption: 'User code',
                required: true,
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'instrument_type',
                caption: 'Instrument type',
                required: true,
                expression: ''
            },
            {
                key: 'reference_for_pricing',
                caption: 'Reference for pricing',
                required: true,
                expression: '',
                complexExpressionEntity: false
            }
        ];

        vm.mappedFieldsDefaults = [
            {
                key: 'daily_pricing_model',
                caption: 'Daily pricing model',
                required: false,
                value_type: "field",
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'price_download_scheme',
                caption: 'Price download scheme',
                required: false,
                value_type: "field",
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'default_price',
                caption: 'Default price',
                value_type: 10,
                required: false,
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'default_accrued',
                caption: 'Default accrued',
                value_type: 10,
                required: false,
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'payment_size_detail',
                caption: 'Payment size detail',
                value_type: "field",
                required: false,
                expression: '',
                complexExpressionEntity: false
            }
        ];

        vm.mappedFieldsSecond = [
            {
                key: 'short_name',
                caption: 'Short name',
                required: true,
                expression: '',
                complexExpressionEntity: false
            },
            {
                key: 'public_name',
                caption: 'Public name',
                required: true,
                expression: '',
                complexExpressionEntity: false
            }
        ];

        vm.providerFields = [
            {
                name: '',
                field: ''
            }
        ];

        vm.addProviderField = function () {
            vm.providerFields.push({
                name: '',
                field: ''
            })
        };

        vm.addMapField = function () {
            vm.mapFields.push({
                expression: '',
                required: false,
                complexExpressionEntity: false
            })
        };

        vm.removeProviderField = function (item, $index) {
            console.log('$index', $index);

            vm.providerFields.splice($index, 1);

            //$scope.$apply();
            console.log('vm.providerFields', vm.providerFields);
        };

        vm.removeMappingField = function (item, $index) {
            vm.mapFields.splice($index, 1);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            vm.scheme['scheme_name'] = vm.schemeName;
            vm.scheme['provider'] = vm.schemeProvider;
            vm.scheme['factor_schedule_method'] = vm.factorScheduleMethod;
            vm.scheme['accrual_calculation_schedule_method'] = vm.accrualCalculation;

            vm.scheme.attributes = [];


            function syncMapFields() {
                var i;
                for (i = 0; i < vm.mapFields.length; i = i + 1) {
                    if (vm.mapFields[i].hasOwnProperty('attribute_type')) {
                        vm.scheme.attributes.push({
                            attribute_type: vm.mapFields[i]['attribute_type'],
                            value: vm.mapFields[i].expression
                        })
                    } else {
                        vm.scheme[vm.mapFields[i].key] = vm.mapFields[i].expression;
                    }
                }
            }

            function syncMappedFieldsDefaults() {
                var i;
                for (i = 0; i < vm.mappedFieldsDefaults.length; i = i + 1) {
                    if (vm.mappedFieldsDefaults[i].hasOwnProperty('attribute_type')) {
                        vm.scheme.attributes.push({
                            attribute_type: vm.mappedFieldsDefaults[i]['attribute_type'],
                            value: vm.mappedFieldsDefaults[i].expression
                        })
                    } else {
                        vm.scheme[vm.mappedFieldsDefaults[i].key] = vm.mappedFieldsDefaults[i].expression;
                    }
                }
            }

            function syncMappedFieldsSecond() {
                var i;
                for (i = 0; i < vm.mappedFieldsSecond.length; i = i + 1) {
                    if (vm.mappedFieldsSecond[i].hasOwnProperty('attribute_type')) {
                        vm.scheme.attributes.push({
                            attribute_type: vm.mappedFieldsSecond[i]['attribute_type'],
                            value: vm.mappedFieldsSecond[i].expression
                        })
                    } else {
                        vm.scheme[vm.mappedFieldsSecond[i].key] = vm.mappedFieldsSecond[i].expression;
                    }
                }
            }

            syncMapFields();
            syncMappedFieldsDefaults();
            syncMappedFieldsSecond();


            vm.scheme.inputs = vm.providerFields;

            $mdDialog.hide({
                status: 'agree',
                data: vm.scheme
            })
        };

        vm.openMapping = function ($event, mapEntityType) {
            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    mapEntityType: mapEntityType
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                }
            });
        };

        vm.openExpressionDialog = function ($event, item) {
            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: item
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    item.expression = res.data.item.expression;
                    $scope.$apply();
                }
            });
        };

        vm.getModelKey = function (item) {
            if (item.hasOwnProperty('key')) {
                return 'key'
            }
            return 'attribute_type'
        };

        vm.getSchedules = function () {

            scheduleService.getAccrualScheduleDownloadMethodList().then(function (data) {
                vm.accrualSchedule = data;
                vm.readyStatus.accrualSchedule = true;
                $scope.$apply();
            });

            scheduleService.getFactorScheduleDownloadMethodList().then(function (data) {
                vm.factorSchedule = data;
                vm.readyStatus.factorSchedule = true;
                $scope.$apply();
            });

        };

        vm.checkSchedules = function () {
            if (vm.readyStatus.accrualSchedule && vm.readyStatus.factorSchedule) {
                return true;
            }
            return false;
        };

        vm.getSchedules();

        vm.checkAttrs = function () {

            var b, e, a;
            var x, y, z;
            for (b = 0; b < vm.baseAttrs.length; b = b + 1) {
                vm.baseAttrs[b].disabled = false;
                for (x = 0; x < vm.mapFields.length; x = x + 1) {
                    if (vm.mapFields[x].key == vm.baseAttrs[b].key) {
                        vm.baseAttrs[b].disabled = true;
                    }
                }
            }

            for (e = 0; e < vm.entityAttrs.length; e = e + 1) {
                vm.entityAttrs[e].disabled = false;
                for (y = 0; y < vm.mapFields.length; y = y + 1) {
                    if (vm.hidedEntityAttrs.indexOf(vm.entityAttrs[e].key) === -1) {
                        if (vm.mapFields[y].key == vm.entityAttrs[e].key) {
                            vm.entityAttrs[e].disabled = true;
                        }
                    }
                }
            }

            for (a = 0; a < vm.attrs.length; a = a + 1) {
                vm.attrs[a].disabled = false;
                for (z = 0; z < vm.mapFields.length; z = z + 1) {
                    if (vm.mapFields[z].hasOwnProperty('attribute_type')) {
                        if (vm.mapFields[z].attribute_type == vm.attrs[a].id) {
                            vm.attrs[a].disabled = true;
                        }
                    }
                }
            }

        }
    };

}());