// import crossTabEvents from "../../../../shell/scripts/app/services/events/crossTabEvents";

/**
 * Created by szhitenev on 04.10.21.
 */
(function () {

    'use strict';

    // var usersService = require('../services/usersService');
    // var authorizerService = require('../services/authorizerService');

    var baseUrlService = require('../services/baseUrlService');
    var masterUserBackupsService = require('../services/masterUserBackupsService');
    // var portalBaseUrlService = require('../../../scripts/app/services/baseUrlService');

    var toastNotificationService = require('../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $state, $mdDialog, redirectionService) {

        var vm = this;

        vm.readyStatus = {data: false};

        vm.getFileUrl = function (id) {

            const authorizerUrl = baseUrlService.getAuthorizerUrl();

            return authorizerUrl + '/master-user-backups/' + id + '/view/';

        };

        vm.getBackupsList = function () {

            vm.readyStatus.data = false;

            masterUserBackupsService.getMasterUserBackupsList().then(function (data) {
                vm.items = data.results;

                vm.items = vm.items.map(function (item) {

                    item.download_url = vm.getFileUrl(item.id)
                    item.file_size_mb = Math.round(item.file_size / 1024 / 1024)

                    return item;
                })

                vm.readyStatus.data = true;
                $scope.$apply();
            });

        };

        vm.renameBackup = function ($event, item) {

            $mdDialog.show({
                controller: 'RenameMasterUserBackupDialogController as vm',
                templateUrl: 'views/dialogs/rename-master-user-backup-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        backup: Object.assign({}, item)
                    }
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getBackupsList();
                }

            })

        };

        vm.activateBackup = function ($event, item) {
            console.log("Create Database");

            $mdDialog.show({
                controller: 'RestoreMasterUserFromBackupDialogController as vm',
                templateUrl: 'views/dialogs/restore-master-user-from-backup-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        backup: item
                    }
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {

                    toastNotificationService.success(res.data.message)
                    vm.getBackupsList();
                }

            })
        }

        vm.deleteBackup = function ($event, item) {

            $mdDialog.show({
                controller: 'DeleteMasterUserBackupDialogController as vm',
                templateUrl: 'views/dialogs/delete-master-user-backup-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        backup: item
                    }
                },
                targetEvent: $event

            }).then(res => {

                if (res.status === 'agree') {
                    // $state.go('app.profile', {}, {reload: 'app'})
					window.open(redirectionService.getUrlByState('app.profile'), '_self');
                }

            });


        };

        vm.init = function () {

            vm.getBackupsList();

        };

        vm.init();


    }

}());