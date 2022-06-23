/**
 * Created by szhitenev on 23.06.2022.
 */
(function () {

    'use strict';

    var expressionProcedureService = require('../../services/procedures/expressionProcedureService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.procedures = [];

        vm.readyStatus = {procedures: false};

        vm.getList = function () {

            expressionProcedureService.getList().then(function (data) {

                vm.procedures = data.results;

                vm.readyStatus.procedures = true;

                $scope.$apply();

            })
        };

        vm.editProcedure = function ($event, item) {

            $mdDialog.show({
                controller: 'ExpressionProcedureEditDialogController as vm',
                templateUrl: 'views/dialogs/procedures/expression-procedure-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: item
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.executeProcedure = function ($event, item) {

            console.log("Execute Procedure", item);

            expressionProcedureService.runProcedure(item.id, item).then(function (data) {

                toastNotificationService.success('Success. Procedure is being processed');


            })

        };

        vm.deleteProcedure = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete Expression Procedure <b>" + item.name + '</b>?'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    expressionProcedureService.deleteByKey(item.id).then(function (data) {
                        vm.getList();
                    })

                }

            })

        };

        vm.addProcedure = function ($event) {

            $mdDialog.show({
                controller: 'ExpressionProcedureAddDialogController as vm',
                templateUrl: 'views/dialogs/procedures/expression-procedure-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());