/**
 * Created by szhitenev on 31.01.2020.
 */
(function () {

    'use strict';

    var scheduleService = require('../../services/scheduleService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.schedules = [];

        vm.readyStatus = {schedules: false};

        vm.getList = function () {

            scheduleService.getList().then(function (data) {

                vm.schedules = data.results;

                vm.readyStatus.schedules = true;

                $scope.$apply();

            })
        };

        vm.editPricingSchedule = function ($event, item) {

            $mdDialog.show({
                controller: 'ScheduleEditDialogController as vm',
                templateUrl: 'views/dialogs/schedules/schedule-edit-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {
                        item: item
                    }

                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.editDeleteSchedule = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete Pricing Schedule <b>" + item.name + '</b>?'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    scheduleService.deleteByKey(item.id).then(function (data) {
                        vm.getList();
                    })

                }

            })

        };

        vm.addPricingSchedule = function ($event) {

            $mdDialog.show({
                controller: 'ScheduleAddDialogController as vm',
                templateUrl: 'views/dialogs/schedules/schedule-add-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                locals: {
                    data: {}
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getList();
                }

            })

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    };

}());