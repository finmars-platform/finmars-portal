(function () {
    'use strict';


    var eventsService = require('../../../services/eventsService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.event = data.event;

        console.log('vm.event', vm.event);

        vm.skip = function () {
            $mdDialog.hide();
        };

        vm.informed = function () {

            eventsService.informedEventAction(vm.event.id).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };

    }

}());