/**
 * Created by szhitenev on 20.07.2020.
 */
(function(){

    'use strict';

    var usersService = require('../../services/usersService');

    module.exports = function LoginDialogController($scope, $mdDialog, data){

        var vm = this;

        vm.data = data;

        vm.processing = false;
        vm.error = false;

        vm.agree = function ($event) {

            vm.processing = true;

            usersService.login(vm.username, vm.password).then(function (data) {

                if (!data.two_factor_check) {

                    $mdDialog.hide({status: 'agree'});

                    return;

                }

                vm.processing = false;

                $scope.$apply();

                $mdDialog.show({
                    controller: 'twoFactorLoginDialogController as vm',
                    templateUrl: 'views/dialogs/two-factor-login-dialog-view.html',
                    parent: angular.element(document.body),
                    locals: {
                        username: vm.username
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    targetEvent: $event
                }).then(function (res) {

                    if (res.status === 'agree') {

                        $mdDialog.hide({status: 'agree'});

                    }

                });

            }).catch(function(error){

                vm.processing = false;

                vm.error = true;

                $scope.$apply();


            })


        };
    }

}());