/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var schemesFieldsService = require('../../services/import/entitySchemesFieldsService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {providerFields: false, mapFields: false, schemeName: false};

        vm.mapFields = [
            {
                module_field: '',
                expression: '',
                schema: schemeId,
                related: false
            }
        ];

        vm.providerFields = [
            {
                source: 'source',
                num: '',
                schema: schemeId
            }
        ];

        schemesFieldsService.getSchemeFields(schemeId).then(function (data) {

            vm.providerFields = data;
            // vm.scheme = data;
            //
            // if (vm.scheme.inputs.length) {
            //
            //     vm.providerFields = [];
            //
            //     vm.scheme.inputs.forEach(function (input) {
            //         vm.providerFields.push(input);
            //     })
            //
            // }
            //
            // if (vm.scheme.rules.length) {
            //     vm.mapFields = [];
            //
            //     vm.scheme.rules.forEach(function (rule) {
            //         vm.mapFields.push(rule);
            //     })
            // }

            vm.readyStatus.providerFields = true;
            $scope.$apply();
        });

        entitySchemeService.getSchemeAttributes(schemeId).then(function (data) {
            vm.mapFields = data;

            vm.readyStatus.mapFields = true;
            $scope.$apply();
        });

        entitySchemeService.getByKey(schemeId).then(function (data) {
            vm.scheme.schema_name = data.name;
            vm.scheme.schema_model = data.model;
            vm.readyStatus.schemeName = true;
            $scope.$apply();
        });
        // For delete probably
        // vm.openInputs = function (item, $event) {
        //     $mdDialog.show({
        //         controller: 'TransactionMappingInputMappingDialogController as vm',
        //         templateUrl: 'views/dialogs/transaction-mapping-input-mapping-dialog-view.html',
        //         parent: angular.element(document.body),
        //         targetEvent: $event,
        //         preserveScope: true,
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

        vm.checkReadyStatus = function () {
            return vm.readyStatus.providerFields && vm.readyStatus.mapFields && vm.readyStatus.schemeName;
        };

        vm.addProviderField = function () {
            if (vm.providerFields.length == 0) {
                vm.providerFields.push({
                    source: 'source',
                    num: 1,
                    schema: schemeId
                })
            }
            else {
                var lastFieldIndex = vm.providerFields.length - 1,
                    lastFieldNum = vm.providerFields[lastFieldIndex].num;
                vm.providerFields.push({
                    source: 'source',
                    num: lastFieldNum + 1,
                    schema: schemeId
                })
            }
        };

        vm.removeProviderField = function ($index, item) {
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
            $mdDialog.cancel();
        };

        vm.update = function () {
            // vm.scheme.inputs = vm.providerFields;
            // vm.scheme.rules = vm.mapFields;
            vm.scheme.field_list = vm.providerFields;
            vm.scheme.matching_list = vm.mapFields;

            entitySchemeService.updateEntitySchemeMapping(vm.scheme).then(function (updateData) {
                console.log('data mapping updated', updateData);
                // if (data.status == 200 || data.status == 201) {
                //     $mdDialog.hide({res: 'agree'});
                // }
                $mdDialog.hide({res: 'agree'});
            });

            // transactionSchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {
            //     console.log('DATA', data);
            //     if (data.status == 200 || data.status == 201) {
            //         $mdDialog.hide({res: 'agree'});
            //     }
            //     if (data.status == 400) {
            //         $mdDialog.show({
            //             controller: 'ValidationDialogController as vm',
            //             templateUrl: 'views/dialogs/validation-dialog-view.html',
            //             targetEvent: $event,
            //             locals: {
            //                 validationData: data.response
            //             },
            //             preserveScope: true,
            //             autoWrap: true,
            //             skipHide: true
            //         })
            //     }
            // });

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