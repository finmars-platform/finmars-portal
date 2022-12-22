import crossTabEvents from "../../../../shell/scripts/app/services/events/crossTabEvents";

/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    // var usersService = require('../services/usersService');
    // var authorizerService = require('../services/authorizerService');

    var baseUrlService = require('../services/baseUrlService');
    // var portalBaseUrlService = require('../../../scripts/app/services/baseUrlService');

    var toastNotificationService = require('../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $state, $mdDialog, $urlService, profileAuthorizerService, broadcastChannelService, commonDialogsService, globalDataService, redirectionService) {

        var vm = this;

        vm.readyStatus = {masterUsers: false, invites: false};

        vm.copyMasterUserTask;

        vm.getMasterUsersList = function () {

            vm.readyStatus.masterUsers = false;

            profileAuthorizerService.getMasterUsersList().then(function (data) {
                vm.masterUsers = data.results;
                vm.readyStatus.masterUsers = true;
                $scope.$apply();
            });

        };

        vm.getInvites = function () {

            vm.readyStatus.invites = false;

            var status = 0; // 0 - SENT, 1 - ACCEPTED, 2 - DECLINED

            profileAuthorizerService.getInviteFromMasterUserList(status).then(function (data) {

                vm.invites = data.results;
                vm.readyStatus.invites = true;
                $scope.$apply();

            })

        };

        vm.createDatabase = function ($event) {

            $mdDialog.show({
                controller: 'CreateMasterUserDialogController as vm',
                templateUrl: 'views/dialogs/create-master-user-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        ecosystemConfigurations: vm.ecosystemConfigurations
                    }
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getMasterUsersList();
                }

            })

        };

        vm.renameMasterUser = function ($event, item) {

            $mdDialog.show({
                controller: 'RenameMasterUserDialogController as vm',
                templateUrl: 'views/dialogs/rename-master-user-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        master_user: Object.assign({}, item)
                    }
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getMasterUsersList();
                }

            })

        };

        vm.activateDatabase = function (item) {

            // console.log('item', item);
            const masterUserUrl = `${window.location.origin}/${item.base_api_url}/a/#!/`;
            window.open(masterUserUrl, '_self');

        };

        vm.createDatabaseFromBackup = function ($event) {
            console.log("Create Database");

            $mdDialog.show({
                controller: 'CreateMasterUserFromDumpDialogController as vm',
                templateUrl: 'views/dialogs/create-master-user-from-dump-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {}
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getMasterUsersList();
                }

            })
        }

        vm.rollbackMasterUserFromBackup = function ($event, item) {

            $mdDialog.show({
                controller: 'RollbackMasterUserFromBackupDialogController as vm',
                templateUrl: 'views/dialogs/rollback-master-user-from-backup-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        item: item
                    }
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getMasterUsersList();
                }

            })

        }

        vm.exportMasterUserBackup = function ($event, item) {

            profileAuthorizerService.exportToBackup(item.id).then(function (data) {

                toastNotificationService.info(data.message)

            })

        };

        vm.leaveMasterUser = function ($event, item) {

            /* $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    warning: {
                        title: 'Warning!',
                        description: "Are you sure to leave from " + item.name + ' database?'
                    }
                },
                targetEvent: $event
            }) */
            const locals = {
                warning: {
                    title: 'Warning!',
                    description: "Are you sure to leave from " + item.name + ' database?'
                }
            };

            commonDialogsService.warning(locals, {targetEvent: $event}).then(res => {

                if (res.status === 'agree') {

                    profileAuthorizerService.leaveMasterUser(item.id).then(function () {

                        vm.getMasterUsersList();

                    })

                }

            })


        };

        vm.deleteMasterUser = function ($event, item) {

            $mdDialog.show({
                controller: 'DeleteMasterUserDialogController as vm',
                templateUrl: 'views/dialogs/delete-master-user-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        masterUser: item
                    }
                },
                targetEvent: $event

            }).then(res => {

                if (res.status === 'agree') {
                    // $state.go('app.profile', {}, {reload: 'app'})
					window.open(redirectionService.getUrl('app.profile'), '_self');
                }

            });


        };

        vm.copyMasterUser = function ($event, item) {

            $mdDialog.show({
                controller: 'CopyMasterUserDialogController as vm',
                templateUrl: 'views/dialogs/copy-master-user-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    data: {
                        referenceMasterUser: item
                    }
                },
                targetEvent: $event
            });
            /* Master user copy starts inside CopyMasterUserDialogController
            .then(function (res) {

                if (res.status === 'agree') {


                    if (res.data && res.data.task) {

                        vm.copyMasterUserTask = res.data.task;

                        vm.initTaskStatusPolling();

                    }

                }

            }) */

        };

        vm.initTaskStatusPolling = function () {

            vm.getTaskInfo()

        };

        vm.getTaskInfo = function () {

            profileAuthorizerService.copyMasterUser(vm.copyMasterUserTask).then(function (data) {

                vm.copyMasterUserTask = data;

                console.log('vm.copyMasterUserTask', vm.copyMasterUserTask);

                $scope.$apply();

                if (vm.copyMasterUserTask.task_status === 'SUCCESS') {

                    vm.getMasterUsersList();

                } else {

                    setTimeout(function () {

                        vm.getTaskInfo();

                    }, 1000)

                }

            })

        };

        vm.updateDescription = function (item) {

            item.description = item.description_tmp;

            profileAuthorizerService.updateMasterUser(item.id, item).then(function (data) {

                item.description_tmp = '';
                item.descriptionEdit = false;

                $scope.$apply();

            })

        };

        vm.declineInvite = function (item) {

            item.status = 2; // Decline code

            profileAuthorizerService.updateInviteFromMasterUserByKey(item.id, item).then(function () {

                vm.getInvites();

            })

        };

        // DEPRECATED, logic moved to vue app
        vm.acceptInvite = function (item) {

            item.status = 1; // Accept code

            profileAuthorizerService.updateInviteFromMasterUserByKey(item.id, item).then(function () {

                // vm.getMasterUsersList();
                // vm.getInvites();

                localStorage.setItem('goToSetup', 'true')

                /*profileAuthorizerService.setCurrentMasterUser(item.to_master_user).then(function (data) {

                    console.log('vm.activateDatabase.data', data);


                    baseUrlService.setMasterUserPrefix(data.base_api_url);
                    // portalBaseUrlService.setMasterUserPrefix(data.base_api_url);

                    window.location.href = '/' + data.base_api_url + '/a/#!/'

                })*/
                const masterUserUrl = `${window.location.origin}/${item.to_master_user.base_api_url}/v/home`;
                window.open(masterUserUrl, '_self');

            })

        };

        vm.redeployMasterUser = function ($event, item){

            profileAuthorizerService.redeployMasterUser(item.base_api_url).then(function (){
                vm.getMasterUsersList();
            })

        }

        vm.startMasterUser = function ($event, item) {
            profileAuthorizerService.startMasterUser(item.base_api_url).then(function (){
                vm.getMasterUsersList();
            })
        }

        vm.stopMasterUser = function ($event, item) {
            profileAuthorizerService.stopMasterUser(item.base_api_url).then(function (){
                vm.getMasterUsersList();
            })
        }

        vm.init = function () {
            vm.getMasterUsersList();
            vm.getInvites();


            // vm.readyStatus.invites = true;
        };

        vm.init();


    }

}());