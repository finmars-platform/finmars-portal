(function () {
    'use strict';

    var eventsService = require('../../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('id for event buttons', data);

        var vm = this;

        vm.event = data.event;

        vm.actionButtons = vm.event.event_schedule_object.actions;

        vm.availableForApplyDefault = false;

        vm.event.event_schedule_object.actions.forEach(function (item) {

            if (item.is_book_automatic) {
                vm.availableForApplyDefault = true;
            }

        });


        console.log('vm.event', vm.event);

        vm.eventAction = function ($event, action) {

            eventsService.getEventAction(vm.event.id, action.id).then(function (event) {

                console.log('event', event);

                var status = 4; // Booked (user, actions)

                if (action.is_sent_to_pending) {
                    status = 7; // 'Booked, pending (user, actions)';
                }

                eventsService.putEventAction(vm.event.id, action.id, event, status).then(function () {

                    $mdDialog.hide({status: 'agree'});

                }).catch(function (reason) {

                    console.log('reason', reason);

                    $mdDialog.show({
                        controller: 'InfoDialogController as vm',
                        templateUrl: 'views/info-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        locals: {
                            info: {
                                title: 'Error',
                                description: "Can't process event"
                            }
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true
                    })

                })

            });
        };

        vm.skip = function () {
            $mdDialog.hide();
        };

        vm.skipAll = function () {
            $mdDialog.hide({status: 'skip_all'});
        };

        vm.informed = function () {

            eventsService.informedEventAction(vm.event.id).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };


        vm.applyDefault = function ($event) {

            return $mdDialog.show({
                controller: 'EventWithReactApplyDefaultConfirmDialogController as vm',
                templateUrl: 'views/dialogs/events/event-with-react-apply-default-confirm-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        event: vm.event
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    $mdDialog.hide({status: 'agree'});
                }

            });

        };

    }

}());