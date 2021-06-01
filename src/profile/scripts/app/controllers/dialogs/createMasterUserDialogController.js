/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    // var authorizerService = require('../../services/authorizerService');

    module.exports = function ($scope, $mdDialog, data, profileAuthorizerService) {

        console.log('data', data);

        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {

			profileAuthorizerService.createMasterUser({name: vm.name}).then(function (data) {

                console.log('data success', data);

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

                console.log('reason', reason);

                $mdDialog.show({
                    controller: 'ProfileInfoDialogController as vm',
                    templateUrl: 'views/dialogs/info-dialog-view.html',
                    parent: angular.element(document.body),
                    locals: {
                        data: {
                            title: 'Warning!',
                            description: "Database with name " + vm.name + ' already exists. Please choose another name.'
                        }
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    targetEvent: $event
                })
            })

        };
    }

}());