/**
 * Created by szhitenev on 06.11.2020.
 */
(function () {

    'use strict';

    var convertReportHelper = require('../../helpers/converters/convertReportHelper');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.missingHistoryPrices = [];
        vm.missingFxRates = [];

        vm.missingHistoricalFxRates = []; // transaction rates

        vm.downloadPriceHistoryCSV = function(event) {

            var columns = [
                {key:'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key:'date', name: "Date"},
                {key: 'user_code', name: "Instrument User Code"},
                {key: 'principal_price', name: "Principal Price"},
                {key: 'accrued_price', name: "Accrued Price"}
                ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingHistoryPrices, columns);

            var name = "Missing Price History " + vm.data.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.downloadFxRatesCSV = function($event) {

            var columns = [
                {key:'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key:'date', name: "Date"},
                {key: 'user_code', name: "Currency User Code"},
                {key: 'fx_rate', name: "FX Rate"}
                ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingFxRates, columns);

            var name = "Missing FX Rates " + vm.data.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.downloadHistoricalFxRatesCSV = function($event) {

            var columns = [
                {key:'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key:'transaction_currency_user_code', name: "Currency User Code"},
                {key:'accounting_date', name: "Date"},
                {key:'fx_rate', name: "FX Rate"}
                ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingHistoricalFxRates, columns);

            var name = "Missing Historical FX Rates " + vm.data.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.init = function () {

            vm.missingHistoryPrices = vm.data.items.filter(function (item) {
                return ['missing_principal_pricing_history', 'missing_accrued_pricing_history'].indexOf(item.type) !== -1;
            });

            vm.missingHistoryPrices = vm.missingHistoryPrices.map(function (item) {

                item.date = vm.data.report_date;
                item.pricing_policy_user_code = vm.data.pricing_policy_object.user_code;

                return item

            });

            vm.missingFxRates = vm.data.items.filter(function (item) {
                return ['missing_instrument_pricing_currency_fx_rate', 'missing_instrument_accrued_currency_fx_rate', 'missing_report_currency_fx_rate'].indexOf(item.type) !== -1;
            });

            vm.missingFxRates = vm.missingFxRates.map(function (item) {

                item.date = vm.data.report_date;
                item.pricing_policy_user_code = vm.data.pricing_policy_object.user_code;

                return item

            });

            vm.missingHistoricalFxRates = vm.data.items.filter(function (item) {
                return ['fixed_calc', 'stl_cur_fx', 'rep_fx_var', 'fx_var', 'rep_fixed_calc'].indexOf(item.type) !== -1;
            });

            vm.missingHistoricalFxRates = vm.missingHistoricalFxRates.map(function (item) {

                item.pricing_policy_user_code = vm.data.pricing_policy_object.user_code;

                return item

            });

        };

        vm.init();

        vm.agree = function () {

            $mdDialog.hide({status: 'agree'});
        };
    }

}());