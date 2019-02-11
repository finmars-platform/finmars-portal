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

            usersService.getMasterList().then(function (data) {
                vm.masters = data.results;
                vm.readyStatus.masterUsers = true;
                $scope.$apply();
            });

        };

        vm.getInvites = function () {

            vm.readyStatus.invites = false;

            usersService.getInviteToMasterUserList().then(function (data) {

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
                targetEvent: $event,
            }).then(function (value) {

                vm.getMasterUsersList();

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
            }).then(function (value) {

                usersService.leaveMasterUserList(item.id).then(function () {

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

            usersService.updateInviteToMasterUserByKey(item.id, item).then(function () {

                vm.getInvites();

            })

        };

        vm.acceptInvite = function (item) {

            item.status = 1; // Accept code

            usersService.updateInviteToMasterUserByKey(item.id, item).then(function () {

                usersService.setMasterUser(item.to_master_user.id).then(function (value) {
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