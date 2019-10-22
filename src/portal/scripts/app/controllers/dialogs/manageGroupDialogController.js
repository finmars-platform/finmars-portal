(function () {

    'use strict';

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog, groupId) {

        var vm = this;

        vm.membersList = [];
        vm.assignedMembersList = [];

        vm.group = null;

        vm.readyStatus = {content: false};

        vm.getData = function () {

            membersAndGroupsService.getGroupByKey(groupId).then(function (data) {

                vm.group = data;

                membersAndGroupsService.getMembersList().then(function (data) {

                    vm.membersList = data.results;

                    var assignedMembersIds = vm.group.members;

                    if (assignedMembersIds && assignedMembersIds.length > 0) {

                        assignedMembersIds.map(function (assignedId) {

                            vm.membersList.map(function (member, memberIndex) {

                                var memberId = member['id'];

                                if (memberId === assignedId) {

                                    vm.membersList.splice(memberIndex, 1);
                                    vm.assignedMembersList.push(member);

                                }

                            });
                        });
                    }

                    console.log('vm.membersList', vm.membersList);
                    console.log('vm.assignedMembersList', vm.assignedMembersList);

                    vm.readyStatus.content = true;

                    $scope.$apply();
                });

            });

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function () {

            vm.group.members = vm.assignedMembersList.map(function (group) {
                return group.id
            });

            membersAndGroupsService.updateGroup(vm.group.id, vm.group).then(function () {
                $mdDialog.hide({status: 'agree'});
            });

        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();
    }

}());