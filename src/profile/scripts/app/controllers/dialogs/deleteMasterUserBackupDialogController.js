/**
 * Created by szhitenev on 04.10.2021.
 */
(function () {

    'use strict';

    // var authorizerService = require('../../services/authorizerService');
    var masterUserBackupsService = require('../../services/masterUserBackupsService');

    // var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, data, toastNotificationService, profileAuthorizerService, commonDialogsService) {

        var vm = this;

        vm.processing = false;

        vm.backup = data.backup;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            vm.processing = true;

            masterUserBackupsService.deleteMasterUserBackup(vm.backup.id).then(function () {

                vm.processing = false;

                $scope.$apply();

                toastNotificationService.success("Ecosystem " + vm.backup.name + ' was deleted');

                $mdDialog.hide({status: 'agree'});

            }).catch(function (error) {

                vm.processing = false;
                $scope.$apply();

            })

        };
    }

}());