/**
 * Created by szhitenev on 08.06.2016.
 */
(function(){

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function($scope, $mdDialog, item){

        logService.controller('ExpressionEditorDialogController', 'initialized');

        var vm = this;

        vm.item = item;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());