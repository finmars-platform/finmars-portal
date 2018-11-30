(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var membersAndGroupsService = require('../../services/membersAndGroupsService');

    module.exports = function ($scope, $mdDialog) {
        var vm = this;

        vm.agree = function ($event) {

            membersAndGroupsService.inviteUser(vm.memberName).then(function (data) {

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
                        $mdDialog.hide({res: 'agree'});
                    });
                }
            });

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        }
    }
}());