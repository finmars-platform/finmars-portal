/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var instrumentPricingSchemeService = require('../../../services/pricing/instrumentPricingSchemeService');
    var attributeTypeService = require('../../../services/attributeTypeService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};
        vm.types = [];
        vm.switchState = 'default_value';

        vm.readyStatus = {types: false};

        vm.getAttributeTypes = function () {

            var entityType = 'instrument';

            attributeTypeService.getList(entityType).then(function (data) {

                vm.attributeTypes = data.results;

                vm.readyStatus.attributeTypes = true;

                $scope.$apply();

            })

        };

        vm.getTypes = function(){

            instrumentPricingSchemeService.getTypes().then(function (data) {

                vm.types = data.results;

                console.log('vm.types', vm.types);

                vm.readyStatus.types = true;

                console.log('vm.readyStatus', vm.readyStatus);

                $scope.$apply();

            })

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            console.log('vm.item', vm.item);

            instrumentPricingSchemeService.create(vm.item).then(function (data) {

                console.log('data', data);

                $mdDialog.hide({status: 'agree'});

            })
        };

        vm.switch = function($event) {

            if (vm.switchState === 'default_value') {
                vm.switchState = 'attribute_key'
            } else {
                vm.switchState = 'default_value'
            }

            if(!vm.item.type_settings) {
                vm.item.type_settings = {}
            }

            vm.item.type_settings.default_value = null;
            vm.item.type_settings.attribute_key = null;

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

        vm.init = function () {

            vm.getTypes();
            vm.getAttributeTypes();

        };

        vm.init();

    }

}());