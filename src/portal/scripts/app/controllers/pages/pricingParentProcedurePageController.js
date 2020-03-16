/**
 * Created by szhitenev on 13.03.2020.
 */
(function () {

    'use strict';

    var pricingParentProcedureService = require('../../services/pricing/pricingParentProcedureService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.procedures = [];

        vm.readyStatus = {procedures: false};

        vm.getList = function () {

            pricingParentProcedureService.getList().then(function (data) {

                vm.procedures = data.results;

                vm.readyStatus.procedures = true;

                $scope.$apply();

            })
        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());