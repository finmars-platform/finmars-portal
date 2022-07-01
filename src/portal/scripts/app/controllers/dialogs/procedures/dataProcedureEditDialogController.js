/**
 * Created by szhitenev on 25.09.2020.
 */
(function () {

    'use strict';

    var dataProcedureService = require('../../../services/procedures/dataProcedureService');
    var dataProvidersService = require('../../../services/import/dataProvidersService');

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService')
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService')

    var entityResolverService = require('../../../services/entityResolverService')

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.readyStatus = {procedure: false};

        vm.item = {};
        vm.transactionImportSchemes = [];
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

        vm.getTransactionImportSchemes = function(){

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.transactionImportSchemes = data.results;

                $scope.$apply();

            })

        };

        vm.getSimpleImportSchemes = function(){

            csvImportSchemeService.getListLight().then(function (data) {

                vm.simpleImportSchemes = data.results;

                $scope.$apply();

            })

        };

        vm.getProviders = function(){

            dataProvidersService.getPersonalProvidersList().then(function (data) {

                vm.providers = data;

                $scope.$apply();

            })

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.item.data = JSON.parse(vm.item.data_string)

            dataProcedureService.update(vm.item.id, vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});
            })

        };


        vm.getItem = function () {

            dataProcedureService.getByKey(vm.itemId).then(function (data) {

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

        vm.getCurrencyCodes = function (){

            entityResolverService.getListLight('currency').then(function (data){

                vm.currencyCodes = data.results.map(function (item){

                    item.id = item.user_code

                    return item

                })

            })

        }

        vm.universalOptionsChange = function () {

            vm.item.data = JSON.parse(vm.item.data_string)
        }

        vm.universalFieldChange = function () {
            vm.item.data_string = JSON.stringify(vm.item.data, 0, 4)
        }

        vm.init = function () {

            vm.getItem();
            vm.getTransactionImportSchemes();
            vm.getSimpleImportSchemes();
            vm.getProviders();

            vm.getCurrencyCodes();

        };

        vm.init();

    }

}());