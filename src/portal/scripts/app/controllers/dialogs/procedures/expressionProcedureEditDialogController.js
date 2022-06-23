/**
 * Created by szhitenev on 23.06.2022.
 */
(function () {

    'use strict';

    var expressionProcedureService = require('../../../services/procedures/expressionProcedureService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.readyStatus = {procedure: false};

        vm.item = {};

        vm.toggleStatus = {
            'date_from': 'datepicker',
            'date_to': 'datepicker'
        };

        vm.toggle = function (key) {

            if (vm.toggleStatus[key] === 'datepicker') {
                vm.toggleStatus[key] = 'expr'
            } else {
                vm.toggleStatus[key] = 'datepicker'
            }

            vm.item[key] = null;
            vm.item[key + '_expr'] = null;

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            expressionProcedureService.update(vm.item.id, vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});
            })

        };


        vm.getItem = function () {

            expressionProcedureService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                vm.item.data_string = JSON.stringify(vm.item.data, 0, 4)

                vm.readyStatus.procedure = true;


                if (vm.item.date_from_expr) {
                    vm.toggleStatus['date_from'] = 'expr'

                } else {
                    vm.toggleStatus['date_from'] = 'datepicker'
                }

                if (vm.item.date_to_expr) {
                    vm.toggleStatus['date_to'] = 'expr'


                } else {
                    vm.toggleStatus['date_to'] = 'datepicker'
                }



                $scope.$apply();

            })

        };


        vm.universalOptionsChange = function () {

            vm.item.data = JSON.parse(vm.item.data_string)
        }

        vm.universalFieldChange = function () {
            vm.item.data_string = JSON.stringify(vm.item.data, 0, 4)
        }

        vm.init = function () {

            vm.getItem();

        };

        vm.init();

    }

}());