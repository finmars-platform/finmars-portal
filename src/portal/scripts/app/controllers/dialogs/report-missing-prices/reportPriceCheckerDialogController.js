/**
 * Created by szhitenev on 06.11.2020.
 */
(function () {

    'use strict';

    var convertReportHelper = require('../../../helpers/converters/convertReportHelper');
    var downloadFileHelper = require('../../../helpers/downloadFileHelper');
    var scheduleService = require('../../../services/scheduleService').default;
    var toastNotificationService = require('../../../../../../core/services/toastNotificationService').default;
    var pricingPolicyService = require('../../../services/pricingPolicyService').default;

    module.exports = function ($scope, $mdDialog, data) {

        console.log('data', data);

        var vm = this;

        vm.data = data;

        vm.evDataService = vm.data.evDataService;

        vm.missingHistoryPrices = [];
        vm.missingFxRates = [];

        vm.missingHistoricalFxRates = []; // transaction rates

        vm.missingCustomFields = [];

        vm.downloadPriceHistoryCSV = function (event) {

            var columns = [
                {key: 'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key: 'date', name: "Date"},
                {key: 'user_code', name: "Instrument User Code"},
                {key: 'principal_price', name: "Principal Price"},
                {key: 'accrued_price', name: "Accrued Price"}
            ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingHistoryPrices, columns);

            var name = "Missing Price History " + vm.data.missingPricesData.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.downloadFxRatesCSV = function ($event) {

            var columns = [
                {key: 'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key: 'date', name: "Date"},
                {key: 'user_code', name: "Currency User Code"},
                {key: 'fx_rate', name: "FX Rate"}
            ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingFxRates, columns);

            var name = "Missing FX Rates " + vm.data.missingPricesData.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.downloadHistoricalFxRatesCSV = function ($event) {

            var columns = [
                {key: 'pricing_policy_user_code', name: "Pricing Policy User Code"},
                {key: 'transaction_currency_user_code', name: "Currency User Code"},
                {key: 'accounting_date', name: "Date"},
                {key: 'fx_rate', name: "FX Rate"}
            ];

            var blobPartOld = convertReportHelper.convertFlatListToCSV(vm.missingHistoricalFxRates, columns);

            var name = "Missing Historical FX Rates " + vm.data.missingPricesData.report_date + ".csv";

            downloadFileHelper.downloadFile(blobPartOld, "text/plain", name);

        };

        vm.viewMissingPriceHistory = function ($event) {

            $mdDialog.show({
                controller: 'ViewMissingPriceHistoryDialogController as vm',
                templateUrl: 'views/dialogs/report-missing-prices/view-missing-price-history-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        items: vm.missingHistoryPrices,
                        evDataService: vm.evDataService
                    }
                }
            })

        };

        vm.viewMissingFxRates = function ($event) {

            $mdDialog.show({
                controller: 'ViewMissingFxRatesDialogController as vm',
                templateUrl: 'views/dialogs/report-missing-prices/view-missing-fx-rates-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        items: vm.missingFxRates,
                        evDataService: vm.evDataService
                    }
                }
            })

        };

        vm.viewMissingHistoricalFxRates = function ($event) {

            $mdDialog.show({
                controller: 'ViewMissingHistoricalFxRatesDialogController as vm',
                templateUrl: 'views/dialogs/report-missing-prices/view-missing-historical-fx-rates-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        items: vm.missingHistoricalFxRates,
                        evDataService: vm.evDataService
                    }
                }
            })

        };

        vm.viewMissingCustomFields = function ($event) {

            $mdDialog.show({
                controller: 'ViewMissingCustomFieldsDialogController as vm',
                templateUrl: 'views/dialogs/report-missing-prices/view-missing-custom-fields-dialog-view.html',
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: $event,
                multiple: true,
                locals: {
                    data: {
                        missingCustomFields: vm.missingCustomFields,
                        // evDataService: vm.evDataService
                    }
                }
            })

        }

        vm.runPricing = function () {
            var reportOptions = vm.evDataService.getReportOptions();
            var entityType = vm.evDataService.getEntityType();

            data = {

            }

            if (entityType === 'balance-report') {
                data.date_from = vm.data.missingPricesData.report_date
                data.date_to = vm.data.missingPricesData.report_date
                data.pricing_policies = [reportOptions.pricing_policy]
                data.currencies = [vm.data.missingPricesData.report_currency_object.user_code]
                data.instruments = Array.from(
                  new Set(
                    vm.data.missingPricesData.item_instruments.map((missingData) => {
                        return missingData.user_code;
                    })
                  )
                );
            }


            if (entityType === 'pl-report') {
                data.date_from = vm.data.missingPricesData.pl_first_date
                data.date_to = vm.data.missingPricesData.report_date
                data.pricing_policies = [reportOptions.pricing_policy]
                data.currencies = [vm.data.missingPricesData.report_currency_object.user_code]
                data.instruments = Array.from(
                  new Set(
                    vm.data.missingPricesData.item_instruments.map((missingData) => {
                        return missingData.user_code;
                    })
                  )
                );
            }

            // if (entityType === 'transaction-report') {
            //     data.begin_date = reportOptions.begin_date
            //     data.end_date = reportOptions.end_date
            // }

            pricingPolicyService.runPricing(data).then(function (data) {
                // TODO pricingv2 task card to show progress
                toastNotificationService.success('Success. Schedule  is being processed');

                $mdDialog.hide({status: 'disagree'});
            })
        }

        vm.schedules = [];

        vm.readyStatus = {schedules: false};

        vm.getList = function () {

            scheduleService.getList().then(function (data) {

                vm.schedules = data.results;

                vm.readyStatus.schedules = true;

                $scope.$apply();

            })
        };


        vm.init = function () {

            vm.getList();

            // Victor 2021.03.29 #88 fix bug with deleted custom fields
            const missingCustomFields = vm.evDataService.getMissingCustomFields();
            const missingCustomFieldsForColumns = missingCustomFields.forColumns;
            const missingCustomFieldsForFilters = missingCustomFields.forFilters;

            vm.missingCustomFields = missingCustomFieldsForColumns.concat(missingCustomFieldsForFilters.filter(field => {
                return !missingCustomFieldsForColumns.find(it => it.key === field.key)
            }))
            // <Victor 2021.03.29 #88 fix bug with deleted custom fields>

            vm.missingHistoryPrices = vm.data.missingPricesData.items.filter(function (item) {
                return ['missing_principal_pricing_history', 'missing_accrued_pricing_history'].indexOf(item.type) !== -1;
            });

            vm.missingHistoryPrices = vm.missingHistoryPrices.map(function (item) {

                item.date = vm.data.missingPricesData.report_date;
                item.pricing_policy_user_code = vm.data.missingPricesData.pricing_policy_object.user_code;

                return item

            });

            vm.missingFxRates = vm.data.missingPricesData.items.filter(function (item) {
                return ['missing_instrument_currency_fx_rate', 'missing_report_currency_fx_rate'].indexOf(item.type) !== -1;
            });

            vm.missingFxRates = vm.missingFxRates.map(function (item) {

                item.date = vm.data.missingPricesData.report_date;
                item.pricing_policy_user_code = vm.data.missingPricesData.pricing_policy_object.user_code;

                if (item.currency_object) item.user_code = item.currency_object.user_code; // important replace

                return item

            });

            vm.missingHistoricalFxRates = vm.data.missingPricesData.items.filter(function (item) {
                return ['fixed_calc', 'stl_cur_fx', 'rep_fx_var', 'fx_var', 'rep_fixed_calc'].indexOf(item.type) !== -1;
            });

            vm.missingHistoricalFxRates = vm.missingHistoricalFxRates.map(function (item) {

                item.pricing_policy_user_code = vm.data.missingPricesData.pricing_policy_object.user_code;

                return item

            });

        };

        vm.init();

        vm.agree = function () {

            $mdDialog.hide({status: 'agree'});
        };
    }

}());