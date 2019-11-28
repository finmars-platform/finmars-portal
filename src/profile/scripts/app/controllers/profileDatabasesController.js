/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var usersService = require('../services/usersService');

    module.exports = function ($scope, $state, $mdDialog) {

        var vm = this;

        vm.readyStatus = {masterUsers: false, invites: false};

        vm.getMasterUsersList = function () {

            vm.readyStatus.masterUsers = false;

            usersService.getMasterListLight().then(function (data) {
                vm.masters = data.results;
                vm.readyStatus.masterUsers = true;
                $scope.$apply();
            });

        };

        vm.getInvites = function () {

            vm.readyStatus.invites = false;

            var status = 0; // 0 - SENT, 1 - ACCEPTED, 2 - DECLINED

            usersService.getInviteFromMasterUserList(status).then(function (data) {

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

            usersService.setMasterUser(item.id).then(function (value) {
                $state.go('app.home');
            })

        };

        vm.leaveMasterUser = function ($event, item) {

            $mdDialog.show({
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
            }).then(function (res) {

                if (res.status === 'agree') {

                    usersService.leaveMasterUser(item.id).then(function () {

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
            }).then(function (value) {

                usersService.deleteMasterUser(item.id).then(function () {

                    vm.getMasterUsersList();

                })

            })


        };

        vm.updateDescription = function (item) {

            item.description = item.description_tmp;

            usersService.updateMaster(item.id, item).then(function (data) {

                item.description_tmp = '';
                item.descriptionEdit = false;

                $scope.$apply();

            })

        };

        vm.declineInvite = function (item) {

            item.status = 2; // Decline code

            usersService.updateInviteFromMasterUserByKey(item.id, item).then(function () {

                vm.getInvites();

            })

        };

        vm.acceptInvite = function (item) {

            item.status = 1; // Accept code

            usersService.updateInviteFromMasterUserByKey(item.id, item).then(function () {

                usersService.setMasterUser(item.to_master_user).then(function (value) {
                    $state.go('app.setup');
                })

            })

        };

        vm.init = function () {
            vm.getMasterUsersList();
            vm.getInvites();
        };

        vm.init();


    }

}());