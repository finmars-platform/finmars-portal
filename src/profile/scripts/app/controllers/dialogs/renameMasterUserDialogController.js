/**
 * Created by szhitenev on 28.11.2019.
 */
(function () {

    'use strict';

    var usersService = require('../../services/usersService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;
        vm.master_user = data.master_user;

        vm.name = vm.master_user.name;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.master_user.name = vm.name;

            usersService.updateMaster(vm.master_user.id, vm.master_user).then(function (data) {

                toastNotificationService.success("Database was successfully renamed");

                $mdDialog.hide({status: 'agree'});

            })

        };
    }

}());