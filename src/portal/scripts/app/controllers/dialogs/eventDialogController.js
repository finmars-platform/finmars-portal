(function () {
    'use strict';

    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('id for event buttons', data);

        var vm = this;

        vm.event = data.event;

        vm.actionButtons = vm.event.event_schedule_object.actions;

        console.log('vm.event', vm.event);

        vm.eventAction = function ($event, actionId) {

            eventsService.getEventAction(vm.event.id, actionId).then(function (event) {

                console.log('event', event);

                eventsService.putEventAction(vm.event.id, actionId, event).then(function () {

                    $mdDialog.hide({status: 'agree'});

                }).catch(function () {
                    vm.cancel();
                })

            });
        };

        vm.skip = function () {
            $mdDialog.cancel();
        };

        vm.ignore = function () {

            eventsService.ignoreEventAction(vm.event.id).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };

    }

}());