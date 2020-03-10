/**
 * Created by szhitenev on 26.06.2019.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var pricingScheduleService = require('../../services/schedules/pricingScheduleService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('AutomatedUploadsHistoryController', 'initialized');

        var vm = this;

        vm.readyStatus = {schedule: false};

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

        pricingScheduleService.getSchedule().then(function (data) {
            vm.schedule = data;
            vm.readyStatus.schedule = true;

            var values = vm.schedule.cron_expr.split(' ');

            vm.cron.time = new Date();
            vm.cron.time.setMinutes(values[0]);
            vm.cron.time.setHours(values[1]);

            console.log('value', values);


            if (values[3] == '*' && values[2] == '*') {
                vm.cron.periodicity = 2;
                vm.cron.day = values[4].split(',');
                vm.cron.day.forEach(function (day) {
                    vm.days[day - 1] = {status: true};
                })

            }
            if (values[4] == '*') {
                vm.cron.periodicity = 3;
                vm.cron.day = values[2].split(',');
                if (values[3].length > 1) {
                    vm.cron.month = values[3].split(',');
                } else {
                    vm.cron.month = [values[3]];
                }
            }

            if (values[4] == '*' && values[3] == '*' && values[2] == '*') {
                vm.cron.periodicity = 1
            }

            console.log('vm.periodicity', vm.periodicity);

            $scope.$apply();
        });

        vm.save = function ($event) {

            var minutes = moment(new Date(vm.cron.time)).format('mm');
            var hours = moment(new Date(vm.cron.time)).format('hh');

            vm.schedule.is_enabled = true;

            //console.log('cron.time', vm.cron.time);
            //console.log('minutes', minutes);
            //console.log('hours', hours);

            if (vm.cron.periodicity == 1) {
                console.log(parseInt(minutes) + ' ' + parseInt(hours) + ' * * *');
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' * * *';
            }
            if (vm.cron.periodicity == 2) {
                //console.log(minutes + ' ' + parseInt(hours) + ' * * ' + vm.cron.day);
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' * * ' + vm.cron.day;
            }
            if (vm.cron.periodicity == 3) {
                //console.log(minutes + ' ' + parseInt(hours) + ' * ' + vm.cron.month + ' ' + vm.cron.day);
                vm.schedule.cron_expr = parseInt(minutes) + ' ' + parseInt(hours) + ' ' + vm.cron.day + ' ' + vm.cron.month + ' *'
            }

            pricingScheduleService.updateSchedule(vm.schedule).then(function (data) {

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    targetEvent: $event,
                    autoWrap: true,
                    locals: {
                        success: {
                            title: "Success",
                            description: "Upload ."
                        }
                    }

                });

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

    };

}());