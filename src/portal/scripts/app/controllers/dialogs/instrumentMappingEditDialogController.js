/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/import/dataProvidersService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('InstrumentMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {dataProviders: false, scheme: false};

        instrumentSchemeService.getByKey(schemeId).then(function (data) {
            vm.scheme = data;
            vm.readyStatus.scheme = true;
            fillArraysWithScheme();
            $scope.$apply();
        });

        vm.hidedEntityAttrs = [
            'factor_schedule_method',
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
        console.log('vm.entityAttrs', vm.entityAttrs);
        vm.attrs = [];
        attributeTypeService.getList('instrument').then(function (data) {
            vm.attrs = data.results;
            $scope.$apply();
        });

        vm.dataProviders = [];

        dataProvidersService.getList().then(function (data) {
            vm.dataProviders = data;
            vm.readyStatus.dataProviders = true;
            $scope.$apply();
        });

        vm.mapFields = [
            {
                key: 'name',
                caption: 'Name',
                required: true,
                expression: ''
            },
            {
                key: 'user_code',
                caption: 'User code',
                required: true,
                expression: ''
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
                expression: ''
            },
            {
                key: 'short_name',
                caption: 'Short name',
                required: true,
                expression: ''
            },
            {
                key: 'public_name',
                caption: 'Public name',
                required: true,
                expression: ''
            }
        ];

        vm.providerFields = [
            {
                name: '',
                field: ''
            }
        ];

        var fillArraysWithScheme = function () {

            vm.schemeName = vm.scheme['scheme_name'];
            vm.schemeProvider = vm.scheme['provider'];
            vm.factorScheduleMethod = vm.scheme['factor_schedule_method'];
            vm.accrualCalculation = vm.scheme['accrual_calculation_schedule_method'];

            var findKeyCaption = function (key) {
                var i;
                for (i = 0; i < vm.entityAttrs.length; i = i + 1) {
                    if (vm.entityAttrs[i].key == key) {
                        return vm.entityAttrs[i].caption;
                    }
                }
            };

            var checkRequired = function (key) {
                var requiredFields = ['name',
                    'user_code',
                    'instrument_type',
                    'reference_for_pricing',
                    'short_name',
                    'public_name'];
                if (requiredFields.indexOf(key) !== -1) {
                    return true
                }
                return false;
            };

            var findEntityWithComplexExpression = function (key) {

                if (key == 'accrued_currency') {
                    return 'currency';
                }
                if (key == 'pricing_currency') {
                    return 'currency';
                }

                if (key == 'instrument_type') {
                    return 'instrument_type';
                }

                return false;

            };

            var keys = Object.keys(vm.scheme);
            var i;
            vm.mapFields = [];
            for (i = 0; i < keys.length; i = i + 1) {

                if (vm.hidedEntityAttrs.indexOf(keys[i]) === -1) {

                    var caption = findKeyCaption(keys[i]);
                    var required = checkRequired(keys[i]);
                    var complexExpressionEntity = findEntityWithComplexExpression(keys[i]);

                    vm.mapFields.push({
                        caption: caption,
                        required: required,
                        complexExpressionEntity: complexExpressionEntity,
                        key: keys[i],
                        expression: vm.scheme[keys[i]]
                    })
                }
            }

            var a;
            for (a = 0; a < vm.scheme.attributes.length; a = a + 1) {
                console.log('vm.scheme.attributes[a]', vm.scheme.attributes[a]);
                vm.mapFields.push({
                    id: vm.scheme.attributes[a]['id'],
                    expression: vm.scheme.attributes[a].value,
                    attribute_type: vm.scheme.attributes[a]['attribute_type'],
                    attr: vm.scheme.attributes[a]
                });
            }

            vm.providerFields = vm.scheme.inputs;
        };

        vm.getModelKey = function (item) {
            if (item.hasOwnProperty('key')) {
                return 'key'
            }
            return 'attribute_type'
        };

        vm.addProviderField = function () {
            vm.providerFields.push({
                name: '',
                field: ''
            })
        };

        vm.addMapField = function () {
            vm.mapFields.push({
                expression: '',
                required: false
            })
        };

        vm.removeProviderField = function (item, $index) {
            vm.providerFields.splice($index, 1);
        };

        vm.removeMappingField = function (item, $index) {
            vm.mapFields.splice($index, 1);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            vm.schemeUpdated = {};
            vm.schemeUpdated['scheme_name'] = vm.schemeName;
            vm.schemeUpdated['provider'] = vm.schemeProvider;
            vm.schemeUpdated['factor_schedule_method'] = vm.factorScheduleMethod;
            vm.schemeUpdated['accrual_calculation_schedule_method'] = vm.accrualCalculation;

            vm.schemeUpdated.attributes = [];

            var i;
            for (i = 0; i < vm.mapFields.length; i = i + 1) {
                if (vm.mapFields[i].hasOwnProperty('attribute_type')) {
                    vm.schemeUpdated.attributes.push({
                        id: vm.mapFields[i].id,
                        attribute_type: vm.mapFields[i]['attribute_type'],
                        value: vm.mapFields[i].expression
                    })
                } else {
                    vm.schemeUpdated[vm.mapFields[i].key] = vm.mapFields[i].expression;
                }
            }


            vm.schemeUpdated.inputs = vm.providerFields;

            $mdDialog.hide({
                status: 'agree',
                data: vm.schemeUpdated
            })
        };

        vm.openMapping = function($event, mapEntityType){
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