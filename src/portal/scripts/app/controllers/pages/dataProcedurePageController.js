/**
 * Created by szhitenev on 25.09.2020.
 */
(function () {

    'use strict';

    var dataProcedureService = require('../../services/procedures/dataProcedureService').default;
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.procedures = [];

        vm.readyStatus = {procedures: false};

        vm.getList = function () {

            vm.readyStatus.procedures = false;

            dataProcedureService.getList().then(function (data) {

                vm.procedures = data.results;

                vm.readyStatus.procedures = true;

                $scope.$apply();

            })
        };

        vm.editProcedure = function ($event, item) {

            $mdDialog.show({
                controller: 'DataProcedureEditDialogController as vm',
                templateUrl: 'views/dialogs/procedures/data-procedure-edit-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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

            dataProcedureService.runProcedure(item.id, item).then(function (data) {

                toastNotificationService.success('Success. Procedure is being processed');


            })

        };

        vm.deleteProcedure = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete Pricing Procedure <b>" + item.name + '</b>?'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    dataProcedureService.deleteByKey(item.id).then(function (data) {
                        vm.getList();
                    })

                }

            })

        };

        vm.addProcedure = function ($event) {

            $mdDialog.show({
                controller: 'DataProcedureAddDialogController as vm',
                templateUrl: 'views/dialogs/procedures/data-procedure-add-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
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