/**
 * Created by mevstratov on 13.01.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.title = "Available attributes";

        if (data.title) {
            vm.title = data.title
        }

        vm.selectedAttrs = [];
        if (data.selectedAttrs) {
            vm.selectedAttrs = JSON.parse(JSON.stringify(data.selectedAttrs));
        }

        var availableAttrs = data.availableAttrs;

        vm.moveUp = function (attrIndex) {
            var prevItemIndex = attrIndex - 1;

            if (prevItemIndex >= 0) {
                var attrToMove = JSON.parse(JSON.stringify(vm.selectedAttrs[attrIndex]));
                attrToMove.order = attrToMove.order - 1;

                vm.selectedAttrs[attrIndex] = vm.selectedAttrs[prevItemIndex];
                vm.selectedAttrs[attrIndex].order += 1;
                vm.selectedAttrs[prevItemIndex] = attrToMove;
            }

        };

        vm.moveDown = function (attrIndex) {
            var nextItemIndex = attrIndex + 1;

            if (vm.selectedAttrs[nextItemIndex]) {
                var itemToMove = JSON.parse(JSON.stringify(vm.selectedAttrs[attrIndex]));
                itemToMove.order = itemToMove.order + 1;

                vm.selectedAttrs[attrIndex] = vm.selectedAttrs[nextItemIndex];
                vm.selectedAttrs[attrIndex].order -= 1;
                vm.selectedAttrs[nextItemIndex] = itemToMove;
            }
        };

        vm.openAttributeSelector = function ($event) {

            $mdDialog.show({
                controller: "TableAttributeSelectorDialogController as vm",
                templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        availableAttrs: availableAttrs,
                        title: "Select Column"
                    }
                }
            }).then(function (res) {

                if (res && res.status === "agree") {

                    var attributeData = {
                        attribute_data: res.data,
                        layout_name: '',
                        order: vm.selectedAttrs.length
                    };

                    vm.selectedAttrs.push(attributeData);

                }

            })

        };

        var setAttrsOrder = function (attrsList) {
            for (var i = 0; i < attrsList.length; i++) {
                attrsList[i].order = i;
            }
        };

        vm.deleteAttr = function ($index) {
            vm.selectedAttrs.splice($index, 1);

            setAttrsOrder(vm.selectedAttrs);
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'})
        };

        vm.agree = function () {
            var selectedAttrs = null;

            if (vm.selectedAttrs && vm.selectedAttrs.length > 0) {
                selectedAttrs = JSON.parse(angular.toJson(vm.selectedAttrs));
            }

            $mdDialog.hide({status: 'agree', selectedAttrs: selectedAttrs});
        };

    }

}());