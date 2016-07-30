/**
 * Created by sergey on 30.07.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('WriteMessageDialogController', 'initialized');

        var vm = this;

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {message: vm.message}});
        };

    };

}());