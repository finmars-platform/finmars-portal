/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function($scope, $mdDialog, warning, data){

        logService.controller('WarningDialogController', 'initialized');

        var vm = this;

        vm.warning = warning;

        vm.actionsButtons = undefined;

        if (data) {

            if (data.actionsButtons && data.actionsButtons.length) {

                vm.actionsButtons = data.actionsButtons;

            }

        }

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function (responseData) {

            if (responseData) {
                $mdDialog.hide(responseData);
            } else {
                $mdDialog.hide({status: 'agree'});
            }

        };
    }

}());