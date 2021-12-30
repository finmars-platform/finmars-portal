/**
 * Created by vzubr on 06.08.2020.
 */
(function () {

    'use strict';

    var twoFactorService = require('../../../../../profile/scripts/app/services/twoFactorServce');
    var cookieService = require('../../../../../core/services/cookieService');

    module.exports = function ($scope, $mdDialog, username) {

        var vm = this;

        vm.username = username;

        vm.codeIsValid = false;
        vm.securityCode = null;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', token: vm.token});
        };


        vm.validateCode = function () {

			vm.codeIsValid = false;
            vm.codeIsChecked = false;

            if (vm.securityCode && vm.securityCode.length === 6) {

                twoFactorService.validateCode({code: vm.securityCode, username: vm.username}).then(function (data) {

                    vm.codeIsChecked = true

                    if (data.token) {

                        var domain = "." +
                            location.hostname.split('.').reverse()[1] + "." +
                            location.hostname.split('.').reverse()[0]

                        var options = {
                            'domain': domain,
                            'path': '/'
                        }

                        vm.token = data.token;

                        cookieService.setCookie('authtoken', data.token, options);
                    }


                    vm.codeIsValid = data.match;

                    $scope.$apply();

                })
            }

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };


    }

}());