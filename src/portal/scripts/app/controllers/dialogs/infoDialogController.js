'use strict';

import logService from '../../../../../core/services/logService';

export default function($scope, $mdDialog, info){

    logService.controller('WarningDialogController', 'initialized');

    var vm = this;

    vm.info = info;

    vm.cancel = function () {
        $mdDialog.hide({status: 'disagree'});
    };

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};