/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, metaContentTypesService, data, attributeDataService) {

        var vm = this;

        vm.attrsEntityType = data.entityType;
        vm.contentType = metaContentTypesService.findContentTypeByEntity(vm.attrsEntityType);
        vm.attrsValueType;

        vm.item = data.item;
        vm.data = data.data;
        vm.filterType = data.filterType;
        vm.attributes = [];

        vm.filterTypes = [];
        vm.reportTypesOpts = [
            {id: 'balance-report', name: 'Balance Report'},
            {id: 'pl-report', name: 'P&L Report'},
            {id: 'transaction-report', name: 'Transaction Report'},
        ];

        switch (vm.data.value_type) {
            case 10:
            case 30:
            case 'field':

            	vm.filterTypes = [{
                    id: 'contains',
                    name: 'CONTAINS'
                },
                {
                    id: 'equal',
                    name: 'EQUAL'
                }];

                vm.attrsValueType = [10, 30];

                break;

            case 20:
            case 40:

                vm.attrsValueType = vm.data.value_type;

                vm.filterTypes = [
                    {
                        id: 'equal',
                        name: 'EQUAL',
                    },
                    {
                        id: 'greater',
                        name: 'GREATER THAN'
                    },
                    {
                        id: 'greater_equal',
                        name: 'GREATER OR EQUAL TO'
                    },
                    {
                        id: 'less',
                        name: 'LESS THAN'
                    },
                    {
                        id: 'less_equal',
                        name: 'LESS OR EQUAL TO'
                    }
                ];

                break;
        }

        vm.filterTypesSelDisabled = vm.filterTypes.length < 2;

        if (!vm.item) {
            vm.filterType = vm.filterTypes[0].id;
        }

        vm.getAttributes = function () {
            /*switch (vm.data.value_type) {
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
            }*/
            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType);

        };

        vm.onAttrsTypeChange = function () {
            vm.contentType = metaContentTypesService.findContentTypeByEntity(vm.attrsEntityType);
            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType);
            vm.item = null;
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {item: vm.item, filterType: vm.filterType, attrsEntityType: vm.attrsEntityType}});
        };

        if (vm.attrsEntityType) {
            vm.attributes = attributeDataService.getAllAttributesByEntityType(vm.attrsEntityType);
        }

    }

}());