/**
 * Created by szhitenev on 10.04.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog, errorData) {

        logService.controller('importEntityErrorController', 'initialized');

        var vm = this;

        vm.errorText = errorData;

        vm.close = function () {
            $mdDialog.hide({res: 'close'});
        }
    }

}());