/**
 * Created by szhitenev on 23.06.2022.
 */
(function () {

    'use strict';

    var expressionProcedureService = require('../../../services/procedures/expressionProcedureService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.schemes = [];
        vm.providers = [];

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

            expressionProcedureService.create(vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };


        vm.universalOptionsChange = function () {

            vm.item.data = JSON.parse(vm.item.data_string)
        }

        vm.universalFieldChange = function () {
            vm.item.data_string = JSON.stringify(vm.item.data, 0, 4)
        }


        vm.init = function () {

        };

        vm.init();

    }

}());