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

        vm.processAction = function (action) {

            return new Promise(function (resolve, reject) {

                eventsService.getEventAction(vm.event.id, action.id).then(function (event) {

                    eventsService.putEventAction(vm.event.id, action.id, event).then(function (data) {

                        resolve(data)

                    }).catch(function () {
                        vm.error = true;
                        vm.errorActionText = action.display_text;
                    })

                });

            })


        };

        vm.process = function () {

            var promises = [];

            vm.event.event_schedule_object.actions.forEach(function (action) {

                promises.push(vm.processAction(action))

            });

            Promise.all(promises).then(function (value) {

                $mdDialog.hide({status: 'agree'});

            })

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