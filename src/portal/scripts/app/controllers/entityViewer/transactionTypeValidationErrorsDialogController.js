/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.actionErrors = data.actionErrors;
        vm.entityErrors = data.entityErrors;
        vm.exprsUsesDeletedInput = data.expressionsUsesDeletedInput;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());