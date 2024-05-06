/**
 * Created by szhitenev on 06.09.2023.
 */
(function () {

    'use strict';

    var celeryWorkerService = require('../../services/celeryWorkerService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {
            worker_name: 'worker01',
            worker_type: 'worker',
            memory_limit: '2Gi',
            queue: 'backend-general-queue,backend-background-queue'
        };

        vm.readyStatus = {policy: false};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.item.id) {

                celeryWorkerService.update(vm.item.id, vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            } else {

                celeryWorkerService.create(vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            }

        };

        vm.getItem = function () {

            celeryWorkerService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                vm.readyStatus.policy = true;

                $scope.$apply();

            })

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                parent: document.querySelector(".dialog-containers-wrap"),
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm.item,
                        entityType: 'celery-worker'
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem();

                }
            })

        }

        vm.deleteKeyValueItem = function ($event, item, $index) {
            vm.item.items.splice($index, 1);
        }

        vm.addKeyValueItem = function ($event) {
            vm.item.items.push({})
        }

        vm.init = function () {

            if (data.item) {
                vm.itemId = data.item.id;
                vm.getItem();
            } else {
                vm.itemId = null;
            }


        };

        vm.init();

    }

}());