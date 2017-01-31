/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var helpService = require('../../services/helpService');

    module.exports = function ($scope, $mdDialog, item) {

        logService.controller('ExpressionEditorDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {expression: false};

        vm.item = item;

        helpService.getFunctionsHelp().then(function (data) {
            vm.expressions = data;

            vm.readyStatus.expression = true;

            vm.selectedHelpItem = vm.expressions[0];
            $scope.$apply();
        });

        vm.selectHelpItem = function (item) {
            vm.expressions.forEach(function (expr) {
                expr.isSelected = false;
            });

            item.isSelected = true;

            vm.selectedHelpItem = item;
        };

        vm.appendFunction = function (item) {

            console.log(this);
            var val = $('#editorExpressionInput')[0].value;
            var cursorPosition = val.slice(0, ($('#editorExpressionInput')[0].selectionStart + '')).length;

            if (cursorPosition == 0) {
                vm.item.expression = vm.item.expression + item.func;
            } else {
                vm.item.expression = vm.item.expression.slice(0, cursorPosition) + item.func + vm.item.expression.slice(cursorPosition);

            }
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item}});
        };
    }

}());