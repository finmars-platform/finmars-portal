(function () {

    'use strict';

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.group = {
            name: '',
            is_public: false,
            members: []
        };

        vm.membersList = [];
        vm.assignedMembersList = [];

        vm.processing = false;

        vm.readyStatus = {content: false};

        vm.getData = function(){

            membersAndGroupsService.getMembersList().then(function (data) {

                vm.membersList = data.results;

                console.log('vm.membersList', vm.membersList);

                vm.readyStatus.content = true;

                $scope.$apply();
            });

        };

        vm.agree = function () {

            vm.processing = true;

            vm.group.members = vm.assignedMembersList.map(function (group) {
                return group.id
            });

            membersAndGroupsService.createGroup(vm.group).then(function () {

                vm.processing = false;

                $mdDialog.hide({status: 'agree'});

            })

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.init = function () {

            vm.getData();

        };

        vm.init();

    }
}());