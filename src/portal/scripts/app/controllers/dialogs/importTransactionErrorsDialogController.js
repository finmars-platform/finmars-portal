/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('importTransactionErrorsDialogController', 'initialized');

        var vm = this;

        vm.data = data;

        vm.validationResult = data.validationResult;
        vm.scheme = data.scheme;
        vm.config = data.config;

        vm.cancel = function () {
            $mdDialog.hide({});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };
    }

}());