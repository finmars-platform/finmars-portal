/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope) {

        logService.controller('FactorScheduleTabController', 'initialized');

        var vm = this;

        vm.entity = $scope.$parent.vm.entity;

        console.log('----------------------------------', vm.entity);

        vm.newItem = {};
        vm.newItem.date = new Date();

        vm.toggleQuery = function () {
            vm.queryStatus = !vm.queryStatus;
            vm.query = {};
        };

        vm.setSort = function(propertyName) {
            vm.direction = (vm.sort === propertyName) ? !vm.direction : false;
            vm.sort = propertyName;
        };

        vm.editItem = function (item) {
            item.editStatus = true;
        };

        vm.saveItem = function (item) {
            item.editStatus = false;
        };

        vm.deleteItem = function (item, index) {
            vm.entity.factor_schedules.splice(index, 1);
        };

        vm.addRow = function () {
            vm.entity.factor_schedules.push({
                factor_value: vm.newItem.value,
                effective_date: moment(new Date(vm.newItem.date)).format('YYYY-MM-DD')
            });

            vm.newItem.value = null;
            vm.newItem.date = null
        }

    }

}());