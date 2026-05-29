'use strict';

export default function($scope, $mdDialog, data){

    var vm = this;

    vm.info = data;

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};