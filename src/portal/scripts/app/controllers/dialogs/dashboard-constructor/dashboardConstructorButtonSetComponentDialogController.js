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
            $mdDialog.hide({status: 'disagree'});
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
            },
            {
                name: 'User Attributes',
                link: 'app.settings.entities-custom-attributes'
            },


            {
                name: 'Data Import (from file)',
                link: 'app.import.simple-entity'
            },
            {
                name: 'Transactions Import (from file)',
                link: 'app.import.transaction'
            },
            {
                name: 'Data and Transactions Import (from file)',
                link: 'app.import.complex-import'
            },
            {
                name: 'Instrument Import (from provider)',
                link: 'app.import.instrument'
            },
            {
                name: 'Prices/FX (from provider)',
                link: 'app.import.prices'
            },
            {
                name: 'Mapping Tables',
                link: 'app.import.mapping-tables'
            },

            {
                name: 'Forms',
                link: 'app.settings.forms'
            },
            {
                name: 'Price Schemes',
                link: 'app.settings.price-download-scheme'
            },
            {
                name: 'Instrument Schemes',
                link: 'app.settings.instrument-import'
            },
            {
                name: 'Automated Price Schedule Settings',
                link: 'app.settings.automated-uploads-history'
            },
            {
                name: 'Data Import Schemes',
                link: 'app.settings.simple-entity-import'
            },
            {
                name: 'Transactions Import Schemes',
                link: 'app.settings.transaction-import'
            },
            {
                name: 'Complex Import Schemes',
                link: 'app.settings.complex-import'
            },
            {
                name: 'Import Configuration',
                link: 'app.settings.import-configuration'
            },
            {
                name: 'Export Configuration',
                link: 'app.settings.export-configuration'
            }



        ];

        vm.agree = function () {

            if (vm.item.id) {

                /*vm.componentsTypes = vm.componentsTypes.map(function (item) {

                    if (item.id === vm.item.id) {
                        return vm.item
                    }

                    return item;
                })*/
                dataService.updateComponentById(vm.item);

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponents(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log('dataService', dataService);

            vm.componentsTypes = dataService.getComponents()

        };

        vm.init()
    }

}());