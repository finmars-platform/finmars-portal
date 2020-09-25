/**
 * Created by szhitenev on 25.09.2020.
 */
(function () {

    'use strict';

    var dataProcedureService = require('../../../services/procedures/dataProcedureService');

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService')

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.item = {};

        vm.schemes = [];
        vm.providers = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.getSchemes = function(){

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.schemes = data.results;

                $scope.$apply();

            })

        };

        vm.agree = function () {

            dataProcedureService.create(vm.item).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {item: data}});

            })

        };


        vm.init = function () {

            vm.getSchemes();

        };

        vm.init();

    }

}());