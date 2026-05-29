'use strict';

import logService from '../../../../../core/services/logService';

export default function ($scope, $mdDialog) {
    var vm = this;

    logService.controller('EventScheduleConfigDialogController', 'initialized');

    vm.cancel = function () {
        $mdDialog.hide();
    }
};