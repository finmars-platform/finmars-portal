(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.errors = data.errorsList;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        var init = function () {
            setTimeout(function () {
                vm.dialogElemToResize = document.querySelector('.evValidationDialogElemToResize');
            }, 100);
        };

        init();
    }

}());