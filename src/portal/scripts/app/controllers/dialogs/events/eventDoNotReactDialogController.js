(function () {
    'use strict';


    var instrumentEventService = require('../../../services/instrumentEventService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.event = data.event;

        console.log('vm.event', vm.event);

        vm.skip = function () {
            $mdDialog.hide();
        };

        vm.skipAll = function(){
            $mdDialog.hide({status: 'skip_all'});
        };

        vm.informed = function () {

            instrumentEventService.informedEventAction(vm.event.id).then(function () {

                $mdDialog.hide({status: 'agree'});

            });

        };

    }

}());