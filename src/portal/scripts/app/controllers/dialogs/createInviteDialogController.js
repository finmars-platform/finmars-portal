(function () {

    'use strict';

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.username = '';

        vm.groupsList = [];
        vm.assignedGroupsList = [];

        vm.readyStatus = {content: false};

        vm.agree = function ($event) {

            var groups = vm.assignedGroupsList.map(function (group) {
                return group.id
            });


            membersAndGroupsService.inviteUser({username: vm.username, groups: groups}).then(function (data) {

                console.log('data', data);

                $mdDialog.show({
                    controller: 'SuccessDialogController as vm',
                    templateUrl: 'views/dialogs/success-dialog-view.html',
                    locals: {
                        success: {
                            title: "",
                            description: "You successfully send an invitation"
                        }
                    },
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true
                }).then(function () {
                    $mdDialog.hide({status: 'agree'});
                });

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: data
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true
                }).then(function () {
                    $mdDialog.hide({status: 'agree'});
                });

            })

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.init = function () {

            membersAndGroupsService.getGroupsList().then(function (data) {

                vm.groupsList = data.results;

                vm.groupsList = vm.groupsList.filter(function (group) {

                    if (group.name === 'Guests') {
                        vm.assignedGroupsList.push(group);

                        return false;
                    }
                    return true;

                });

                vm.readyStatus.content = true;

                $scope.$apply();

            });

        };

        vm.init();

    }
}());