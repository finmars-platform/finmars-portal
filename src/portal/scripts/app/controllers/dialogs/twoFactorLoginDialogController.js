/**
 * Created by vzubr on 06.08.2020.
 */
(function () {

    'use strict';

    var twoFactorService = require('../../../../../profile/scripts/app/services/twoFactorServce');
    var cookieService = require('../../../../../core/services/cookieService').default;

    module.exports = function ($scope, $mdDialog, username, password) {

        var vm = this;

        vm.username = username;
        vm.password = password;

        vm.codeIsValid = false;
        vm.securityCode = null;

        vm.agree = function () {
            $mdDialog.hide({
                status: 'agree', data: {
                    'access_token': vm.access_token,
                    'refresh_token': vm.refresh_token
                }
            });
        };


        vm.validateCode = function () {

            vm.codeIsValid = false;
            vm.codeIsChecked = false;

            if (vm.securityCode && vm.securityCode.length === 6) {

                twoFactorService.validateCode({
                    code: vm.securityCode,
                    username: vm.username,
                    password: vm.password
                }).then(function (data) {

                    vm.codeIsChecked = true

                    if (data.access_token) {

                        vm.codeIsValid = true

                        $mdDialog.hide({
                            status: 'agree', data: data
                        });
                    }

                    $scope.$apply();

                })
            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


    }

}());