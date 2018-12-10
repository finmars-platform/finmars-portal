/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.effective_date_from = moment(new Date()).format('YYYY-MM-DD');
        vm.effective_date_to = moment(new Date()).format('YYYY-MM-DD');
        vm.loading = false;
        vm.filters = {};

        vm.events = [];

        vm.agree = function ($event) {

            var promises = [];

            vm.events.map(function (event) {
                if (event.is_need_reaction) {
                    promises.push(vm.openEventWindow($event, event));
                }
            });


            Promise.all(promises).then(function () {
                $mdDialog.hide();
            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.isAllChecked = function () {

            var result = true;

            for (var i = 0; i < vm.events.length; i = i + 1) {
                if (!vm.events[i].selected) {
                    result = false;
                    break;
                }
            }

            return result;

        };

        vm.toggleAll = function () {

            var state = !vm.isAllChecked();

            for (var i = 0; i < vm.events.length; i = i + 1) {
                vm.events[i].selected = state;
            }

        };

        vm.requestEvents = function () {

            vm.loading = true;

            var filters = {};

            filters.effective_date_0 = vm.effective_date_from;
            filters.effective_date_1 = vm.effective_date_to;

            eventsService.generateEventsRange({filters: filters}).then(function (eventsData) {

                var len = eventsData.tasks_ids.length;
                var time = 2000;

                setTimeout(function () {

                    eventsService.getList({filters: filters}).then(function (data) {

                        vm.events = data.results;

                        vm.loading = false;

                        $scope.$apply();

                    })

                }, len * time)

            });

        };

        vm.getStatus = function (status) {

            switch (status) {
                case 1:
                    return 'New';
                case 2:
                    return 'Ignored';
                case 3:
                    return 'Pending (book)';
                case 4:
                    return 'Booked';

            }

        };

        vm.updateTable = function ($event) {

            if (vm.effective_date_from !== vm.effective_date_to) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/warning-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        warning: {
                            title: 'Warning!',
                            description: 'Calculation may take some time, are you sure?'
                        }
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHid: true,
                    multiple: true
                }).then(function (res) {
                    if (res.status === 'agree') {
                        vm.requestEvents();
                    }
                });

            } else {
                vm.requestEvents();
            }


        };

        vm.openEventWindow = function ($event, event) {
            return $mdDialog.show({
                controller: 'EventDialogController as vm',
                templateUrl: 'views/dialogs/event-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        event: event
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            })
        };

    };

}());