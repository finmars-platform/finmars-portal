'use strict';

export default function ($scope, $mdDialog, data) {

    var vm = this;

    vm.username = '';
    vm.password = '';

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {

        $mdDialog.hide({
            status: 'agree',
            data: {
                username: vm.username,
                password: vm.password
            }
        });
    };
};