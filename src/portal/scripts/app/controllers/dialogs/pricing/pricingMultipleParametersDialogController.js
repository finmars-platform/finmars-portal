/**
 * Created by szhitenev on 21.02.2020.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = JSON.parse(JSON.stringify(data.item));

        vm.schemeParameters = [];
        vm.items = [];

        console.log('vm.item', vm.item);

        if (vm.item.pricing_scheme_object) {
            if (vm.item.pricing_scheme_object.type_settings.data && vm.item.pricing_scheme_object.type_settings.data.parameters) {
                vm.schemeParameters = vm.item.pricing_scheme_object.type_settings.data.parameters
            }
        }


        vm.getVerboseValueType = function (valueType) {

            valueType = parseInt(valueType, 10);

            if (valueType === 10) {
                return 'Text'
            }

            if (valueType === 20) {
                return 'Number'
            }

            if (valueType === 40) {
                return 'Date'
            }

        };

        vm.switch = function ($event, item) {

            if (item.___switch_state === 'default_value') {
                item.___switch_state = 'attribute_key'
            } else {
                item.___switch_state = 'default_value'
            }

            item.default_value = null;
            item.attribute_key = null;

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            if (!vm.item.data) {
                vm.item.data = {}
            }

            vm.item.data.parameters = vm.items;

            console.log('agree vm.item', vm.item);

            $mdDialog.hide({status: 'agree', data: {item: vm.item}});

        };

        vm.syncStructure = function () {

            if (vm.item.data) {

                if (vm.item.data.parameters) {

                    vm.items = vm.item.data.parameters.map(function (item) {
                        return item
                    })

                }

            }

            console.log('vm.items', vm.items);

            if (vm.schemeParameters) {

                vm.schemeParameters.forEach(function (param) {

                    var exist = false;

                    console.log('param', param);

                    vm.items.forEach(function (item) {

                        console.log('item', item);

                        if (param.index === item.index) {
                            exist = true;
                        }

                    });

                    if (!exist) {
                        vm.items.push(param)
                    }


                })

            }


        };


        vm.init = function () {

            vm.syncStructure()

        };

        vm.init();

    }

}());