/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var currencyPricingSchemeService = require('../../../services/pricing/currencyPricingSchemeService');
    var attributeTypeService = require('../../../services/attributeTypeService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.itemId = data.item.id;

        vm.item = {};
        vm.types = [];

        vm.readyStatus = {types: false, item: false, attributeTypes: false};

        vm.switchState = 'default_value';

        vm.getAttributeTypes = function () {

            var entityType = 'currency';

            attributeTypeService.getList(entityType).then(function (data) {

                vm.attributeTypes = data.results;

                vm.readyStatus.attributeTypes = true;

                $scope.$apply();

            })

        };

        vm.getTypes = function () {

            currencyPricingSchemeService.getTypes().then(function (data) {

                vm.types = data.results;

                console.log('vm.types', vm.types);

                vm.readyStatus.types = true;

                $scope.$apply();

            })

        };

        vm.getItem = function () {

            currencyPricingSchemeService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                if (vm.item.type_settings) {

                    if (vm.item.type_settings.attribute_key) {
                        vm.switchState = 'attribute_key';
                    }

                }

                vm.readyStatus.item = true;

                console.log('data', data);

                $scope.$apply();

            })

        };

        vm.addParameter = function ($event) {

            if (!vm.item.type_settings.data) {
                vm.item.type_settings.data = {
                    parameters: []
                }
            }

            var index = vm.item.type_settings.data.parameters.length;

            vm.item.type_settings.data.parameters.push({index: index, ___switch_state: 'default_value'})

        };

        vm.switchParameter = function($event, item) {

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

            currencyPricingSchemeService.update(vm.item.id, vm.item).then(function (data) {

                console.log('data', data);

                $mdDialog.hide({status: 'agree', data: {item: vm.item}});

            })

        };

        vm.init = function () {

            vm.getItem();
            vm.getTypes();
            vm.getAttributeTypes();

        };

        vm.init();

    }

}());