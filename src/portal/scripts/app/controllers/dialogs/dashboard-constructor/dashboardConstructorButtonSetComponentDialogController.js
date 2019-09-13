/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, item, dataService, eventService) {

        var vm = this;

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'button_set',
                id: null, // should be generated before create
                name: '',
                settings: {
                    buttons: []
                }
            }
        }

        vm.componentsTypes = [];

        vm.cancel = function () {

            $mdDialog.hide();

        };

        vm.addNewButton = function () {

            vm.item.settings.buttons.push(vm.newButton);
            vm.newButton = {}

        };

        vm.deleteButton = function ($event, button, $index) {

            vm.item.settings.buttons = vm.item.settings.buttons.filter(function (item, index) {

                return $index !== index;

            });

        };

        vm.links = [
            {
                name: 'Account Types',
                link: 'app.data.account-type'
            },
            {
                name: 'Instrument Types',
                link: 'app.data.instrument-type'
            },
            {
                name: 'Transaction Types',
                link: 'app.data.transaction-type'
            },
            {
                name: 'Pricing Policies',
                link: 'app.data.pricing-policy'
            }

        ];

        vm.agree = function () {

            if (vm.item.id) {

                vm.componentsTypes = vm.componentsTypes.map(function (item) {

                    if (item.id === vm.item.id) {
                        return vm.item
                    }

                    return item;
                })

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponentsTypes(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log('dataService', dataService);

            vm.componentsTypes = dataService.getComponentsTypes()

        };

        vm.init()
    }

}());