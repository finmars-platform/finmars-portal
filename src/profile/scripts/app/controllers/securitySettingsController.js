/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    // var authorizerService = require('../services/authorizerService');
    const twoFactorService = require('../services/twoFactorServce');

    module.exports = function ($scope, $mdDialog, authorizerService, globalDataService, commonDialogsService) {

        let vm = this;

        // vm.readyStatus = {user: false};

        let user;
        vm.twoFactorVerification = false;

        /* vm.getUser = function () {

			authorizerService.getUserByKey(0).then(function (data) {
                vm.user = data;
                vm.readyStatus.user = true;
                $scope.$apply();
            });


        }; */

        vm.getLink = function (){

            var link = 'https://auth.finmars.com/realms/finmars/account/#/security/signingin';

            if (window.location.host.indexOf('marscapital') !== -1) {
                var link = 'https://marscapital-auth.finmars.com/realms/marscapital/account/#/security/signingin';
            }

            return link;

        }

        vm.updateUser = function (twoFactorVerificationState) {

			user = globalDataService.getUser();
        	user.two_factor_verification = twoFactorVerificationState;

			authorizerService.updateUser(user.id, user).then(function () {
                $scope.$apply();
            })

        };

        vm.getTwoFactors = function () {

            twoFactorService.getList().then(function (data) {

                vm.twoFactorItems = data.results;
                $scope.$apply();

            })

        };

        vm.revokeTwoFactor = function ($event, item) {

            /* $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                locals: {
                    warning: {
                        title: 'Warning!',
                        description: "Are you sure you want to revoke linked device?"
                    }
                },
                multiple: true,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                targetEvent: $event
            }) */

			const locals = {
				warning: {
					title: 'Warning!',
					description: "Are you sure you want to revoke linked device?"
				}
			};

			commonDialogsService.warning(locals, {targetEvent: $event}).then(function (res) {

                if (res.status === 'agree') {

                    twoFactorService.deleteByKey(item.id).then(function (value) {
                        vm.getTwoFactors();

                    })

                }

            });


        };

        vm.addDevice = function ($event) {

            $mdDialog.show({
                controller: 'TwoFactorSetupDialogController as vm',
                templateUrl: 'views/dialogs/two-factor-setup-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                locals: {
                    data: {}
                },
                targetEvent: $event
            }).then(function (res) {

                if (res.status === 'agree') {
                    vm.getTwoFactors();
                }

            })


        };

        vm.init = function () {

            // vm.getUser();
			user = globalDataService.getUser();
			vm.twoFactorVerification = !!user.two_factor_verification;

            vm.getTwoFactors();

        };

        vm.init();

    }

}());