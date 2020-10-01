/**
 * Created by szhitenev on 25.09.2020.
 */
(function () {

    'use strict';

    var dataProcedureService = require('../../../services/procedures/dataProcedureService');
    var dataProvidersService = require('../../../services/import/dataProvidersService');

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService')

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.readyStatus = {procedure: false};

        vm.item = {};
        vm.schemes = [];
        vm.providers = [];

        vm.getSchemes = function(){

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.schemes = data.results;

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

            dataProcedureService.update(vm.item.id, vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});
            })

        };


        vm.getItem = function () {

            dataProcedureService.getByKey(vm.itemId).then(function (data) {

                vm.item = data;

                vm.readyStatus.procedure = true;

                $scope.$apply();

            })

        };

        vm.init = function () {

            vm.getItem();
            vm.getSchemes();
            vm.getProviders();

        };

        vm.init();

    }

}());