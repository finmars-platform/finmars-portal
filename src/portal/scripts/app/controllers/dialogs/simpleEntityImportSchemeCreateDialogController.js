/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('EntityMappingCreateDialogController', 'initialized');

        var vm = this;
        vm.scheme = {

            csv_fields: [],
            entity_fields: []

        };

        vm.getAttrs = function () {

            var entity = vm.scheme.content_type.split('.')[1];

            attributeTypeService.getList(entity).then(function (data) {

                vm.dynamicAttributes = data.results;

                $scope.$apply();
            });
        };

        vm.readyStatus = {scheme: true, entitySchemeAttributes: false};

        vm.contentTypes = metaContentTypesService.getListForSimleEntityImport();

        vm.scheme.content_type = vm.contentTypes[0].key;
        vm.getAttrs();

        vm.updateEntityFields = function () {

            var entity = metaContentTypesService.findEntityByContentType(vm.scheme.content_type);

            vm.scheme.entity_fields = metaService.getEntityAttrs(entity).filter(function (item) {

                return ['tags', 'transaction_types', 'object_permissions_user', 'object_permissions_group'].indexOf(item.key) === -1

            }).map(function (item) {

                return {
                    expression: '',
                    system_property_key: item.key,
                    name: item.name,
                    value_type: item.value_type
                }

            });

            if (vm.scheme.content_type !== 'instruments.pricehistory' && vm.scheme.content_type !== 'currencyhistorys.currencyhistory') {

                vm.getAttrs();

            }
        };

        vm.updateEntityFields();

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme;
        };

        vm.addCsvField = function () {
            var csvFieldsLength = vm.scheme.csv_fields.length;
            var lastFieldNumber;
            var nextFieldNumber;
            if (csvFieldsLength === 0) {
                nextFieldNumber = 0;
            } else {
                lastFieldNumber = parseInt(vm.scheme.csv_fields[csvFieldsLength - 1].column);
                nextFieldNumber = lastFieldNumber + 1;
            }

            vm.scheme.csv_fields.push({
                name: '',
                column: nextFieldNumber
            })
        };

        vm.addDynamicAttribute = function () {
            vm.scheme.entity_fields.push({
                expression: '',
                name: ''
            })
        };

        vm.removeCsvField = function (item, $index) {
            vm.scheme.csv_fields.splice($index, 1);
        };

        vm.removeDynamicAttribute = function (item, $index) {
            vm.scheme.entity_fields.splice($index, 1);
        };

        var allowedEntityAttrsArray = ['accounts',
                                       'counterparties',
                                       'currency',
                                       'daily_pricing_model',
                                       'payment_size_detail',
                                       'portfolios', 'pricing_policy',
                                       'price_download_scheme',
                                       'responsibles', 'instrument_type',
                                       'instrument',
                                       'strategy_1',
                                       'strategy_2',
                                       'strategy_3'];


        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            vm.scheme.entity_fields.forEach(function (item) {

                vm.dynamicAttributes.forEach(function (attr) {

                    if (item.dynamic_attribute_id === attr.id) {
                        item.name = attr.name
                    }

                })

            });

            entitySchemeService.create(vm.scheme).then(function (data) {

                $mdDialog.hide({res: 'agree'});

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason.message
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        };

        vm.openMapping = function ($event, item) {

            var entity = '';

            switch (item.system_property_key) {
                case 'accounts':
                    entity = 'account';
                    break;
                case 'counterparties':
                    entity = 'counterparty';
                    break;
                case 'currency':
                    entity = 'currency';
                    break;
                case 'daily_pricing_model':
                    entity = 'daily-pricing-model';
                    break;
                case 'payment_size_detail':
                    entity = 'payment-size-detail';
                    break;
                case 'portfolios':
                    entity = 'portfolio';
                    break;
                case 'pricing_policy':
                    entity = 'pricing-policy';
                    break;
                case 'price_download_scheme':
                    entity = 'price-download-scheme';
                    break;
                case 'responsibles':
                    entity = 'responsible';
                    break;
                case 'instrument_type':
                    entity = 'instrument-type';
                    break;
                case 'instrument':
                    entity = 'instrument';
                    break;
                case 'strategy_1':
                    entity = 'strategy-1';
                    break;
                case 'strategy_2':
                    entity = 'strategy-2';
                    break;
                case 'strategy_3':
                    entity = 'strategy-3';
                    break;
            }
            // if (item.system_property_key === 'accounts') {
            //     entity = 'account'
            // }
            //
            // if (item.system_property_key === 'responsibles') {
            //     entity = 'responsible'
            // }
            //
            // if (item.system_property_key === 'counterparties') {
            //     entity = 'counterparty'
            // }
            //
            // if (item.system_property_key === 'pricing_policy') {
            //     entity = 'pricing-policy'
            // }
            //
            // if (item.system_property_key === 'instrument_type') {
            //     entity = 'instrument-type'
            // }
            //
            // if (item.system_property_key === 'instrument') {
            //     entity = 'instrument'
            // }
            //
            // if (item.system_property_key === 'currency') {
            //     entity = 'currency'
            // }

            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    mapItem: {complexExpressionEntity: entity}
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
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {
                        expression: item.expression
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                    if (res.data) {
                        item.expression = res.data.item.expression;
                    }
                    $scope.$apply();
                }
            });
        };

    };

}());