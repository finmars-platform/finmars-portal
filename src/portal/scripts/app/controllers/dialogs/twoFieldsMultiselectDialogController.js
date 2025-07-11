/**
 * Created by mevstratov on 25.03.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        // var getDataMethod = data.getDataMethod;
        var selectedItems = data.model;

        if (!selectedItems) {
            selectedItems = [];
        }

        /* vm.title = data.title;

        if (!vm.title) {
            vm.title = '';
        } */

        vm.nameProperty = data.nameProperty;
        vm.strictOrder = data.strictOrder;
        /**
         * availableOptions - to show checkboxes for available options;
         * selectedOptions = to show checkboxes for selected options
         *
         * @type { {availableOptions: Boolean, selectedOptions: Boolean}|null|undefined }
         */
        vm.optionsCheckboxes = data.optionsCheckboxes;
        vm.readyStatus = false;
        vm.selectedItems = [];

		vm.orderOptions = data.orderOptions || null;

		vm.draggerElem = document.querySelector('.two-fields-multiselector-dialog .twoFieldsDragger');

        var separateUnselectedItems = function (items, selectedItems) {

            selectedItems.forEach(function (selItem) {

                var selItemId = selItem;

                if (typeof selItem === 'object') {
                    selItemId = selItem.id;
                }

                var notFound = true;

                items.forEach(function (item, itemIndex) {

                    if (item.id === selItemId) {

                    	if (typeof selItem === 'object') {
							item = Object.assign(item, selItem);
						}

                        vm.selectedItems.push(item);
                        items.splice(itemIndex, 1);

                        notFound = false;

                    }

                });

                if ( notFound ) {

                    vm.selectedItems.push({
                        id: selItemId,
                        name: 'Not found',
                        error_data: {
                            code: 10,
                            description: ''
                        },
                    });

                }

            })

        };

        vm.items = JSON.parse(JSON.stringify(data.items));

        if (vm.items && selectedItems) {
            separateUnselectedItems(vm.items, selectedItems);
        }

        vm.readyStatus = true;

        vm.cancel = function () {
            $mdDialog.hide({res: 'disagree'});
        };

        vm.agree = function () {

			if (vm.optionsCheckboxes) {

				vm.selectedItemsId = vm.selectedItems.map(function (selItem) {

					return {
						id: selItem.id,
						isChecked: selItem.isChecked || false
					};

				});

			} else {

				vm.selectedItemsId = vm.selectedItems.map(function (selItem) {
					return selItem.id;
				});

			}

            $mdDialog.hide({status: "agree", selectedItems: vm.selectedItemsId});

        };
    }

}());