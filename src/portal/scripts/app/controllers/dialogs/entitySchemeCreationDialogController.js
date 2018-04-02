/**
 * Created by szhitenev on 21.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var metaContentTypeService = require('../../services/metaContentTypesService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var entitySchemeAttributesService = require('../../services/import/entitySchemeAttributesService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog, entity) {

        logService.controller('EntitySchemeCreationDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.schemeName = '';
        vm.schemeDataType = {};
        vm.readyStatus = {dataTypes: false};

        console.log("chosen entity for scheme is", entity);

        vm.mapFields = [];

        vm.providerFields = [
            {
                source: 'source',
                num: 1
            }
        ];

        console.log('scheme entity is', entity);

        metaContentTypeService.findEntityByAPIContentType().then(function(data) {
            vm.dataTypes = data;
            console.log('data types is', vm.dataTypes);
            $scope.$apply();
            if (entity.name) {
                vm.schemeDataType.name = entity.name;
                vm.updateMatchingAttributes(vm.schemeDataType.name);
            }
            vm.readyStatus.dataTypes = true;
            console.log('selected data is', vm.schemeDataType);
        });

        vm.updateMatchingAttributes = function (dataTypeName) {
            console.log('new entity is', dataTypeName);
            vm.mapFields = [];
            entitySchemeAttributesService.getMatchingAttributesList(dataTypeName).then(function (data) {
                vm.matchingAttrs = data;
                var relatedAttrs = entitySchemeAttributesService.getRelatedAttributesList();
                vm.mapFields = vm.matchingAttrs;

                vm.mapFields.forEach(function(mapField) {
                    if (mapField.value_type == "mc_field") {
                        for (var i = 0; i < relatedAttrs.length; i++) {
                            if (mapField.name == relatedAttrs[i].attributeName) {
                                mapField.related = relatedAttrs[i].name;
                                break;
                            }
                        }
                    }
                });

                $scope.$apply();

            });
        };

        // Delete probably
        // vm.openInputs = function (item, $event) {
        //     $mdDialog.show({
        //         controller: 'TransactionMappingInputMappingDialogController as vm',
        //         templateUrl: 'views/dialogs/transaction-mapping-input-mapping-dialog-view.html',
        //         targetEvent: $event,
        //         preserveScope: true,
        //         multiple: true,
        //         autoWrap: true,
        //         skipHide: true,
        //         locals: {
        //             data: {
        //                 item: item
        //             }
        //         }
        //     }).then(function (res) {
        //         if (res.status === 'agree') {
        //             item.fields = res.data.item.fields;
        //         }
        //     });
        // };

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

        vm.addProviderField = function () {
            if (vm.providerFields.length == 0) {
                vm.providerFields.push({
                    source: 'source',
                    num: 1
                })
            }
            else {
                var lastFieldIndex = vm.providerFields.length - 1,
                    lastFieldNum = vm.providerFields[lastFieldIndex].num;
                vm.providerFields.push({
                    source: 'source',
                    num: lastFieldNum + 1
                })
            }
        };


        vm.removeProviderField = function (item, $index) {
            if (item.id) {
                vm.providerFields.splice($index, 1);
                schemesFieldsService.deleteField(item.id).then(function (data) {
                    console.log('field deleted');
                });
            }
            else {
                vm.providerFields.splice($index, 1);
            }
        };

        vm.cancel = function () {
            console.log('cancel button pressed');
            $mdDialog.cancel();
        };

        vm.agree = function () {

            vm.scheme.schema_name = vm.schemeName;
            vm.scheme.schema_model = vm.schemeDataType.id;
            vm.scheme.field_list = vm.providerFields;
            vm.scheme.matching_list = vm.mapFields;

            entitySchemeService.updateEntitySchemeMapping(vm.scheme).then(function (updateData) {
                console.log('data mapping updated', updateData);
                // if (data.status == 200 || data.status == 201) {
                //     $mdDialog.hide({res: 'agree'});
                // }
                $mdDialog.hide({res: 'agree'});
            });

        };

        vm.openMapping = function ($event, mapItem) {
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
                    mapItem: mapItem
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                }
            });
        };

    };

}());