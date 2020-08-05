/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var twoFactorService = require('../../services/twoFactorServce');
    var usersService = require('../../services/usersService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.currentStep = 1;
        vm.codeIsValid = false;
        vm.provisioning_uri = null;
        vm.securityCode = null;
        vm.isShowAuthenticatorApps = false;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.generateQrCode = function () {

            console.log('provisioning_uri', vm.provisioning_uri);

            var qr = new QRious({
                element: document.querySelector('.code-holder'),
                value: vm.provisioning_uri,
                size: 256
            });

            document.querySelector('.code-holder').append(qr.image)


        };


        vm.generateToken = function () {

            twoFactorService.generateCode().then(function (data) {

                vm.provisioning_uri = data.provisioning_uri;

                vm.generateQrCode();

                $scope.$apply();

            })

        };

        vm.validateCode = function () {

            if (vm.securityCode && vm.securityCode.length === 6) {

                twoFactorService.validateCode({code: vm.securityCode, username: vm.user.username}).then(function (data) {

                    vm.codeIsValid = data.match;

                    $scope.$apply();

                })
            }

        };

        vm.getUser = function () {

            usersService.getByKey(0).then(function (data) {
                vm.user = data;

                vm.generateToken();

                $scope.$apply();
            });


        };


        vm.init = function () {

            vm.getUser();


        };

        vm.init();
    }

}());