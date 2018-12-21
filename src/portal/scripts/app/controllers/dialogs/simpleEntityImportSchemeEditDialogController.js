/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var metaContentTypesService = require('../../services/metaContentTypesService');


    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {scheme: false, entitySchemeAttributes: false};

        vm.dynamicAttributes = [];

        entitySchemeService.getByKey(schemeId).then(function (data) {

            vm.scheme = data;

            vm.readyStatus.scheme = true;

            if (vm.scheme.content_type !== 'instruments.pricehistory' && vm.scheme.content_type !== 'currencyhistorys.currencyhistory') {

                vm.getAttrs();
            }

            $scope.$apply();

        });

        vm.getAttrs = function () {

            var entity = metaContentTypesService.findEntityByContentType(vm.scheme.content_type);

            attributeTypeService.getList(entity).then(function (data) {

                vm.dynamicAttributes = data.results;

                vm.extendEntityFields();

                $scope.$apply();
            });
        };

        vm.extendEntityFields = function () {

            vm.scheme.entity_fields.forEach(function (item) {

                if (item.dynamic_attribute_id !== null) {

                    vm.dynamicAttributes.forEach(function (attribute) {

                        if (item.dynamic_attribute_id === attribute.id) {
                            item.value_type = attribute.value_type;
                        }

                    })

                }

            })

        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme;
        };

        vm.addCsvField = function () {
            vm.scheme.csv_fields.push({
                name: '',
                column: vm.scheme.csv_fields.length
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

        vm.hasMapping = function (item) {

            if (item.hasOwnProperty('value_type')) {
                return item.value_type === 'field';
            }

        };

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

            entitySchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {

                $mdDialog.hide({res: 'agree'});

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason.message
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        };

        vm.openMapping = function ($event, item) {

            if (item.hasOwnProperty('value_type')) {

                $mdDialog.show({
                    controller: 'EntityTypeClassifierMappingDialogController as vm',
                    templateUrl: 'views/dialogs/entity-type-classifier-mapping-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        options: {
                            entity: vm.scheme.content_type,
                            attribute_type_id: item.dynamic_attribute_id
                        }
                    }
                })

            } else {

                var entity = '';

                if (item.system_property_key === 'accounts') {
                    entity = 'account'
                }

                if (item.system_property_key === 'responsibles') {
                    entity = 'responsible'
                }

                if (item.system_property_key === 'counterparties') {
                    entity = 'counterparty'
                }

                if (item.system_property_key === 'portfolios') {
                    entity = 'portfolio'
                }

                if(item.system_property_key === 'pricing_policy') {
                    entity = 'pricing-policy'
                }

                if(item.system_property_key === 'instrument_type') {
                    entity = 'instrument-type'
                }

                if(item.system_property_key === 'instrument') {
                    entity = 'instrument'
                }

                if (item.system_property_key === 'currency') {
                    entity = 'currency'
                }

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

            }
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