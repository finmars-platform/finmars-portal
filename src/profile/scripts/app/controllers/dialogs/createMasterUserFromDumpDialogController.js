/**
 * Created by szhitenev on 13.05.2021.
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

            var formData = new FormData();

            formData.append('name', vm.name);
            formData.append('license_key', vm.license_key);
            formData.append('file', vm.file);

			profileAuthorizerService.createMasterUserFromBackup(formData).then(function (data) {

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