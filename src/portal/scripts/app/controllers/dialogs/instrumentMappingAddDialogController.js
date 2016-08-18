/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/dataProvidersService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('InstrumentMappingDialogController', 'initialized');

        var vm = this;

        vm.dataProviders = [];

        vm.readyStatus = {dataProviders: false, scheme: true};

        dataProvidersService.getList().then(function(data){
            vm.dataProviders = data;
            vm.readyStatus.dataProviders = true;
            $scope.$apply();
        });

        vm.baseAttrs = metaService.getBaseAttrs();
        vm.entityAttrs = metaService.getEntityAttrs("instrument-scheme");

        vm.scheme = {};

        var createEmptyScheme = function(){
            vm.scheme.attributes = [];
            var b;
            for(b = 0; b < vm.baseAttrs.length; b = b + 1) {
                vm.scheme[vm.baseAttrs[b].key] = ''
            }
            var i;
            for(i = 0; i < vm.entityAttrs.length; i = i + 1) {
                vm.scheme[vm.entityAttrs[i].key] = ''
            }
        };

        createEmptyScheme();

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
                name: '',
                field: ''
            }
        ];

        vm.addProviderField = function () {
            vm.providerFields.push({
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

        vm.agree = function() {

            vm.scheme['scheme_name'] = vm.schemeName;
            vm.scheme['provider'] = vm.schemeProvider;
            var i;
            for(i = 0; i < vm.mapFields.length; i = i + 1) {
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