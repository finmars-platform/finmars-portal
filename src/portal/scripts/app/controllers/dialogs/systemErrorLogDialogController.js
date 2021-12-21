/**
 * Created by szhitenev on 18.10.2021.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, globalDataService, data) {

        var vm = this;

        vm.errors = window.system_errors;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.setDownloadLink = function () {

            var link = document.querySelector('.download-system-error-log');

            var currentMasterUser = globalDataService.getMasterUser();
            var user = globalDataService.getUser();

            var data = {

                master_user: currentMasterUser.name,
                username: user.username,
                date: new Date().toISOString(),
                errors: window.system_errors

            }

            var text = JSON.stringify(data)

            var file = new Blob([text], {type: 'text/plain'});

            link.href = URL.createObjectURL(file);

            link.addEventListener('click', function () {

                link.download = 'System Error Log ' + new Date().toISOString() + '.json';
                $mdDialog.hide();
            })

        }

        vm.init = function () {

            setTimeout(function () {
                vm.setDownloadLink()
            }, 200)

        }

        vm.init();
    }

}());