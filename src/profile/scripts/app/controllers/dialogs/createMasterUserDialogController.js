/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var usersService = require('../../services/usersService');

    module.exports = function ($scope, $mdDialog) {


        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            usersService.createMasterUser({name: vm.name}).then(function () {

                $mdDialog.hide({status: 'agree'});

            })

        };
    }

}());