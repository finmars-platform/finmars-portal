/**
 * Created by szhitenev on 30.12.2021.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

		vm.changeOnlyValue = !!data.changeOnlyValue;

        //region MULTIPLE PARAMETER LOGIC

        vm.optionsForMultipleParameters = {};

        vm.getOptionsForAttributeKey = function (valueType) {

            var valueTypeInt = parseInt(valueType, 10);

            var result = [];

            var attrs = vm.eventParameters.filter(function (item) {

                if (parseInt(item.value_type, 10) === valueTypeInt) {
                    return true;
                }

                return false;

            })

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

        //endregion MULTIPLE PARAMETER LOGIC

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function (responseData) {

            $mdDialog.hide({
                status: 'agree', data: {
                    item: vm.action
                }
            });

        };


        vm.init = function () {

            vm.eventParameters = data.eventParameters
            vm.action = data.item;

            console.log('eventParameters', vm.eventParameters);

            vm.optionsForMultipleParameters[10] = vm.getOptionsForAttributeKey(10);
            vm.optionsForMultipleParameters[20] = vm.getOptionsForAttributeKey(20);
            vm.optionsForMultipleParameters[40] = vm.getOptionsForAttributeKey(40);

            console.log('vm.optionsForMultipleParameters', vm.optionsForMultipleParameters);

        }

        vm.init();

    }

}());