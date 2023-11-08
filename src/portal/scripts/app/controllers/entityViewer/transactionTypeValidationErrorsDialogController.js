/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        /*vm.actionErrors = data.actionErrors;
        vm.entityErrors = data.entityErrors;
        vm.inputsErrors = data.inputsErrors;*/
        vm.errorsList = data.errorsList || [];

        vm.proceedButton =
            typeof data.proceedButton === 'boolean' ? data.proceedButton : true;

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());