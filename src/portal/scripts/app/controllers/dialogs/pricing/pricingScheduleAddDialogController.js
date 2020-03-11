/**
 * Created by szhitenev on 30.01.2020.
 */
(function(){

    'use strict';

    var pricingScheduleService= require('../../../services/pricing/pricingScheduleService');

    module.exports = function($scope, $mdDialog, data){

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

            pricingScheduleService.create(vm.schedule).then(function (data) {

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

        vm.init = function(){

        };

        vm.init();

    }

}());