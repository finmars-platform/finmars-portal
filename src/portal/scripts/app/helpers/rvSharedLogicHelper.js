(function () {

    var rvDataProviderService = require('../services/rv-data-provider/rv-data-provider.service');
    var pricesCheckerService = require('../services/reports/pricesCheckerService');

    var expressionService = require('../services/expression.service');
    var evEvents = require('../services/entityViewerEvents');

    'use strict';

    module.exports = function (viewModel, $scope, $mdDialog) {

		let downloadAttributes = function () {

			return new Promise(function (resolve, reject) {

				var promises = [];

				promises.push(viewModel.attributeDataService.downloadCustomFieldsByEntityType('balance-report'));
				promises.push(viewModel.attributeDataService.downloadCustomFieldsByEntityType('pl-report'));
				promises.push(viewModel.attributeDataService.downloadCustomFieldsByEntityType('transaction-report'));

				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('portfolio'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('account'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('instrument'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('responsible'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('counterparty'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('transaction-type'));
				promises.push(viewModel.attributeDataService.downloadDynamicAttributesByEntityType('complex-transaction'));


				if (viewModel.entityType === 'balance-report' ||
					viewModel.entityType === 'pl-report' ||
					viewModel.entityType === 'transaction-report') {

					promises.push(viewModel.attributeDataService.downloadInstrumentUserFields());

				}

				if (viewModel.entityType === 'transaction-report') {
					promises.push(viewModel.attributeDataService.downloadTransactionUserFields());
				}

				Promise.all(promises).then(function (data) {

					viewModel.readyStatus.attributes = true;
					resolve(data);

				}).catch(function (error) {
					resolve({errorObj: error, errorCause: 'dynamicAttributes'});
				});

			});

		};

		let putUseFromAboveFiltersFirst = function () { // needed for already existing rv layouts

			let allFilters = viewModel.entityViewerDataService.getFilters();
			let filters = [];

			let useFromAboveFiters = allFilters.filter(filter => {

				let filterOpts = filter.options || {};

				if (filterOpts.use_from_above && Object.keys(filterOpts.use_from_above).length) {
					return true;
				}

				filters.push(filter);

				return false;

			});

			allFilters = useFromAboveFiters.concat(filters);

			viewModel.entityViewerDataService.setFilters(allFilters);

		};

        var onSetLayoutEnd = () => {

            viewModel.readyStatus.layout = true;
            rvDataProviderService.requestReport(viewModel.entityViewerDataService, viewModel.entityViewerEventService);

            var reportOptions = viewModel.entityViewerDataService.getReportOptions();
            var entityType = viewModel.entityViewerDataService.getEntityType();

            if (entityType !== 'transaction-report') {

            	pricesCheckerService.check(reportOptions).then(function (data) {

                    data.items = data.items.map(function (item) {

                        if (item.type === 'missing_principal_pricing_history' || item.type === 'missing_accrued_pricing_history') {

                            data.item_instruments.forEach(function (instrument) {

                                if (item.id === instrument.id) {
                                    item.instrument_object = instrument;
                                }

                            })

                        }

                        if (item.type === 'fixed_calc' || item.type === 'stl_cur_fx' || item.type === 'missing_instrument_currency_fx_rate') {

                            data.item_currencies.forEach(function (currency) {

                                if (item.transaction_currency_id === currency.id) {
                                    item.currency_object = currency;
                                }

                                if (item.id === currency.id) {
                                    item.currency_object = currency;
                                }

                            })

                        }

                        return item

                    });

                    viewModel.entityViewerDataService.setMissingPrices(data);

                    viewModel.entityViewerEventService.dispatchEvent(evEvents.MISSING_PRICES_LOAD_END);

                });

            }

			putUseFromAboveFiltersFirst();

            $scope.$apply();

            return viewModel.readyStatus.layout;

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
			downloadAttributes: downloadAttributes,
            calculateReportDatesExprs: calculateReportDatesExprs,
            onSetLayoutEnd: onSetLayoutEnd
        }

    }

}());