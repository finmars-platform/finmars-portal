/**
 * Created by szhitenev on 19.03.2018.
 */

/**
 * Simple Entity Import Edit Dialog Controller.
 * @module SimpleEntityImportEitDialogController
 */

(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var attributeTypeService = require('../../../services/attributeTypeService');

    var metaContentTypesService = require('../../../services/metaContentTypesService');

    var modelService = require('../../../services/modelService');


    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        /** JSDOC ignores vm methods, only works for var variable. */
        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {scheme: false, entitySchemeAttributes: false};

        vm.dynamicAttributes = [];

        vm.inputsGroup = {
            "name": "<b>Inputs</b>",
            "key": 'input'
        };

        vm.dynamicAttrPicked = true;

        var pickedDynamicAttrs = [];

        vm.inputsFunctions = [];

        /**
         * Get list of expressions for Expression Builder.
         * @return {Object[]} Array of Expressions.
         * @memberof module:SimpleEntityImportEitDialogController
         */
        vm.getFunctions = function () {

            return vm.scheme.csv_fields.map(function (input) {

                return {
                    "name": "Add input " + input.name,
                    "description": "Imported Parameter: " + input.name + " (column #" + input.column + ") ",
                    "groups": "input",
                    "func": input.name
                }

            })

        };

        var findPickedDynamicAttrs = function () {
            if (vm.dynamicAttrPicked) {
                vm.scheme.entity_fields.map(function (field) {
                    if (field.hasOwnProperty('dynamic_attribute_id') && field.dynamic_attribute_id) {

                        if (pickedDynamicAttrs.length > 0) {
                            var dynamicAttrMarked = false;
                            pickedDynamicAttrs.map(function (dynamicAttr) {

                                if (dynamicAttr === field.dynamic_attribute_id) {
                                    dynamicAttrMarked = true;
                                }

                            });

                            if (!dynamicAttrMarked) {
                                pickedDynamicAttrs.push(field.dynamic_attribute_id);
                            }

                        } else {
                            pickedDynamicAttrs.push(field.dynamic_attribute_id);
                        }

                    }
                });
            }

            vm.dynamicAttrPicked = false;
        };

        csvImportSchemeService.getByKey(schemeId).then(function (data) {

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

            vm.scheme.entity_fields.map(function (entityField, entityFieldIndex) {

                if (entityField.system_property_key) {

                    modelAttributes.forEach(function (attribute) {

                        if (attribute.key === entityField.system_property_key) {

                            if (attribute.value_type === 'mc_field') { // remove multiple relation attributes

                                vm.scheme.entity_fields.splice(entityFieldIndex, 1)

                            } else {

                                console.log('entityField', entityField);
                                console.log('attribute', attribute);

                                entityField.value_type = attribute.value_type;
                                entityField.entity = attribute.value_entity;
                                entityField.content_type = attribute.content_type;
                                entityField.code = attribute.code;
                            }

                        }

                    })

                }

            });

            vm.inputsFunctions = vm.getFunctions();

            findPickedDynamicAttrs();

            $scope.$apply();

        });


        /**
         * Get list of dynamic attributes .
         *
         * @memberof module:SimpleEntityImportEitDialogController
         */
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

        vm.onDynamicAttributePick = function () {
            findPickedDynamicAttrs();
            vm.extendEntityFields();
        };

        vm.checkForUsedDynamicAttr = function (attrId) {
            if (pickedDynamicAttrs.indexOf(attrId) !== -1) {
                return true;
            }

            return false;
        };

        vm.addCsvField = function () {
            var fieldsLength = vm.scheme.csv_fields.length;
            var lastFieldNumber;
            var nextFieldNumber;
            if (fieldsLength === 0) {
                nextFieldNumber = 1;
            } else {
                lastFieldNumber = parseInt(vm.scheme.csv_fields[fieldsLength - 1].column);
                if (isNaN(lastFieldNumber) || lastFieldNumber === null) {
                    lastFieldNumber = 0
                }
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

            var i;
            for (i = 0; i < pickedDynamicAttrs.length; i++) {
                if (vm.scheme.entity_fields[$index].dynamic_attribute_id === pickedDynamicAttrs[i]) {
                    pickedDynamicAttrs.splice(i, 1);
                    break;
                }
            }

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

            var warningMessage = '';

            var importedColumnsNumberZero = false;
            var importedColumnsNumberEmpty = false;

            vm.providerFields.map(function (field) {

                if (field.column === 0 && !importedColumnsNumberZero) {
                    warningMessage = "should not have value 0 (column's count starts from 1)";
                    importedColumnsNumberZero = true;
                }

                if (field.column === null && !importedColumnsNumberEmpty) {

                    if (importedColumnsNumberZero) {
                        warningMessage = warningMessage + ', should not be empty'
                    } else {
                        warningMessage = 'should not be empty'
                    }

                    importedColumnsNumberEmpty = true;
                }

            });

            if (importedColumnsNumberZero || importedColumnsNumberEmpty) {
                warningMessage = 'Imported Columns Field #: ' + warningMessage + '.';

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Incorrect Imported Columns field #',
                            description: warningMessage
                        }
                    },
                    multiple: true
                })

            } else {

                csvImportSchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {

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
            }
        };

        vm.openMapping = function ($event, item) {

            console.log('item', item);

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