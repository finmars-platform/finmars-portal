/**
 * Created by szhitenev on 30.12.2021.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        // MULTIPLE PARAMETER LOGIC START

        vm.optionsForMultipleParameters = {};

        vm.getOptionsForAttributeKey = function (valueType) {

            var valueTypeInt = parseInt(valueType, 10);

            var result = [];

            if (valueTypeInt === 10) {
                result.push({
                    name: 'Reference for pricing',
                    user_code: 'reference_for_pricing'
                })
            }

            if (valueTypeInt === 20) {
                result.push({
                    name: 'Default Price',
                    user_code: 'default_price'
                })
            }

            if (valueTypeInt === 40) {
                result.push({
                    name: 'Maturity Date',
                    user_code: 'maturity_date'
                })
            }

            var attrs = vm.instrumentAttrTypes.filter(function (item) {

                if (item.value_type === valueTypeInt) {
                    return true;
                }

                return false;

            }).map(function (item) {

                return {
                    name: item.name,
                    user_code: 'attributes.' + item.user_code
                }

            });

            result = result.concat(attrs);

            return result

        };

        vm.multipleParameterValueTypeUpdate = function (item, num) {

            var index = num - 1;

            var value_type = item.data.parameters[index].value_type;

            vm.optionsForMultipleParameters[value_type] = vm.getOptionsForAttributeKey(value_type);

        };

        vm.addParameter = function ($event, item) {

            if (!item.data) {
                item.data = {}
            }

            if (!item.data.parameters) {
                item.data.parameters = []
            }

            var index = item.data.parameters.length;

            index = index + 1

            item.data.parameters.push({index: index, ___switch_state: 'default_value'})

        };

        vm.switchParameter = function ($event, item, parameter) {

            if (parameter.___switch_state === 'default_value') {
                parameter.___switch_state = 'attribute_key'
            } else {
                parameter.___switch_state = 'default_value'
            }

            parameter.default_value = null;
            parameter.attribute_key = null;

        };

        // MULTIPLE PARAMETER LOGIC END

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function (responseData) {

            $mdDialog.hide({
                status: 'agree', data: {
                    item: vm.item
                }
            });

        };


        vm.init = function () {

            vm.instrumentAttrTypes = data.instrumentAttrTypes
            vm.item = data.item;

            vm.optionsForMultipleParameters[10] = vm.getOptionsForAttributeKey(10);
            vm.optionsForMultipleParameters[20] = vm.getOptionsForAttributeKey(20);
            vm.optionsForMultipleParameters[40] = vm.getOptionsForAttributeKey(40);

        }

        vm.init();

    }

}());