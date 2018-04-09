/**
 * Created by szhitenev on 21.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaContentTypeService = require('../../services/metaContentTypesService');
    var entitySchemesService = require('../../services/import/entitySchemesService');
    var entitySchemesFieldsService = require('../../services/import/entitySchemesFieldsService');
    var entitySchemesAttributesService = require('../../services/import/entitySchemesAttributesService');

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
                vm.schemeDataType = entity;
                vm.updateMatchingAttributes(vm.schemeDataType.name);
            }
            vm.readyStatus.dataTypes = true;
            console.log('selected data is', vm.schemeDataType);
        });

        vm.updateMatchingAttributes = function (dataTypeName) {
            console.log('new entity is', dataTypeName);
            vm.mapFields = [];
            entitySchemesAttributesService.getMatchingAttributesList(dataTypeName).then(function (data) {
                vm.matchingAttrs = data;
                var relatedAttrs = entitySchemesAttributesService.getRelatedAttributesList();
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

        vm.create = function () {

            // vm.scheme.schema_name = vm.schemeName;
            // vm.scheme.schema_model = vm.schemeDataType.id;
            // vm.scheme.field_list = vm.providerFields;
            // vm.scheme.matching_list = vm.mapFields;
            vm.scheme.name = vm.schemeName;
            vm.scheme.model = vm.schemeDataType.id;

            entitySchemesService.create(vm.scheme).then(function (schemeRes) {
                var schemeData = {};
                schemeData.id = schemeRes.response.id;
                console.log('data mapping updated', schemeRes, schemeData.id);
                // if (schemeId) {
                //     vm.mapFields.forEach(function (mapField) {
                //         mapField.schema = schemeId;
                //     });
                //     entitySchemesAttributesService.create(vm.mapFields, schemeId).then(function (attrsRes) {
                //         if (vm.providerFields && vm.providerFields.length > 0) {
                //             vm.providerFields.forEach(function (provField) {
                //                 provField.schema = schemeId;
                //             });
                //             entitySchemesFieldsService.create(vm.providerFields).then(function (fieldsRes) {
                //                 $mdDialog.hide({res: 'agree'});
                //             });
                //         }
                //         else {
                //             $mdDialog.hide({res: 'agree'});
                //         }
                //     });
                // }
                if (schemeData.id) {

                    schemeData.schema_name = schemeRes.response.name;
                    schemeData.schema_model = schemeRes.response.model;

                    vm.mapFields.forEach(function (mapField) {
                        mapField.schema = schemeData.id;
                    });
                    if (vm.providerFields && vm.providerFields.length > 0) {
                        vm.providerFields.forEach(function (provField) {
                            provField.schema = schemeData.id;
                        });
                    }

                    schemeData.field_list = vm.providerFields;
                    schemeData.matching_list = vm.mapFields;
                    console.log('schemeData to update', schemeData);

                    entitySchemesService.update(schemeData).then(function (schemeRes) {
                        $mdDialog.hide({res: 'agree'});
                    });
                }
                // if () {
                //
                // }
                // if (data.status == 200 || data.status == 201) {
                //     $mdDialog.hide({res: 'agree'});
                // }
                // $mdDialog.hide({res: 'agree'});

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