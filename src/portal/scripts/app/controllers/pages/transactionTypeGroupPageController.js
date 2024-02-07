/**
 * Created by szhitenev on 02.06.2023.
 */
(function () {

    'use strict';

    var transactionTypeGroupService = require('../../services/transaction/transactionTypeGroupService').default;

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {content: false};
        vm.items = [];

        vm.getList = function () {

            transactionTypeGroupService.getList().then(function (data) {

                vm.items = data.results;

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.editItem = function ($event, item) {

            $mdDialog.show({
                controller: 'TransactionTypeGroupDialogController as vm',
                templateUrl: 'views/dialogs/transaction-type-group-dialog-view.html',
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

        vm.addItem = function ($event) {

            $mdDialog.show({
                controller: 'TransactionTypeGroupDialogController as vm',
                templateUrl: 'views/dialogs/transaction-type-group-dialog-view.html',
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

        vm.deleteItem = function ($event, item, $index) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "<p>Are you sure you want to delete Transaction Type group <b>" + item.name + '</b>?</p>'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    transactionTypeGroupService.deleteByKey(item.id).then(function (value) {
                        vm.getList();
                    })

                }

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());