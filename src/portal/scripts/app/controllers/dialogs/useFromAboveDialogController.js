/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data, attributeDataService) {

        var vm = this;

        vm.attrsEntityType = data.entityType;
        vm.item = data.item;
        vm.data = data.data;
        vm.filterType = data.filterType;
        vm.attributes = [];

        vm.filterTypes = [];

        switch (vm.data.value_type) {
            case 10:
            case 30:
            case 'field':
                vm.filterTypes = [{
                    key: 'contains',
                    name: 'CONTAINS'
                },
                {
                    key: 'equal',
                    name: 'EQUAL'
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
        }

        if (!vm.item) {
            vm.filterType = vm.filterTypes[0].key;
        }

        vm.getAttributes = function () {
            console.log("link to selection value_type", vm.data, vm.data.value_type);
            switch (vm.data.value_type) {
                case 10:
                case 30:
                    vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType).filter(function (attr) {
                        if (attr.value_type === 10 || attr.value_type === 30) {
                            return true;
                        }
                        return false;
                    });
                    break;
                case 20:
                    vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType).filter(function (attr) {
                        return attr.value_type === 20;
                    });
                    break;
                case 40:
                    vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType).filter(function (attr) {
                        return attr.value_type === 40;
                    });
                    break;
            }

        };

        vm.onAttrsTypeChange = function () {
            vm.item = null;
            vm.getAttributes();
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item, filterType: vm.filterType, attrsEntityType: vm.attrsEntityType}});
        };

        if (vm.attrsEntityType) {
            vm.getAttributes();
        }

    }

}());