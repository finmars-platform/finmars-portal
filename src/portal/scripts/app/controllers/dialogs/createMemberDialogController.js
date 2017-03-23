(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog) {
        var vm = this;

        vm.agree = function ($event) {

            membersAndGroupsService.create('members', {username: vm.memberName}).then(function (data) {

                if (data.status == 400) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: data.response
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                } else {
                    $mdDialog.hide({status: 'agree', data: {}});
                }
            });

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        }
    }
}());