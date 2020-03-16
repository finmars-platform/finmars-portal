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

                vm.procedures = data.results.map(function (item) {

                    item.processed_procedures = item.procedures.filter(function (procedure) {
                        return procedure.status !== 'P'
                    }).length;

                    if (item.processed_procedures) {
                        item.progress_percent = Math.floor(item.processed_procedures / item.procedures.length * 100)
                    } else {
                        item.progress_percent = 0;
                    }

                    return item
                });

                console.log(vm.procedures);

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