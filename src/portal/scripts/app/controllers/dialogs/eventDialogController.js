(function () {
    'use strict';

    var logService = require('../../../../../core/services/logService');
    var eventsService = require('../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('id for event buttons', data);

        var vm = this;

        vm.event = data.event;

        vm.actionButtons = vm.event.event_schedule_object.actions;

        console.log('vm.event', vm.event);

        var eventId = data.eventId;

        vm.eventAction = function ($event, actionId) {

            eventsService.getEventAction(vm.event.id, actionId).then(function (event) {

                console.log('event', event);

                eventsService.putEventAction(vm.event.id, actionId, event).then(function () {
                    console.log('event action done');
                    vm.cancel();
                }).catch(function () {
                    vm.cancel();
                })

            });
        };

        vm.ignore = function () {

            eventsService.ignoreEventAction(vm.event.id).then(function () {
                console.log('event action done');
                vm.cancel();
            });

        };

    }

}());