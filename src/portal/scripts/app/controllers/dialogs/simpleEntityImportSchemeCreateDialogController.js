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

    var modelService = require('../../services/modelService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('EntityMappingCreateDialogController', 'initialized');

        var vm = this;
        vm.scheme = {

            csv_fields: [],
            entity_fields: []

        };

        vm.inputsGroup = {
            "name": "<b>Inputs</b>",
            "key": 'input'
        };

        vm.inputsFunctions = [];

        vm.getFunctions = function () {

            return vm.scheme.csv_fields.map(function(input){

                return {
                    "name": "Add input " + input.value,
                    "description": "Imported Parameter: " + input.value + " (column #" + input.column + ") ",
                    "groups": "input",
                    "func": input.value
                }

            })

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

            var modelAttributes = modelService.getAttributesByContentType(vm.scheme.content_type);

            vm.scheme.entity_fields.forEach(function (entityField) {

                if (entityField.system_property_key) {

                    modelAttributes.forEach(function (attribute) {

                        if (attribute.key === entityField.system_property_key) {
                            entityField.value_type = attribute.value_type;
                            entityField.entity = attribute.entity;
                            entityField.content_type = attribute.content_type;
                            entityField.code = attribute.code;
                        }

                    })

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

            vm.inputsFunctions = vm.getFunctions();
        };

        vm.addDynamicAttribute = function () {
            vm.scheme.entity_fields.push({
                expression: '',
                name: ''
            })
        };

        vm.removeCsvField = function (item, $index) {
            vm.scheme.csv_fields.splice($index, 1);

            vm.inputsFunctions = vm.getFunctions();
        };

        vm.removeDynamicAttribute = function (item, $index) {
            vm.scheme.entity_fields.splice($index, 1);
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
                    mapItem: {complexExpressionEntity: item.entity}
                }
            })

        };

    };

}());