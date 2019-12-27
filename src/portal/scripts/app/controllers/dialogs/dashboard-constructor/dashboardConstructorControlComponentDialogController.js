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
                type: 'control',
                id: null, // should be generated before create
                name: '',
                settings: {

                }
            }
        }

        vm.componentsTypes = [];

        vm.contentTypes = [
            {
                name: 'Instrument',
                key: 'instruments.instrument'
            },
            {
                name: 'Portfolio',
                key: 'portfolios.portfolio'
            },
            {
                name: 'Account',
                key: 'accounts.account'
            },
            {
                name: 'Currency',
                key: 'currencies.currency'
            },
            {
                name: 'Pricing Policy',
                key: 'instruments.pricingpolicy'
            }
        ];


        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.settings.value_type = parseInt(vm.item.settings.value_type, 10);

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