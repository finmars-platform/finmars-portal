/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    // var authorizerService = require('../../services/authorizerService');

    // var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function ($scope, $mdDialog, data, toastNotificationService, profileAuthorizerService, commonDialogsService) {

        var vm = this;

        vm.processing = false;

        vm.masterUser = data.masterUser;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            /*$mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/dialogs/warning-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                locals: {
                    warning: {
                        title: 'Confirmation',
                        description: 'Database ' + vm.masterUser.name + ' is going to be deleted.'
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true,
                targetEvent: $event

            })*/
			const warningLocals = {
				warning: {
					title: 'Confirmation',
					description: 'Database ' + vm.masterUser.name + ' is going to be deleted.'
				}
			};

			commonDialogsService.warning(warningLocals, {targetEvent: $event}).then(function (res) {

                if (res.status === 'agree') {

                    vm.processing = true;

					profileAuthorizerService.deleteMasterUserByKey(vm.masterUser.id).then(function () {

                        vm.processing = false;

                        $scope.$apply();

                        toastNotificationService.success("Ecosystem " + vm.masterUser.name + ' was deleted');

                        $mdDialog.hide({status: 'agree'});

                    }).catch(function (error) {

                        vm.processing = false;
                        $scope.$apply();

                    })
                }

            });

        };
    }

}());