/**
 * Created by szhitenev on 04.10.2021.
 */
(function () {

    'use strict';

    var masterUserBackupsService = require('../../services/masterUserBackupsService');
    // var authorizerService = require('../../services/authorizerService');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.backup = data.backup;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function ($event) {


            masterUserBackupsService.restoreFromBackup(vm.backup.id, {
                name: vm.name,
                license_key: vm.license_key
            }).then(function (data) {

                console.log('data success', data);

                $mdDialog.hide({status: 'agree', data: data});

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