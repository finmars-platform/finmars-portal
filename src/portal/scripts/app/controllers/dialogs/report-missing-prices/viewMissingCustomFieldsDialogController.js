'use strict';

export default function ($scope, $mdDialog, data) {

    var vm = this;

    vm.data = data;

    vm.items = vm.data.missingCustomFields;

    vm.init = function () {

    };

    vm.init();

    vm.agree = function () {

        $mdDialog.hide({status: 'agree'});
    };
};