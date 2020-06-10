/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {

    'use strict';

    var pricingScheduleService= require('../../../services/schedules/pricingScheduleService');
    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.itemId = data.item.id;

        vm.readyStatus = {schedule: false, pricingProcedures: false};

        vm.days = [];
        vm.schedule = {};

        vm.cron = {
            periodicity: 1
        };
        vm.cron.time = new Date();

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

        vm.getItem = function() {

            pricingScheduleService.getByKey(vm.itemId).then(function (data) {

                console.log('data', data);

                vm.schedule = data;
                vm.readyStatus.schedule = true;

                var values = vm.schedule.cron_expr.split(' ');


                console.log('value', values);


                if (values.length === 5) {

                    vm.cron.time = new Date();
                    vm.cron.time.setMinutes(values[0]);
                    vm.cron.time.setHours(values[1]);


                    if (values[3] === '*' && values[2] === '*') {
                        vm.cron.periodicity = 2;
                        vm.cron.day = values[4].split(',');
                        vm.cron.day.forEach(function (day) {
                            vm.days[day - 1] = {status: true};
                        })

                    }
                    if (values[4] === '*') {
                        vm.cron.periodicity = 3;
                        vm.cron.day = values[2].split(',');
                        if (values[3].length > 1) {
                            vm.cron.month = values[3].split(',');
                        } else {
                            vm.cron.month = [values[3]];
                        }
                    }

                    if (values[4] === '*' && values[3] === '*' && values[2] === '*') {
                        vm.cron.periodicity = 1
                    }
                }

                console.log('vm.periodicity', vm.periodicity);

                $scope.$apply();
            });

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

            pricingScheduleService.update(vm.schedule.id, vm.schedule).then(function (data) {

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

        vm.getServerTime = function() {

            return new Date().toISOString().split('T')[1].split('.')[0]

        };

        vm.init = function(){

            vm.getItem();
            vm.getPricingProcedures();

        };

        vm.init();



    }

}());