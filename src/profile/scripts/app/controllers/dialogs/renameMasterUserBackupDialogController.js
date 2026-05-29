'use strict';

// var authorizerService = require('../../services/authorizerService');
import masterUserBackupsService from '../../services/masterUserBackupsService';

// var toastNotificationService = require('../../../../../core/services/toastNotificationService');

export default function ($scope, $mdDialog, data, toastNotificationService, profileAuthorizerService) {

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
};