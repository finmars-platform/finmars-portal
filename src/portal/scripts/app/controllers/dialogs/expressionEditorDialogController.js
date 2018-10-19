/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var helpService = require('../../services/helpService');

    module.exports = function ($scope, $mdDialog, item) {

        var vm = this;

        vm.readyStatus = {expressions: false, groups: false};

        vm.expressionsHistory = [];

        vm.item = item;

        helpService.getFunctionsItems().then(function (data) {

            vm.expressions = data;

            vm.readyStatus.expressions = true;

            vm.selectedHelpItem = vm.expressions[0];
            $scope.$apply();
        });

        helpService.getFunctionsGroups().then(function (data) {

            vm.groups = data;

            vm.readyStatus.groups = true;

            vm.selectedHelpGroup = vm.groups[0];
            $scope.$apply();
        });

        vm.selectHelpItem = function (item) {

            vm.expressions.forEach(function (expr) {
                expr.isSelected = false;
            });

            item.isSelected = true;

            vm.selectedHelpItem = item;
        };

        vm.selectHelpGroup = function (item) {

            vm.groups.forEach(function (expr) {
                expr.isSelected = false;
            });

            item.isSelected = true;

            vm.selectedHelpGroup = item;
        };

        vm.undo = function () {

            var result = vm.expressionsHistory.pop();

            if (result !== undefined && result !== null) {
                vm.item.expression = result
            }

        };

        vm.appendFunction = function (item) {


            vm.expressionsHistory.push(vm.item.expression);

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

        vm.openHelp = function ($event) {
            $mdDialog.show({
                controller: 'HelpDialogController as vm',
                templateUrl: 'views/dialogs/help-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {}
                },
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            })
        }
    }

}());