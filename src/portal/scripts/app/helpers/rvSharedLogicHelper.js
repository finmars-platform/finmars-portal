(function () {

    var rvDataProviderService = require('../services/rv-data-provider/rv-data-provider.service');
    var pricesCheckerService = require('../services/reports/pricesCheckerService');

    var expressionService = require('../services/expression.service');
    var evEvents = require('../services/entityViewerEvents');

    'use strict';

    module.exports = function (viewModel, $scope, $mdDialog) {

        var onSetLayoutEnd = function () {

            viewModel.readyStatus.layout = true;
            rvDataProviderService.requestReport(viewModel.entityViewerDataService, viewModel.entityViewerEventService);

            var reportOptions = viewModel.entityViewerDataService.getReportOptions();

            pricesCheckerService.check(reportOptions).then(function (data) {

                data.items = data.items.map(function (item) {

                    if (item.type === 'missing_principal_pricing_history' || item.type === 'missing_accrued_pricing_history') {

                        data.item_instruments.forEach(function (instrument) {

                            if(item.id === instrument.id) {
                                item.instrument_object = instrument;
                            }

                        })

                    }



                    if (item.type === 'fixed_calc' || item.type === 'stl_cur_fx' || item.type === 'missing_instrument_currency_fx_rate') {
                        
                        data.item_currencies.forEach(function (currency) {

                            if (item.transaction_currency_id === currency.id) {
                                item.currency_object = currency;
                            }

                            if (item.id === currency.id) { // backend magic
                                item.currency_object = currency;
                            }
                            
                        })
                        
                    }

                    return item

                });

                viewModel.entityViewerDataService.setMissingPrices(data);

                viewModel.entityViewerEventService.dispatchEvent(evEvents.MISSING_PRICES_LOAD_END)

            });


            $scope.$apply();

        };

        var calculateReportDateExpr = function (dateExpr, reportOptions, reportDateIndex, dateExprsProms) {

            var reportDateProperties = {
                'balance-report': [null, 'report_date'],
                'pl-report': ['pl_first_date', 'report_date'],
                'transaction-report': ['begin_date', 'end_date']
            };

            var dateProp = reportDateProperties[viewModel.entityType][reportDateIndex];

            var result = expressionService.getResultOfExpression({"expression": dateExpr}).then(function (data) {
                reportOptions[dateProp] = data.result
            });

            dateExprsProms.push(result);

        };

        var calculateReportDatesExprs = function (options) {

            if (!options) {
                options = {}
            }

            // noDateExpr_ + {{date_index}} used for dashboard report

            var reportOptions = viewModel.entityViewerDataService.getReportOptions();
            var reportLayoutOptions = viewModel.entityViewerDataService.getReportLayoutOptions();

            var firstDateExpr = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // for pl_first_date, begin_date
            var secondDateExpr = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression; // for report_date, end_date

            var dateExprsProms = [];

            if (firstDateExpr && !options.noDateExpr_0) {
                calculateReportDateExpr(firstDateExpr, reportOptions, 0, dateExprsProms);
            }

            if (secondDateExpr && !options.noDateExpr_1) {
                calculateReportDateExpr(secondDateExpr, reportOptions, 1, dateExprsProms);
            }

            return Promise.all(dateExprsProms);

        };

        return {
            calculateReportDatesExprs: calculateReportDatesExprs,
            onSetLayoutEnd: onSetLayoutEnd
        }

    }

}());