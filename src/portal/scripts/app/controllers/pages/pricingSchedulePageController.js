/**
 * Created by szhitenev on 31.01.2020.
 */
(function () {

    'use strict';

    var pricingScheduleService = require('../../services/schedules/pricingScheduleService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.schedules = [];

        vm.readyStatus = {schedules: false};

        vm.getList = function () {

            pricingScheduleService.getList().then(function (data) {

                vm.schedules = data.results;

                vm.readyStatus.schedules = true;

                $scope.$apply();

            })
        };

        vm.editPricingSchedule = function ($event, item) {

            $mdDialog.show({
                controller: 'PricingScheduleEditDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-schedule-edit-dialog-view.html',
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

        vm.addPricingSchedule = function ($event) {

            $mdDialog.show({
                controller: 'PricingScheduleAddDialogController as vm',
                templateUrl: 'views/dialogs/pricing/pricing-schedule-add-dialog-view.html',
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