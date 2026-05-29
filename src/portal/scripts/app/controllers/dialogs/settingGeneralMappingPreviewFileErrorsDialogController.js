'use strict';



export default function ($scope, $mdDialog, data) {

    var vm = this;

    vm.data = data;

    vm.getName = function (item) {

        if (item.user_code) {
            return item.user_code
        }

        return item.name;

    };

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};