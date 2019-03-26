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
        var selectedItems = data.selectedItems;

        vm.title = data.title;
        vm.nameProperty = data.nameProperty;
        vm.readyStatus = false;

        vm.selectedItems = [];
        getDataMethod().then(function (data) {

            vm.items = data.results;

            if (vm.items &&
                vm.items.length > 0 &&
                selectedItems &&
                selectedItems.length > 0) {

                selectedItems.forEach(function (selItem) {

                    vm.items.map(function (item, itemIndex) {

                        if (item.id === selItem) {

                            vm.selectedItems.push(item);
                            vm.items.splice(itemIndex, 1);
                        }

                    });
                })
            }

            vm.readyStatus = true;

        });

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