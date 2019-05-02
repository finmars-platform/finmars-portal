/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

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
                controller: 'TransactionImportSchemeInputsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-inputs-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
                skipHide: true,
                locals: {
                    data: {
                        fields: vm.providerFields,
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
                controller: 'TransactionImportSchemeInputsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-inputs-dialog-view.html',
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
            var fieldsLength = vm.providerFields.length;
            var lastFieldNumber;
            var nextFieldNumber;
            if (fieldsLength === 0) {
                nextFieldNumber = 1;
            } else {
                lastFieldNumber = parseInt(vm.providerFields[fieldsLength - 1].column);
                if (isNaN(lastFieldNumber) || lastFieldNumber === null) {
                    lastFieldNumber = 0
                }
                nextFieldNumber = lastFieldNumber + 1;
            }

            vm.providerFields.push({
                name: '',
                column: nextFieldNumber
            })
        };

        vm.addMapField = function () {
            vm.mapFields.push({
                value: '',
                transaction_type: null,
                fields: []
            })
        };

        vm.setProviderFieldExpression = function (item) {

            if (!item.name_expr || item.name_expr === '') {
                item.name_expr = item.name;
                console.log("transaction import", item);
            }

        };


        vm.openProviderFieldExpressionBuilder = function (item, $event) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: item.name_expr},
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    item.name_expr = res.data.item.expression;

                }

            });

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

            transactionSchemeService.create(vm.scheme).then(function (data) {

                $mdDialog.hide({status: 'agree'});

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
                    multiple: true,
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

    };

}());