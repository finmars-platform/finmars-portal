/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        logService.controller('TwoFieldsOptionsDialogController', 'initialized');

        var getDataMethod = data.getDataMethod;
        var selectedItems = data.model;

        if (!selectedItems) {
            selectedItems = [];
        }

        vm.title = data.title;
        vm.nameProperty = data.nameProperty;
        vm.readyStatus = false;

        vm.selectedItems = [];

        var separateUnselectedItems = function (items, selectedItems) {

            selectedItems.map(function (selItem) {

                items.map(function (item, itemIndex) {

                    if (item.id === selItem) {

                        vm.selectedItems.push(item);
                        items.splice(itemIndex, 1);
                    }

                });
            })

        };

        if (getDataMethod) {

            getDataMethod().then(function (resData) {

                vm.items = resData.results;

                if (vm.items && selectedItems) {

                    separateUnselectedItems(vm.items, selectedItems);

                }

                vm.readyStatus = true;
                $scope.$apply();

            });

        } else {

            vm.items = data.items;

            if (vm.items && selectedItems) {

                separateUnselectedItems(vm.items, selectedItems);

            }

            vm.readyStatus = true;

        }



        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            vm.selectedItemsId = [];

            vm.selectedItems.map(function (selItem) {
               vm.selectedItemsId.push(selItem.id);
            });

            $mdDialog.hide({status: "agree", selectedItems: vm.selectedItemsId});

        };
    }

}());