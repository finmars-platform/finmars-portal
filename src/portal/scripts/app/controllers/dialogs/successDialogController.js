'use strict';

import logService from '../../../../../core/services/logService';

export default function($scope, $mdDialog, success){

    logService.controller('SuccessDialogController', 'initialized');

    var vm = this;

    vm.success = success;

    vm.agree = function () {
        $mdDialog.hide({status: 'agree'});
    };
};