/**
 * Created by vzubr on 06.08.2020.
 */
(function () {

    'use strict';

    var twoFactorService = require('../../../../../profile/scripts/app/services/twoFactorServce');

    module.exports = function ($scope, $mdDialog, username) {

        var vm = this;

        vm.username = username;

        vm.codeIsValid = false;
        vm.securityCode = null;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };


        vm.validateCode = function () {

            if (vm.securityCode && vm.securityCode.length === 6) {

                twoFactorService.validateCode({code: vm.securityCode, username: vm.username}).then(function (data) {


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