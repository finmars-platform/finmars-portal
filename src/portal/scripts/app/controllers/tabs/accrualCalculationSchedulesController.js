/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var accrualCalculationModelService = require('../../services/accrualCalculationModelService');

    module.exports = function ($scope) {

        logService.controller('AccrualCalculationSchedulesController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        vm.readyStatus = {accrualModals: false};

        accrualCalculationModelService.getList().then(function (data) {
            vm.accrualModels = data;
            vm.readyStatus.accrualModals = true;
            $scope.$apply();
        });

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function(propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.bindCalculationModel = function(calculationModel) {
            var name;
            vm.accrualModels.forEach(function (item) {
                if (calculationModel.accrual_calculation_model == item.id) {
                    calculationModel.calculation_model_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.newItem = {
            "accrual_start_date": new Date(),
            "first_payment_date": new Date(),
            "accrual_size": '',
            "accrual_calculation_model": '',
            "periodicity": '',
            "periodicity_n": '',
            "notes": ""
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.accrual_calculation_schedules.splice(index, 1);
        };

        vm.addRow = function () {
            vm.entity.accrual_calculation_schedules.push({
                "accrual_start_date": moment(new Date(vm.newItem.accrual_start_date)).format('YYYY-MM-DD'),
                "first_payment_date": moment(new Date(vm.newItem.first_payment_date)).format('YYYY-MM-DD'),
                "accrual_size": vm.newItem.accrual_size,
                "accrual_calculation_model": vm.newItem.accrual_calculation_model,
                "periodicity": vm.newItem.periodicity,
                "periodicity_n": vm.newItem.periodicity_n,
                "notes": vm.newItem.notes
            });

            vm.newItem = {
                "accrual_start_date": new Date(),
                "first_payment_date": new Date(),
                "accrual_size": '',
                "accrual_calculation_model": '',
                "periodicity": '',
                "periodicity_n": '',
                "notes": ""
            };
        }

    }

}());