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

        vm.rangeItems = [];
        vm.dateRange = {};

        vm.rangeType = null;

        if (vm.customField.hasOwnProperty('layout') && vm.customField.layout !== null) {
            vm.exprType = vm.customField.layout.exprType;
            vm.exprField = vm.customField.layout.exprField;
            vm.rangeItems = vm.customField.layout.rangeItems;
            vm.dateRange = vm.customField.layout.dateRange;
        }

        vm.resetRanges = function () {
            vm.rangeItems = [];
        };

        //vm.reportFields = metaService.getEntityAttrs('balance-report').map(function (item) {
        //    if (item.value_type == 'float' || item.value_type == 40) {
        //        return item;
        //    }
        //}).filter(function (item) {
        //    return !!item;
        //});

        vm.agree = function () {

            console.log('vm', vm);


            var expression = '';

            if (vm.rangeType == 20) {
                expression = 'simple_group("' + vm.exprField + '", [';

                vm.rangeItems.forEach(function (item, $index) {

                    var value_left = item.value_left;
                    var value_right = item.value_right;

                    var colon = ',';

                    if (vm.rangeItems.length - 1 == $index) {
                        colon = '';
                    }

                    if (value_left == 'inf') {
                        value_left = '"inf"';
                    }
                    if (value_left == '-inf') {
                        value_left = '"-inf"';
                    }

                    if (value_right == 'inf') {
                        value_right = '"inf"';
                    }
                    if (value_right == '-inf') {
                        value_right = '"-inf"';
                    }

                    expression = expression + '[' + value_left + ', ' + value_right + ', "' + item.group_name + '"]' + colon;
                });

                expression = expression + '], default="lorem")';
            }

            if (vm.rangeType == 40) {

                expression = 'date_group("' + vm.exprField + '", [';

                var dateRangeBeforeDate = '';
                var dateRangeBeforeFormat = '';
                var dateRangeBeforeName = '';

                if (vm.dateRange.before) {
                    dateRangeBeforeDate = vm.dateRange.before.date;

                    if (vm.dateRange.before.format) {
                        dateRangeBeforeFormat = vm.dateRange.before.format.caption;
                    }
                    dateRangeBeforeName = vm.dateRange.before.name;
                }

                expression = expression + '["","' + dateRangeBeforeDate + '", "", ["", "", "", "", "' + dateRangeBeforeFormat + '", "' + dateRangeBeforeName + '"]],';

                vm.rangeItems.forEach(function (item) {

                    var begin = item.begin || '';
                    var end = item.end || '';
                    var step = '';

                    if (item.step) {
                        step = item.step.caption;
                    }

                    var str1 = item.str1 || '';
                    var begin_date_fmt = '';

                    if (item.begin_date_fmt) {
                        begin_date_fmt = item.begin_date_fmt.caption;
                    }

                    var str3 = item.str3 || '';
                    var str4 = item.str4 || '';
                    var end_date_fmt = '';

                    if (item.end_date_fmt) {
                        end_date_fmt = item.end_date_fmt.caption;
                    }

                    var str6 = item.str6 || '';

                    var colon = ',';

                    expression = expression + '["'
                        + begin + '", "'
                        + end + '", "'
                        + step + '" ["'
                        + str1 + '", "'
                        + begin_date_fmt + '", "'
                        + str3 + '", "'
                        + str4 + '", "'
                        + end_date_fmt + '", "'
                        + str6 + '"]]' + colon;
                });

                var dateRangeAfterDate = '';
                var dateRangeAfterFormat = '';
                var dateRangeAfterName = '';

                if (vm.dateRange.after) {
                    dateRangeAfterDate = vm.dateRange.after.date

                    if (vm.dateRange.after.format) {
                        dateRangeAfterFormat = vm.dateRange.after.format.caption;
                    }
                    dateRangeAfterName = vm.dateRange.after.name;
                }

                expression = expression + '["","' + dateRangeAfterDate + '", "", ["", "", "", "", "' + dateRangeAfterFormat + '", "' + dateRangeAfterName + '"]]';

                expression = expression + '], default="lorem")';

            }

            $mdDialog.hide({
                status: 'agree', data: {
                    expression: expression, layout: {
                        rangeItems: vm.rangeItems,
                        dateRange: vm.dateRange,
                        exprField: vm.exprField,
                        exprType: vm.exprType
                    }
                }
            });
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());