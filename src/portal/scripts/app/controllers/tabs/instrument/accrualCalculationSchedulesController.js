/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var accrualCalculationModelService = require('../../../services/accrualCalculationModelService');
    var instrumentPeriodicityService = require('../../../services/instrumentPeriodicityService');

    var fieldResolverService = require('../../../services/fieldResolverService');


    module.exports = function ($scope) {

        logService.controller('AccrualCalculationSchedulesController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        vm.currencyFields = [];
        vm.dailyPricingModelFields = [];

        vm.readyStatus = {accrualModals: false, periodicityItems: false};

        accrualCalculationModelService.getList().then(function (data) {
            vm.accrualModels = data;
            vm.readyStatus.accrualModals = true;
            $scope.$apply();
        });

        instrumentPeriodicityService.getList().then(function (data) {
            vm.periodicityItems = data;
            vm.readyStatus.periodicityItems = true;
            $scope.$apply();
        });

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.accrualModals == true && vm.readyStatus.periodicityItems == true) {
                return true;
            }
            return false;
        };

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function (propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.bindCalculationModel = function (row) {
            var name;
            vm.accrualModels.forEach(function (item) {
                if (row.accrual_calculation_model == item.id) {
                    row.calculation_model_name = item.name;
                    name = item.name
                }
            });
            return name;
        };

        vm.bindPeriodicity = function (row) {
            var name;
            vm.periodicityItems.forEach(function (item) {
                if (row.periodicity == item.id) {
                    row.periodicity_name = item.name;
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
        };

        vm.getCurrencyFields = function () {

            fieldResolverService.getFields('accrued_currency', {
                entityType: 'instrument',
                key: 'accrued_currency'
            }).then(function (res) {

                vm.currencyFields = res.data;

                $scope.$apply();

            });

        };

        vm.getPaymentSizeDetailFields = function () {

            fieldResolverService.getFields('payment_size_detail', {
                entityType: 'instrument',
                key: 'payment_size_detail'
            }).then(function (res) {

                vm.dailyPricingModelFields = res.data;

                $scope.$apply();

            });

        };

        vm.setDefaultCurrencyFields = function () {

            var item_object = vm.entity.accrued_currency_object;

            if (item_object) {

                if (Array.isArray(item_object)) {
                    vm.currencyFields = item_object;
                } else {
                    vm.currencyFields.push(item_object);
                }
            }

        };

        vm.setDefaultPaymentSizeDetailFields = function () {

            var item_object = vm.entity.payment_size_detail_object;

            if (item_object) {

                if (Array.isArray(item_object)) {
                    vm.dailyPricingModelFields = item_object;
                } else {
                    vm.dailyPricingModelFields.push(item_object);
                }
            }

        };

        vm.init = function () {

            vm.setDefaultCurrencyFields();
            vm.setDefaultPaymentSizeDetailFields();

        };

        vm.init();

    }

}());