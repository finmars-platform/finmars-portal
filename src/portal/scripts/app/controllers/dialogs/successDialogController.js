/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function($scope, $mdDialog, success){

        logService.controller('SuccessDialogController', 'initialized');

        var vm = this;

        vm.success = success;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());