const masterUserBackupsService = require("../../services/masterUserBackupsService");
/**
 * Created by szhitenev on 27.08.2022.
 */
(function () {

    'use strict';

    var masterUserBackupsService = require('../../services/masterUserBackupsService');
    // var authorizerService = require('../../services/authorizerService');

    module.exports = function ($scope, $mdDialog, commonDialogsService, data) {

        console.log('data', data);

        var vm = this;

        vm.master_user = data.item;
        vm.selectedBackup = null;
        vm.createBackupBeforeRollback = true;

        vm.readyStatus = {
            data: false
        }

        vm.selectBackup = function (item){

            vm.items.forEach(function (backup){
                backup.is_selected = false;
            })

            item.is_selected = true;

            vm.selectedBackup = item;

        }

        vm.getBackupsList = function () {

            vm.readyStatus.data = false;

            masterUserBackupsService.getMasterUserBackupsList(vm.master_user.base_api_url).then(function (data) {

                vm.items = data.results;

                vm.items = vm.items.map(function (item) {

                    item.file_size_mb = Math.round(item.file_size / 1024 / 1024)

                    return item;
                })

                vm.readyStatus.data = true;
                $scope.$apply();
            });

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {


            const warningLocals = {
                warning: {
                    title: 'Warning',
                    description: 'Database ' + vm.masterUser.name + ' is going to be restored to previous version. All unsaved data will be lost.'
                }
            };

            commonDialogsService.warning(warningLocals, {targetEvent: $event}).then(function (res) {

                if (res.status === 'agree') {

                    masterUserBackupsService.rollbackFromBackup(vm.master_user.id, {master_user_backup_id: vm.backup.id, create_backup_before_rollback: vm.createBackupBeforeRollback}).then(function (data) {

                        console.log('data success', data);

                        $mdDialog.hide({status: 'agree', data: data});

                    })


                }
            })

        };

        vm.init = function () {

            vm.getBackupsList();

        }

        vm.init();

    }

}());