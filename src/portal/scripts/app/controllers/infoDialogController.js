/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../services/logService');

    module.exports = function($scope, $mdDialog, info){

        logService.controller('WarningDialogController', 'initialized');

        var vm = this;

        vm.info = info;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());