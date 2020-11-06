/**
 * Created by szhitenev on 25.09.2020.
 */
(function () {

    'use strict';

    var dataProcedureService = require('../../../services/procedures/dataProcedureService');
    var dataProvidersService = require('../../../services/import/dataProvidersService');

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService')
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService')


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.schemes = [];
        vm.providers = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
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

        vm.agree = function () {

            if (vm.item.data && vm.item.data.hasNoDelete) {
                vm.item.data.nodelete = '';
            } else {
                delete vm.item.data.nodelete;
            }

            dataProcedureService.create(vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };


        vm.init = function () {

            vm.getTransactionImportSchemes();
            vm.getSimpleImportSchemes();
            vm.getProviders();

        };

        vm.init();

    }

}());