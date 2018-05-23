/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var scheduleService = require('../../services/import/scheduleService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('InstrumentMappingDialogController', 'initialized');

        var vm = this;

        vm.dataProviders = [];

        vm.readyStatus = {dataProviders: false, scheme: true, transactionTypes: false};

        transactionTypeService.getList().then(function (data) {
            vm.transactionTypes = data.results;
            vm.readyStatus.transactionTypes = true;
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
                multiple: true,
                skipHide: true,
                locals: {
                    data: {
                        item: item
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);

                    item = res.data.item;
                }
            });
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.scheme && vm.readyStatus.transactionTypes;
        };

        vm.scheme = {};

        var createEmptyScheme = function () {
            vm.scheme.inputs = [];
            vm.scheme.rules = [];
            vm.scheme.rule_expr = 'a + b';
            vm.scheme.scheme_name = '';
        };

        createEmptyScheme();

        vm.openInputs = function (item, $event) {
            $mdDialog.show({
                controller: 'TransactionMappingInputMappingDialogController as vm',
                templateUrl: 'views/dialogs/transaction-mapping-input-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
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
            console.log('$index', $index);

            vm.providerFields.splice($index, 1);

            //$scope.$apply();
            console.log('vm.providerFields', vm.providerFields);
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

            transactionSchemeService.create(vm.scheme).then(function (data) {
                console.log('DATA', data);
                if (data.status == 200 || data.status == 201) {
                    $mdDialog.hide({status: 'agree'});
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
                        multiple: true,
                        skipHide: true
                    })
                }
            });

        };

        vm.openMapping = function ($event, item) {

            console.log('ITEEM', item);

            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
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
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    item: {
                        expression: item.value
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