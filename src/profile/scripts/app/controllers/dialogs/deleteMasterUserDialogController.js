/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var usersService = require('../../services/usersService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.processing = false;

        vm.masterUser = data.masterUser;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
                locals: {
                    warning: {
                        title: 'Confirmation',
                        description: 'Database ' + vm.masterUser.name + ' is going to be deleted.'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {

                    vm.processing = true;

                    usersService.deleteMasterUser(vm.masterUser.id).then(function () {

                        vm.processing = false;

                        $scope.$apply();

                        toastNotificationService.success("Ecosystem " + vm.masterUser.name + ' was deleted');

                        $mdDialog.hide({status: 'agree'});

                    }).catch(function (error) {

                        vm.processing = false;
                        $scope.$apply();

                    })
                }

            })


        };
    }

}());