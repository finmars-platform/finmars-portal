/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var metaService = require('../../services/metaService');

    var balanceReportCustomAttrService = require('../../services/reports/balanceReportCustomAttrService');
    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('CustomFieldConfigDialogController', 'initialized');

        var vm = this;

        vm.customField = data.customField;

        vm.reportFields = metaService.getEntityAttrs('balance-report').map(function (item) {
            if (item.value_type == 'float' || item.value_type == 40) {
                return item;
            }
        }).filter(function (item) {
            return !!item;
        });


        vm.agree = function () {
            $mdDialog.hide({status: 'agree', data: {}});
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());