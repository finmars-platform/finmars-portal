/**
 * Created by szhitenev on 04.10.2021.
 */
(function () {

    'use strict';

    // var authorizerService = require('../../services/authorizerService');
    var masterUserBackupsService = require('../../services/masterUserBackupsService');

    // var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, data, toastNotificationService, profileAuthorizerService) {

        var vm = this;
        vm.backup = data.backup;

        vm.name = vm.backup.name;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {

            vm.master_user.name = vm.name;

            masterUserBackupsService.updateMasterUserBackup(vm.backup.id, vm.backup).then(function (data) {

                toastNotificationService.success("Backup was successfully renamed");

                $mdDialog.hide({status: 'agree'});

            })

        };
    }

}());