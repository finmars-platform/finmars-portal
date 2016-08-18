/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/dataProvidersService');
    var instrumentSchemeService = require('../../services/instrumentSchemeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('InstrumentMappingEditDialogController', 'initialized');

        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {dataProviders: false, scheme: false};

        instrumentSchemeService.getByKey(schemeId).then(function (data) {
            vm.scheme = data;
            vm.readyStatus.scheme = true;
            fillArraysWithScheme();
            $scope.$apply();
        });

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs("instrument-scheme");

        vm.dataProviders = [];

        dataProvidersService.getList().then(function(data){
            vm.dataProviders = data;
            vm.readyStatus.dataProviders = true;
            $scope.$apply();
        });

        vm.mapFields = [
            {
                key: 'name',
                caption: 'Name',
                required: true,
                expression: ''
            },
            {
                key: 'user_code',
                caption: 'User code',
                required: true,
                expression: ''
            },
            {
                key: 'instrument_type',
                caption: 'Instrument type',
                required: true,
                expression: ''
            },
            {
                key: 'reference_for_pricing',
                caption: 'Reference for pricing',
                required: true,
                expression: ''
            },
            {
                key: 'short_name',
                caption: 'Short name',
                required: true,
                expression: ''
            },
            {
                key: 'public_name',
                caption: 'Public name',
                required: true,
                expression: ''
            }
        ];

        vm.providerFields = [
            {
                id: 0,
                name: '',
                field: ''
            }
        ];

        var fillArraysWithScheme = function () {

            vm.schemeName = vm.scheme['scheme_name'];
            vm.schemeProvider = vm.scheme['provider'];

            var findKeyCaption = function (key) {
                var i;
                for(i = 0; i < vm.entityAttrs.length; i = i + 1) {
                    if(vm.entityAttrs[i].key == key) {
                        return vm.entityAttrs[i].caption;
                    }
                }
            };

            var checkRequired = function (key) {
                var requiredFields = ['name',
                    'user_code',
                    'instrument_type',
                    'reference_for_pricing',
                    'short_name',
                    'public_name'];
                if (requiredFields.indexOf(key) !== -1) {
                    return true
                }
                return false;
            };

            var keys = Object.keys(vm.scheme);
            var i;
            vm.mapFields = [];
            for (i = 0; i < keys.length; i = i + 1) {

                var caption = findKeyCaption(keys[i]);
                var required = checkRequired(keys[i]);

                vm.mapFields.push({
                    caption: caption,
                    require: required,
                    key: keys[i],
                    expression: vm.scheme[keys[i]]
                })
            }

            var a;
            for(a = 0; a < vm.scheme.attributes.length; a = a + 1) {
                vm.mapFields.push(vm.scheme.attributes[a]);
            }

            vm.providerFields = vm.scheme.inputs;
        };

        vm.addProviderField = function () {
            vm.providerFields.push({
                id: 0,
                name: '',
                field: ''
            })
        };

        vm.addMapField = function () {
            vm.mapFields.push({
                expression: '',
                required: false
            })
        };

        vm.removeProviderField = function(item, $index) {
            vm.providerFields.splice(1, $index);
        };

        vm.removeMappingField = function(item, $index) {
            vm.mapFields.splice(1, $index);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            vm.scheme['scheme_name'] = vm.schemeName;
            var i;
            for (i = 0; i < vm.mapFields.length; i = i + 1) {
                vm.scheme[vm.mapFields[i].key] = vm.mapFields[i].expression
            }

            vm.scheme.inputs = vm.providerFields;

            $mdDialog.hide({
                status: 'agree',
                data: vm.scheme
            })
        }
    };

}());