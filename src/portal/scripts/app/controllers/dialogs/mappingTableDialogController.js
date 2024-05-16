/**
 * Created by szhitenev on 30.07.2023.
 */
(function () {

    'use strict';

    var mappingTableService = require('../../services/mappingTableService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;


        vm.item = {
            items: []
        };


        vm.readyStatus = {policy: false};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.item.id) {

                mappingTableService.update(vm.item.id, vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            } else {

                mappingTableService.create(vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            }

        };

        vm.getItem = function () {

            mappingTableService.getByKey(vm.itemId).then(function (data) {

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
                        entityType: 'mapping-table'
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