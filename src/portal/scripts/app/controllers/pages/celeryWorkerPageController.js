/**
 * Created by szhitenev on 06.09.2023.
 */
(function () {

    'use strict';

    var celeryWorkerService = require('../../services/celeryWorkerService')

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            content: false
        }

        vm.getList = function () {

            vm.readyStatus.content = false;

            celeryWorkerService.getList({
                pageSize: 100
            }).then(function (data) {

                vm.items = data.results;

                vm.readyStatus.content = true;

                $scope.$apply();

            });

        }

        vm.editItem = function ($event, item) {

            $mdDialog.show({
                controller: 'CeleryWorkerDialogController as vm',
                templateUrl: 'views/dialogs/celery-worker-dialog-view.html',
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
                controller: 'CeleryWorkerDialogController as vm',
                templateUrl: 'views/dialogs/celery-worker-dialog-view.html',
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

        vm.start = function ($event, item) {

            celeryWorkerService.start(item.id, {}).then(function (value) {
                vm.getList();
            })

        }

        vm.stop = function ($event, item) {

            celeryWorkerService.stop(item.id, {}).then(function (value) {
                vm.getList();
            })

        }

        vm.restart = function ($event, item) {

            celeryWorkerService.restart(item.id, {}).then(function (value) {
                vm.getList();
            })

        }

        vm.getStatus = function ($event, item) {

            celeryWorkerService.getStatus(item.id).then(function (value) {
                vm.getList();
            })

        }

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
                        description: "<p>Are you sure you want to delete Worker <b>" + item.worker_name + '</b>?</p>'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    celeryWorkerService.deleteByKey(item.id).then(function (value) {
                        vm.getList();
                    })

                }

            })

        };

        vm.init = function () {

            vm.getList();

        }

        vm.init();

    }

}());