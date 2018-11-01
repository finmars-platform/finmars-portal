/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var transactionTypeService = require('../../services/transactionTypeService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('TransactionMappingInputMappingDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {transactionType: false};

        vm.data = data;
        vm.item = JSON.parse(JSON.stringify(vm.data.item));

        vm.inputs = [];

        transactionTypeService.getByKey(vm.item.transaction_type).then(function (data) {
            vm.transactionType = data;

            vm.transactionType.inputs.forEach(function (input) {

                var inputObject = Object.assign({}, input);

                if (!inputObject.hasOwnProperty('mapping')) {
                    inputObject.mapping = {expression: ''};
                }

                vm.inputs.push(inputObject);

            });


            vm.item.fields.forEach(function (field) {

                vm.inputs.forEach(function (input) {

                    if (input.id === field.transaction_type_input) {

                        input.mapping.expression = field.value_expr;

                    }

                })

            });


            vm.readyStatus.transactionType = true;
            $scope.$apply();
        });

        vm.bindType = function (item) {
            switch (item.value_type) {
                case 100:
                    return 'Relation';
                    break;
                case 10:
                    return 'String';
                case 20:
                    return 'Number';
                case 30:
                    return 'Classifier';
                case 40:
                    return 'Date';
                default:
                    return 'N/A'
            }
        };

        vm.openMapping = function (item, $event) {

            if (item.value_type === 100) {

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
                        mapItem: {complexExpressionEntity: metaContentTypesService.findEntityByContentType(item.content_type, 'ui')}
                    }
                }).then(function (res) {
                    if (res.status === 'agree') {
                        console.log("res", res.data);
                    }
                });
            } else {

                $mdDialog.show({
                    controller: 'ExpressionEditorDialogController as vm',
                    templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        item: {expression: item.mapping.expression}
                    }
                }).then(function (res) {
                    if (res.status === 'agree') {
                        console.log("res", res.data);
                        item.mapping.expression = res.data.item.expression;
                    }
                    console.log('item', item);
                });
            }
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.transactionType
        };

        vm.createFieldsIfNotExist = function () {

            vm.inputs.forEach(function (input) {

                var exist = false;

                vm.item.fields.forEach(function (field) {

                    if (input.id === field.transaction_type_input) {
                        exist = true;
                    }

                });

                if (!exist) {

                    if (input.mapping && input.mapping.expression) {

                        vm.item.fields.push({
                            transaction_type_input: input.id,
                            value_expr: input.mapping.expression
                        })

                    }

                }


            });

        };

        vm.updateFields = function () {

            vm.inputs.forEach(function (input) {

                vm.item.fields.forEach(function (field) {

                    if (input.id === field.transaction_type_input) {

                        if (input.hasOwnProperty('mapping')) {
                            field.value_expr = input.mapping.expression;
                        }
                    }


                });

            });

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            vm.createFieldsIfNotExist();

            vm.updateFields();


            $mdDialog.hide(
                {
                    status: 'agree',
                    data: {
                        item: vm.item
                    }
                }
            );
        };
    }

}());