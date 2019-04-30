/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('InstrumentDownloadSchemeEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {scheme: false, transactionTypes: false};

        vm.inputsGroup = {
            "name": "<b>Inputs</b>",
            "key": 'input'
        };

        vm.inputsFunctions = [];

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
                column: '',
                expression: ''
            }
        ];


        transactionSchemeService.getByKey(schemeId).then(function (data) {
            vm.scheme = data;

            if (vm.scheme.inputs.length) {

                vm.providerFields = [];

                vm.scheme.inputs.forEach(function (input) {
                    vm.providerFields.push(input);
                })

                vm.providerFields = vm.providerFields.sort(function (a, b) {
                    if (a.column > b.column) {
                        return 1;
                    }
                    if (a.column < b.column) {
                        return -1;
                    }

                    return 0;
                });

            }

            if (vm.scheme.rules.length) {
                vm.mapFields = [];

                vm.scheme.rules.forEach(function (rule) {
                    vm.mapFields.push(rule);
                })

            }

            vm.readyStatus.scheme = true;
            $scope.$apply();
        });

        transactionTypeService.getList().then(function (data) {
            vm.transactionTypes = data.results;
            vm.readyStatus.transactionTypes = true;
            $scope.$apply();
        });

        vm.openInputs = function (item, $event) {
            $mdDialog.show({
                controller: 'TransactionImportSchemeInputsDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import-scheme-inputs-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        fields: vm.providerFields,
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
            return vm.readyStatus.scheme && vm.readyStatus.transactionTypes;
        };


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

        vm.setProviderFieldExpression = function (field) {
            console.log("transaction import on blur", field);
            if (!field.expression || field.expression === '') {
                field.expression = field.name;
                console.log("transaction import", field);
            }
        };

        /*vm.openTTypeSelectorExpressionBuilder = function($event) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: field.expression},
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    field.expression = res.data.item.expression;

                }

            });

        };*/

        vm.openProviderFieldExpressionBuilder = function (field, $event) {

            $mdDialog.show({
                controller: 'ExpressionEditorDialogController as vm',
                templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                targetEvent: $event,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    item: {expression: field.expression},
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {

                    field.expression = res.data.item.expression;

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
            console.log("import transaction scheme", vm.scheme);
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

                transactionSchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {

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
                        multiple: true,
                        skipHide: true
                    })
                })
            }
        };

        vm.openMapping = function ($event, item) {
            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                multiple: true,
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

    };

}());