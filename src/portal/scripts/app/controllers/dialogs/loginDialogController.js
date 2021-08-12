/**
 * Created by szhitenev on 20.07.2020.
 *
 * Deprecated with creation of separate page of authentication 'app.authentication'.
 *
 */
(function(){

    'use strict';

    // var authorizerService = require('../../services/authorizerService');
    var cookieService = require('../../../../../core/services/cookieService');


    module.exports = function LoginDialogController($scope, $mdDialog, data, authorizerService){

        var vm = this;

        vm.data = data;

        vm.processing = false;
        vm.error = false;

        vm.agree = function ($event) {

            vm.processing = true;

            authorizerService.tokenLogin(vm.username, vm.password).then(function (data) {

                console.log('authorizerService.login.data', data);

                if (data.token) {
                    console.log('authorizerService.login.setCookie auth token', data.token);
                    cookieService.setCookie('authtoken', data.token);
                }


                if (!data.two_factor_check) {

                    $mdDialog.hide({status: 'agree'});

                    return;

                }


                vm.processing = false;

                $scope.$apply();

                $mdDialog.show({
                    controller: 'TwoFactorLoginDialogController as vm',
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

                cookieService.deleteCookie('authtoken');

                vm.processing = false;

                vm.error = true;

                $scope.$apply();


            })


        };
    }

}());