/**
 * Created by szhitenev on 03.08.2023.
 */
(function () {

    'use strict';

    var portfolioBundleService = require('../../services/portfolioBundleService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.readyStatus = {content: false};

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (vm.itemId) {

                portfolioBundleService.update(vm.item.id, vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });


            } else {

                portfolioBundleService.create(vm.item).then(function (data) {

                    vm.item = data;

                    $mdDialog.hide({status: 'agree', data: {item: vm.item}});

                });

            }


        };

        vm.getItem = function () {

            portfolioBundleService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.editAsJson = function (ev) {

            $mdDialog.show({
                controller: 'EntityAsJsonEditorDialogController as vm',
                templateUrl: 'views/dialogs/entity-as-json-editor-dialog-view.html',
                targetEvent: ev,
                multiple: true,
                locals: {
                    data: {
                        item: vm.item,
                        entityType: 'portfolio-bundle'
                    }
                }
            }).then(function (res) {

                if (res.status === "agree") {

                    vm.getItem();

                }
            })

        }

        vm.init = function () {

            if (data.item && data.item.id) {

                vm.itemId = data.item.id

                vm.getItem();

            } else {
                vm.readyStatus.content = true;
            }


        };

        vm.init();

    }

}());