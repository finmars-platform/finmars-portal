/**
 * Created by szhitenev on 11.05.2020.
 */
(function () {

    'use strict';

    // var authorizerService = require('../../services/authorizerService');
    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function copyMasterUserDialogController($scope, $mdDialog, $state, redirectionService, data, profileAuthorizerService) {

        console.log('data', data);

        var vm = this;

        vm.referenceMasterUser = data.referenceMasterUser;

        vm.processing = false;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function ($event) {

            vm.processing = true;


			profileAuthorizerService.copyMasterUser({name: vm.name, reference_master_user: vm.referenceMasterUser.id})

            setTimeout(function (){

                toastNotificationService.info("Copy of Database  " + vm.name + ' is currently processing');
				$mdDialog.hide({status: 'agree'});

                // $state.go('app.profile', {}, {reload: 'app'});
				window.open(redirectionService.getUrlByState('app.profile'), '_self');

            }, 1000)



            // profileAuthorizerService.copyMasterUser({name: vm.name, reference_master_user: vm.referenceMasterUser.id}).then(function (data) {
            //
            //     console.log('data success', data);
            //
            //     vm.processing = false;
            //     $scope.$apply();
            //
            //     toastNotificationService.info("Copy of Database  " + vm.name + ' is currently processing');
            //
            //     $mdDialog.hide({status: 'agree', data: {
            //         task: data
            //     }});
            //
            // }).catch(function (reason) {
            //
            //     console.log('reason', reason);
            //
            //     vm.processing = false;
            //     $scope.$apply();
            //
            //     $mdDialog.show({
            //         controller: 'ProfileInfoDialogController as vm',
            //         templateUrl: 'views/dialogs/info-dialog-view.html',
            //         parent: angular.element(document.body),
            //         locals: {
            //             data: {
            //                 title: 'Warning!',
            //                 description: "Something went wrong"
            //             }
            //         },
            //         multiple: true,
            //         preserveScope: true,
            //         autoWrap: true,
            //         skipHide: true,
            //         targetEvent: $event
            //     })
            // })

        };
    }

}());