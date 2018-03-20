/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var entitySchemeService = require('../../services/import/entitySchemeService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {scheme: false, entitySchemeAttributes: false};

        vm.mapFields = [
            {
                value: '',
                transaction_type: null,
                fields: []
            }
        ];

        vm.providerFields = [
            {
                name: '',
                column: ''
            }
        ];

        entitySchemeService.getSchemeFields(schemeId).then(function (data) {

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

            vm.readyStatus.scheme = true;
            $scope.$apply();
        });

        entitySchemeService.getSchemeAttributes(schemeId).then(function (data) {
            vm.entitySchemeAttributes = data;
            vm.readyStatus.entitySchemeAttributes = true;
            $scope.$apply();
        });

        vm.openInputs = function (item, $event) {
            $mdDialog.show({
                controller: 'TransactionMappingInputMappingDialogController as vm',
                templateUrl: 'views/dialogs/transaction-mapping-input-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        item: item
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    item.fields = res.data.item.fields;
                }
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme && vm.readyStatus.entitySchemeAttributes;
        };


        vm.addProviderField = function () {
            vm.providerFields.push({
                name: '',
                column: vm.providerFields.length
            })
        };

        vm.addMapField = function () {
            vm.mapFields.push({
                value: '',
                transaction_type: null,
                fields: []
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

        vm.agree = function ($event) {

            vm.scheme.inputs = vm.providerFields;
            vm.scheme.rules = vm.mapFields;

            transactionSchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.hide({res: 'agree'});
                }
                if (data.status == 400) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: data.response
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }
            });
        };

        vm.openMapping = function ($event, item) {
            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    mapItem: item
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
                        item.value = res.data.item.expression;
                    }
                    $scope.$apply();
                }
            });
        };

    };

}());