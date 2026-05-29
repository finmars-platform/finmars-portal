'use strict';

export default function ($scope, $mdDialog, data) {

    var vm = this;

    vm.schemeErrors = data.errorsInScheme;

    vm.close = function () {
        $mdDialog.hide();
    };

};