(function () {
    'use strict';

    var eventsService = require('../../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('id for event buttons', data);

        var vm = this;

        vm.event = data.event;

        vm.actionButtons = vm.event.event_schedule_object.actions;

        console.log('vm.event', vm.event);

        vm.eventAction = function ($event, actionId) {

            eventsService.getEventAction(vm.event.id, actionId).then(function (event) {

                console.log('event', event);

                event.status = 4; // Booked (user, actions)

                eventsService.putEventAction(vm.event.id, actionId, event).then(function () {

                    $mdDialog.hide({status: 'agree'});

                }).catch(function () {
                    vm.cancel();
                })

            });
        };

        vm.skip = function () {
            $mdDialog.hide();
        };

        vm.informed = function () {

            eventsService.informedEventAction(vm.event.id).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };

        vm.applyDefault = function () {

            var promises = [];

            var actions = vm.event.event_schedule_object.actions.filter(function (action) {
                return action.is_book_automatic === true;
            });

            actions.forEach(function (action) {

                promises.push(new Promise(function (resolve) {

                    eventsService.getEventAction(vm.event.id, action.id).then(function (event) {

                        console.log('event', event);

                        event.status = 5; // 'Booked (user, default)';

                        eventsService.putEventAction(vm.event.id, action.id, event).then(function () {

                            resolve(action);

                        })
                    });

                }))

            });

            Promise.all(promises).then(function () {
                $mdDialog.hide({status: 'agree'});
            })

        };

    }

}());