/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var timeZonesService = require('../services/timeZonesService');

    var usersService = require('../services/usersService');
    var twoFactorService = require('../services/twoFactorServce');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {user: false};


        vm.getUser = function () {

            usersService.getByKey(0).then(function (data) {
                vm.user = data;
                vm.readyStatus.user = true;
                $scope.$apply();
            });


        };

        vm.updateUser = function () {

            usersService.update(0, vm.user).then(function () {
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

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: angular.element(document.body),
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
            }).then(function (res) {

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
                parent: angular.element(document.body),
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

            vm.getUser();

            vm.getTwoFactors();

        };

        vm.init();

    }

}());