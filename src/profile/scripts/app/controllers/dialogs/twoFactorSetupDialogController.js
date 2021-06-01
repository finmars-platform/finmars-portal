/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var twoFactorService = require('../../services/twoFactorServce');
    // var authorizerService = require('../../services/authorizerService');

    module.exports = function ($scope, $mdDialog, data, globalDataService) {

        var vm = this;

        vm.readyStatus = false;
        vm.currentStep = 1;
        vm.codeIsValid = false;
        vm.provisioning_uri = null;
        vm.token_id = null;
        vm.securityCode = null;
        vm.isShowAuthenticatorApps = false;

        let user;

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

                vm.token_id = data.token_id;

                vm.provisioning_uri = data.provisioning_uri;

                vm.generateQrCode();

                vm.readyStatus = true;

                $scope.$apply();

            })

        };

        vm.validateCode = function () {

            if (vm.securityCode && vm.securityCode.length === 6) {

				user = globalDataService.getUser();

                twoFactorService.validateCode({
                    code: vm.securityCode,
                    username: user.username
                }).then(function (data) {

                    vm.codeIsValid = data.match;

                    twoFactorService.pachByKey(data.id, {is_active: true}).then(function (value) {

                        $scope.$apply();

                    })

                    if (vm.token_id) {

                        twoFactorService.activateTwoFactor(vm.token_id);

                    }

                })
            }

        };

        /* vm.getUser = function () {

			 authorizerService.getUserByKey(0).then(function (data) {
                vm.user = data;

                vm.generateToken();

                $scope.$apply();
            });


        }; */


        vm.init = function () {

			vm.readyStatus = false;
            // vm.getUser();
			user = globalDataService.getUser();
			vm.generateToken();

        };

        vm.init();
    }

}());