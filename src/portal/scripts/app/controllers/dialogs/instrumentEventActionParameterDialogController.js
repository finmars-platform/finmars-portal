/**
 * Created by szhitenev on 30.12.2021.
 */
(function () {

    'use strict';

    var transactionTypeService = require('../../services/transactionTypeService')

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.title = 'Instrument Event Action Parameter Dialog';

        // MULTIPLE PARAMETER LOGIC START

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

        // MULTIPLE PARAMETER LOGIC END

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function (responseData) {

            if (!vm.action.data) {
                vm.action.data = {}
            }

            if (!vm.action.data.parameters) {
                vm.action.data.parameters = []
            }

            vm.transactionType.context_parameters.forEach(function (parameter) {
                vm.action.data.parameters.push({
                    order: parameter.order,
                    name: parameter.name,
                    value_type: parameter.value_type,
                    event_parameter_name: parameter.event_parameter_name
                })
            })

            $mdDialog.hide({
                status: 'agree', data: {
                    item: vm.action
                }
            });

        };


        vm.init = function () {

            if (!data.item.transaction_type) {
                throw "Transaction type required"
            }

            vm.processsing = true;

            transactionTypeService.getListLightWithInputs({
                filters: {
                    user_code: data.item.transaction_type
                }
            }).then(function (res) {

                vm.processsing = false;

                if (res.results.length) {
                    vm.transactionType = res.results[0];
                } else {
                    $mdDialog.hide({status: 'disagree'});
                    throw "Transaction type is not exist"
                }

                vm.eventParameters = data.eventParameters
                vm.action = data.item;

                if (vm.transactionType.context_parameters_notes) {
                    vm.title = vm.transactionType.context_parameters_notes
                }
                
                console.log('eventParameters', vm.eventParameters);

                vm.optionsForMultipleParameters[10] = vm.getOptionsForAttributeKey(10);
                vm.optionsForMultipleParameters[20] = vm.getOptionsForAttributeKey(20);
                vm.optionsForMultipleParameters[40] = vm.getOptionsForAttributeKey(40);

                console.log('vm.optionsForMultipleParameters', vm.optionsForMultipleParameters);

                if (vm.action.data && vm.action.data.parameters) {
                    vm.transactionType.context_parameters.forEach(function (parameter) {

                        vm.action.data.parameters.forEach(function (action_parameter) {
                            if (parameter.order === action_parameter.order) {
                                parameter.event_parameter_name = action_parameter.event_parameter_name
                            }
                        })
                    })
                }

                $scope.$apply();
            })

        }

        vm.init();

    }

}());