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

            var dontReactActionsIds = [1, 6, 9, 14];
            var applyDefaultActionsIds = [5, 8, 12, 13];

            vm.events.forEach(function (event) {

                console.log('event', event);

                if (event.selected) {

                    if (event.is_need_reaction) {
                        return promises.push(vm.openEventReactWindow($event, event));

                    }

                    if (event.event_schedule_object) {

                        var notification_class = event.event_schedule_object.notification_class;

                        if (dontReactActionsIds.indexOf(notification_class) !== -1) {
                            return promises.push(vm.openEventDismissWindow($event, event));
                        }

                        if (applyDefaultActionsIds.indexOf(notification_class) !== -1) {
                            return promises.push(vm.openEventApplyDefaultWindow($event, event));
                        }

                    }

                }

            });


            Promise.all(promises).then(function () {
                $mdDialog.hide();

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        success: {
                            title: "",
                            description: "Events were successfully processed"
                        }
                    }

                });

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

            eventsService.getList({filters: filters}).then(function (data) {

                vm.events = data.results;

                vm.loading = false;

                $scope.$apply();

            })

        };

        vm.generateEvents = function ($event) {

            var promise = new Promise(function (resolve, reject) {

                if (vm.effective_date_from !== vm.effective_date_to) {

                    $mdDialog.show({
                        controller: 'WarningDialogController as vm',
                        templateUrl: 'views/warning-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            warning: {
                                title: 'Warning!',
                                description: 'It can take a long time, confirm?'
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHid: true,
                        multiple: true
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            resolve()
                        } else {
                            reject();
                        }
                    });

                } else {
                    resolve()
                }

            });

            promise.then(function (value) {

                vm.loading = true;

                var filters = {};

                filters.effective_date_0 = vm.effective_date_from;
                filters.effective_date_1 = vm.effective_date_to;

                eventsService.generateEventsRange({filters: filters}).then(function (eventsData) {

                    var len = eventsData.tasks_ids.length;
                    var time = 2000;

                    setTimeout(function () {

                        vm.requestEvents();

                    }, len * time)

                });

            }).catch(function (reason) {
                console.log(reason);
            })

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
                case 5:
                    return 'Book (default)';

            }

        };

        vm.openEventDismissWindow = function ($event, item) {

            return $mdDialog.show({
                controller: 'SuccessDialogController as vm',
                templateUrl: 'views/dialogs/event-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    success: {
                        title: "Event (Don't react)",
                        description: 'Nothing will be booked'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            })

        };

        vm.openEventApplyDefaultWindow = function ($event, item) {

            return $mdDialog.show({
                controller: 'EventApplyDefaultDialogController as vm',
                templateUrl: 'views/dialogs/event-apply-default-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        event: item
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            })

        };

        vm.openEventReactWindow = function ($event, item) {
            return $mdDialog.show({
                controller: 'EventDialogController as vm',
                templateUrl: 'views/dialogs/event-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        event: item
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