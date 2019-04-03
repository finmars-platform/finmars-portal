/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var metaContentTypesService = require('../../services/metaContentTypesService');

    var modelService = require('../../services/modelService');


    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {scheme: false, entitySchemeAttributes: false};

        vm.dynamicAttributes = [];

        vm.inputsGroup = {
            "name": "<b>Inputs</b>",
            "key": 'input'
        };

        vm.inputsFunctions = [];

        vm.getFunctions = function () {

            return vm.scheme.csv_fields.map(function (input) {

                return {
                    "name": "Add input " + input.value,
                    "description": "Imported Parameter: " + input.value + " (column #" + input.column + ") ",
                    "groups": "input",
                    "func": input.value
                }

            })

        };


        entitySchemeService.getByKey(schemeId).then(function (data) {

            vm.scheme = data;

            vm.readyStatus.scheme = true;

            if (vm.scheme.content_type !== 'instruments.pricehistory' && vm.scheme.content_type !== 'currencyhistorys.currencyhistory') {

                vm.getAttrs();
            }

            vm.scheme.csv_fields = vm.scheme.csv_fields.sort(function (a, b) {
                if (a.column > b.column) {
                    return 1;
                }
                if (a.column < b.column) {
                    return -1;
                }

                return 0;
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


            vm.inputsFunctions = vm.getFunctions();

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

        vm.getContentTypeName = function (valueType) {

            var valueTypeName = "";
            switch (valueType) {
                case 10:
                    valueTypeName = "Text";
                    break;
                case 20:
                    valueTypeName = "Number";
                    break;
                case 30:
                case "field":
                case "mc_field":
                    valueTypeName = "Classificator";
                    break;
                case 40:
                    valueTypeName = "Date";
                    break;
            }

            return valueTypeName;
        };

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
            });

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