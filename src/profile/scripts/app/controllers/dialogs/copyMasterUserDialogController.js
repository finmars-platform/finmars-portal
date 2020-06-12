/**
 * Created by szhitenev on 11.05.2020.
 */
(function () {

    'use strict';

    var usersService = require('../../services/usersService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');


    module.exports = function copyMasterUserDialogController($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.referenceMasterUser = data.referenceMasterUser;

        vm.processing = false;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

            vm.processing = true;

            usersService.copyMasterUser({name: vm.name, reference_master_user: vm.referenceMasterUser.id}).then(function (data) {

                console.log('data success', data);

                vm.processing = false;
                $scope.$apply();

                toastNotificationService.success("Database " + vm.name + ' was successfully created');

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

                console.log('reason', reason);

                vm.processing = false;
                $scope.$apply();

                $mdDialog.show({
                    controller: 'ProfileInfoDialogController as vm',
                    templateUrl: 'views/dialogs/info-dialog-view.html',
                    parent: angular.element(document.body),
                    locals: {
                        data: {
                            title: 'Warning!',
                            description: "Something went wrong"
                        }
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    targetEvent: $event
                })
            })

        };
    }

}());