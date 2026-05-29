'use strict';

export default function($scope, $mdDialog, warning){

    var vm = this;

    vm.warning = warning;

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};