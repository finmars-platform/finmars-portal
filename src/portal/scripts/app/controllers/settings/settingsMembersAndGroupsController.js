(function () {

    'use strict';


    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function settingsMembersAndGroupsController($scope, $mdDialog) {

        var vm = this;

        vm.members = [];
        vm.groups = [];

        vm.readyStatus = {content: false};

        vm.getData = function () {

            vm.readyStatus.content = false;

            membersAndGroupsService.getMembersList().then(function (data) {

                vm.members = [];
                vm.members = data.results;

                membersAndGroupsService.getGroupsList().then(function (data) {

                    vm.groups = data.results;

                    vm.members.map(function (member) {

                        var groupsOfMember = member['groups'];

                        if (groupsOfMember && groupsOfMember.length > 0) {

                            member.assigned_groups = [];

                            groupsOfMember.map(function (memberGroupId) {
                                vm.groups.map(function (group) {
                                    if (group['id'] === memberGroupId) {
                                        member.assigned_groups.push(group);
                                    }
                                });
                            });

                            member.assigned_groups_pretty = member.assigned_groups.map(function (group) {
                                return group.name
                            }).join(', ')

                        }

                    });

                    membersAndGroupsService.getInvitesList().then(function (data) {

                        vm.invites = data.results;

                        vm.invites  = vm.invites.map(function (item) {

                            item.assigned_groups_pretty = item.groups_object.map(function (group) {
                                return group.name
                            }).join(', ');

                            return item;

                        });

                        vm.readyStatus.content = true;

                        $scope.$apply();

                    })
                });
            });
        };

        vm.deleteGroup = function ($event, group) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete group <b>" + group.name + "</b>?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    membersAndGroupsService.deleteGroupByKey(group.id).then(function () {

                        vm.getData();

                    });

                }

            });

        };

        vm.deleteMember = function ($event, member) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete member <b>" + member.username + "</b>?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    membersAndGroupsService.deleteMemberByKey(member.id).then(function () {

                        vm.getData();

                    });

                }
            })

        };

        vm.inviteMember = function (ev) {

            $mdDialog.show({
                controller: 'CreateInviteDialogController as vm',
                templateUrl: 'views/dialogs/create-invite-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (res) {

                console.log('res', res);

                if (res && res.status === 'agree') {

                    vm.getData();

                }

            });

        };

        vm.createGroupDialog = function (ev) {

            $mdDialog.show({
                controller: 'CreateGroupDialogController as vm',
                templateUrl: 'views/dialogs/create-group-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    vm.getData();

                }

            });

        };

        vm.manageMemberDialog = function (ev, memberId) {

            $mdDialog.show({
                controller: 'ManageMemberDialogController as vm',
                templateUrl: 'views/dialogs/manage-member-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    memberId: memberId
                }
            }).then(function (res) {

                if (res && res.status === 'agree') {
                    vm.getData();
                }

            });

        };

        vm.manageGroupDialog = function (ev, groupId) {

            $mdDialog.show({
                controller: 'ManageGroupDialogController as vm',
                templateUrl: 'views/dialogs/manage-group-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    groupId: groupId
                }
            }).then(function (res) {

                if (res && res.status === 'agree') {
                    vm.getData();
                }

            });

        };

        vm.getInviteStatus = function(item){

            if (item.status === 0){
                return "Sent"
            }

            if (item.status === 1){
                return "Accepted"
            }

            if (item.status === 2){
                return "Declined"
            }

            return "Unknown";

        };

        vm.deleteInvite = function($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    warning: {
                        title: 'Warning',
                        description: "Are you sure you want to delete this invite?"
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    membersAndGroupsService.deleteInviteByKey(item.id).then(function () {

                        vm.getData();

                    })


                }
            })

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();

    }
}());