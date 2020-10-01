/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var scheduleService = require('../../../services/scheduleService');
    var pricingProcedureService = require('../../../services/procedures/pricingProcedureService');
    var dataProcedureService = require('../../../services/procedures/dataProcedureService');

    module.exports = function scheduleAddDialogController($scope, $mdDialog, data) {

        var vm = this;

        vm.readyStatus = {pricingProcedures: false};

        vm.days = [];
        vm.schedule = {};

        vm.cron = {
            periodicity: 1
        };
        vm.cron.time = new Date();

        vm.pricingProcedures = [];
        vm.dataProcedures = [];

        vm.setDay = function (day) {
            if (!vm.cron.day) {
                vm.cron.day = [];
            }
            vm.cron.day.push(day);
        };

        vm.resetCronExpr = function () {
            vm.cron.day = [];
            vm.cron.month = [];
        };

        vm.getRange = function (num) {
            var res = [];
            var i;
            for (i = 0; i < num; i = i + 1) {
                res.push(i);
            }
            return res;
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            var minutes = moment(new Date(vm.cron.time)).format('mm');
            var hours = moment(new Date(vm.cron.time)).format('HH');

            vm.schedule.is_enabled = true;

            console.log('cron.time', vm.cron.time);
            console.log('minutes', minutes);
            console.log('hours', hours);

            if (vm.cron.periodicity === 1) {
                console.log(parseInt(minutes) + ' ' + parseInt(hours) + ' * * *');
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' * * *';
            }
            if (vm.cron.periodicity === 2) {
                //console.log(minutes + ' ' + parseInt(hours) + ' * * ' + vm.cron.day);
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' * * ' + vm.cron.day;
            }
            if (vm.cron.periodicity === 3) {
                //console.log(minutes + ' ' + parseInt(hours) + ' * ' + vm.cron.month + ' ' + vm.cron.day);
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' ' + vm.cron.day + ' ' + vm.cron.month + ' *'
            }

            scheduleService.create(vm.schedule).then(function (data) {

                $mdDialog.hide({status: 'agree', data: 'success'});
                $scope.$apply();

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        };

        vm.getPricingProcedures = function () {

            pricingProcedureService.getList().then(function (data) {

                vm.pricingProcedures = data.results;

                vm.readyStatus.pricingProcedures = true;

                $scope.$apply();

            })

        };

        vm.getDataProcedures = function () {

            dataProcedureService.getList().then(function (data) {

                vm.dataProcedures = data.results;

                vm.readyStatus.dataProcedures = true;

                $scope.$apply();

            })

        };


        vm.getServerTime = function() {

            return new Date().toISOString().split('T')[1].split('.')[0]

        };

        vm.deleteProcedure = function($event, item, $index)  {

            vm.schedule.procedures.splice($index, 1);

            vm.orderProcedures();

        };

        vm.addProcedure = function ($event) {

            if (!vm.schedule.procedures) {
                vm.schedule.procedures = [];
            }

            vm.schedule.procedures.push({})

            vm.orderProcedures();

        };

        vm.orderProcedures = function () {

            vm.schedule.procedures = vm.schedule.procedures.map(function (item, index) {

                item.order = index + 1;

                return item
            })

        };

        vm.init = function () {
            vm.getPricingProcedures();
            vm.getDataProcedures();
        };

        vm.init();

    }

}());