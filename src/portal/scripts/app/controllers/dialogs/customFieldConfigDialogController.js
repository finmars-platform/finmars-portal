/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');
    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('CustomFieldConfigDialogController', 'initialized');

        var vm = this;

        vm.customField = data.customField;

        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());