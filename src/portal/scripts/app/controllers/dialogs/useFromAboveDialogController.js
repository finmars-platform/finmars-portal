/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = data.item;
        vm.data = data.data;
        vm.filterType = data.filterType;

        vm.filterTypes = [];

        switch (vm.data.valueType) {
            case 10:
            case 30:
            case 'field':
                vm.filterTypes = [{
                    key: 'contains',
                    name: 'CONTAINS'
                }];
                break;

            case 20:
            case 40:
                vm.filterTypes = [{
                    key: 'equal',
                    name: 'EQUAL',
                },
                {
                    key: 'greater',
                    name: 'GREATER THAN'
                },
                {
                    key: 'greater_equal',
                    name: 'GREATER OR EQUAL TO'
                },
                {
                    key: 'less',
                    name: 'LESS THAN'
                },
                {
                    key: 'less_equal',
                    name: 'LESS OR EQUAL TO'
                }];

                break;
        };

        if (!vm.item) {
            vm.filterType = vm.filterTypes[0].key;
        }

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {

            $mdDialog.hide({status: 'agree', data: {item: vm.item, filterType: vm.filterType}});

        };

    }

}());