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

			profileAuthorizerService.createMasterUser({name: vm.name, license_key: vm.license_key}).then(function (data) {

                console.log('data success', data);

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

                console.log('reason', reason);

                $mdDialog.show({
                    controller: 'ProfileInfoDialogController as vm',
                    templateUrl: 'views/dialogs/info-dialog-view.html',
                    parent: document.querySelector('.dialog-containers-wrap'),
                    locals: {
                        data: {
                            title: 'Warning!',
                            description: reason
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