/**
 * Created by szhitenev on 17.12.2019.
 */
(function () {

    'use strict';

    var reconciliationBankFieldService = require('../../../services/reconciliation/reconciliationBankFieldService');
    var reconciliationNewBankFieldService = require('../../../services/reconciliation/reconciliationNewBankFieldService');
    var reconciliationComplexTransactionFieldService = require('../../../services/reconciliation/reconciliationComplexTransactionFieldService');
    var reconMatchHelper = require('../../../helpers/reconMatchHelper');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = data.item;
        vm.field = data.field;

        vm.linkedComplexTransactionField;
        vm.hasLinkedComplexTransaction = false;

        vm.lockSelect = true;

        console.log("Bank File line", vm.item);
        console.log("Bank File field", vm.field);

        vm.updateField = function () {

            return new Promise(function (resolve, reject) {

                if (vm.field.status && vm.field.status === undefined) {

                    var newField = Object.assign({}, vm.field);

                    delete newField.id;
                    delete newField.linked_complex_transaction_field;
                    delete newField.status;

                    reconciliationNewBankFieldService.create(newField).then(function (data) {

                        reconciliationBankFieldService.deleteByKey(vm.field.id).then(function (value) {

                            resolve(data)

                        })

                    })


                } else {


                    if (vm.field.type === 'new') {

                        reconciliationBankFieldService.create(vm.field).then(function (data) {

                            resolve(data)

                        })

                    } else {
                        reconciliationBankFieldService.update(vm.field.id, vm.field).then(function (data) {

                            resolve(data)

                        })
                    }

                }

            })

        };

        vm.agree = function () {

            vm.updateField().then(function (fieldData) {

                $mdDialog.hide({
                    status: 'agree', data: {
                        field: fieldData
                    }
                });

            })
        };

        vm.getLinkedComplexTransactionField = function () {

            reconciliationComplexTransactionFieldService.getByKey(vm.field.linked_complex_transaction_field).then(function (data) {

                vm.linkedComplexTransactionField = data;
                vm.hasLinkedComplexTransaction = true;

                $scope.$apply();

            })

        };

        vm.dismiss = function () {


            vm.lockSelect = false;
            vm.linkedComplexTransactionField = null;
            vm.field.status = undefined;


        };

        vm.dismissAndUnmatch = function () {

            vm.field.linked_complex_transaction_field = null;

            vm.linkedComplexTransactionField.status = reconMatchHelper.getComplexTransactionFieldStatusIdByName('unmatched');

            reconciliationComplexTransactionFieldService.update(vm.linkedComplexTransactionField.id, vm.linkedComplexTransactionField).then(function (data) {

                vm.lockSelect = false;
                vm.linkedComplexTransactionField = null;
                vm.field.status = undefined;

                $scope.$apply();

            })

        };

        vm.clear = function () {

            var newField = Object.assign({}, vm.field);

            delete newField.id;
            delete newField.linked_complex_transaction_field;
            delete newField.status;

            reconciliationNewBankFieldService.create(newField).then(function (data) {

                reconciliationBankFieldService.deleteByKey(vm.field.id).then(function (value) {

                    vm.field = data;
                    vm.field.status = undefined;
                    vm.linkedComplexTransactionField = null;
                    vm.lockSelect = false;

                    $scope.$apply();

                })

            })


        };

        vm.init = function () {


            console.log("vm", vm);

            if (vm.field.linked_complex_transaction_field) {
                vm.getLinkedComplexTransactionField();
            }

        };

        vm.init();
    }

}());