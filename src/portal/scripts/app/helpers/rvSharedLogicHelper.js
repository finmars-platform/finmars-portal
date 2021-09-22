'use strict';

import CommonDialogsService from "../../../../shell/scripts/app/services/commonDialogsService";

(function () {

    const rvDataProviderService = require('../services/rv-data-provider/rv-data-provider.service');
	const pricesCheckerService = require('../services/reports/pricesCheckerService');
	const localStorageService = require('../../../../shell/scripts/app/services/localStorageService');

	const expressionService = require('../services/expression.service');
	const evEvents = require('../services/entityViewerEvents');

	const priceHistoryService = require('../services/priceHistoryService');
	const currencyHistoryService = require('../services/currencyHistoryService');

    module.exports = function (viewModel, $scope, $mdDialog) {

		const commonDialogsService = new CommonDialogsService($mdDialog);

		const downloadAttributes = function () {

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

		const putUseFromAboveFiltersFirst = function () { // needed for already existing rv layouts

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

		const setLayoutDataForView = function () {

			viewModel.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
			viewModel.entityViewerDataService.setContentType($scope.$parent.vm.contentType);
			viewModel.entityViewerDataService.setIsReport(true);
			viewModel.entityViewerDataService.setCurrentMember(viewModel.currentMember);
			viewModel.entityViewerDataService.setVirtualScrollStep(500);

			viewModel.entityViewerDataService.setRowHeight(36);

			var rowFilterColor = localStorageService.getRowTypeFilter(true, viewModel.entityType);
			var rowTypeFiltersData = viewModel.entityViewerDataService.getRowTypeFilters();
			rowTypeFiltersData.markedRowFilters = rowFilterColor;

			viewModel.entityViewerDataService.setRowTypeFilters(rowTypeFiltersData);

		};

        const onSetLayoutEnd = () => {

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

		const reportDateProperties = {
			'balance-report': [null, 'report_date'],
			'pl-report': ['pl_first_date', 'report_date'],
			'transaction-report': ['begin_date', 'end_date']
		};

        const calculateReportDateExpr = function (dateExpr, reportOptions, reportDateIndex, dateExprsProms) {

            const dateProp = reportDateProperties[viewModel.entityType][reportDateIndex];

            const result = expressionService.getResultOfExpression({"expression": dateExpr}).then(function (data) {
                reportOptions[dateProp] = data.result
            });

            dateExprsProms.push(result);

        };

        const calculateReportDatesExprs = function (options) {

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

        //region Execute actions from report viewer table

		var updateTableAfterEntityChanges = function (res) {

			viewModel.entityViewerDataService.setRowsActionData(null);

			if (res && res.status === 'agree') {

				/* viewModel.entityViewerDataService.resetData();
				viewModel.entityViewerDataService.resetRequestParameters();

				var rootGroup = viewModel.entityViewerDataService.getRootGroupData();

				viewModel.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id); */
				viewModel.entityViewerDataService.resetTableContent(true);

				viewModel.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

				const viewContext = viewModel.entityViewerDataService.getViewContext();
				if (viewContext === 'split_panel') viewModel.parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

			}

		};

        const getContextDataForRowAction = function (reportOptions, rowObject) {

			let report_date = null;
			let report_start_date = null;

			if (viewModel.entityType === 'balance-report') {
				report_date = reportOptions.report_date;
			}

			if (viewModel.entityType === 'pl-report') {
				report_date = reportOptions.report_date;
				report_start_date = reportOptions.pl_first_date;
			}

			if (viewModel.entityType === 'transaction-report') {
				report_date = reportOptions.end_date;
				report_start_date = reportOptions.begin_date;
			}

			var contextData = {
				effective_date: reportOptions.report_date,
				position: null,
				pricing_currency: null,
				accrued_currency: null,
				instrument: null,
				portfolio: null,
				account: null,
				strategy1: null,
				strategy2: null,
				strategy3: null,


				currency: null,
				report_date: report_date,
				report_start_date: report_start_date,
				pricing_policy: null,
				allocation_balance: null,
				allocation_pl: null

			};

			if (rowObject.item_type === 2) { // currency

				contextData.currency = rowObject['currency.id'];
				contextData.currency_object = {
					id: rowObject['currency_object.id'],
					name: rowObject['currency_object.name'],
					user_code: rowObject['currency_object.user_code'],
					content_type: "currencies.currency"
				};

			}

			if (rowObject['position_size']) {
				contextData.position = rowObject['position_size'];
			}

			if (reportOptions['pricing_policy']) {
				contextData.pricing_policy = reportOptions.pricing_policy;
				contextData.pricing_policy_object = Object.assign({}, reportOptions.pricing_policy_object)
			}

			/* if (rowObject['pricing_currency.id']) {
				contextData.pricing_currency = rowObject['pricing_currency.id'];
				contextData.pricing_currency_object = {
					id: rowObject['pricing_currency.id'],
					name: rowObject['pricing_currency.name'],
					user_code: rowObject['pricing_currency.user_code'],
					content_type: "currencies.currency"
				};
			} */

			if (rowObject['instrument.pricing_currency.id']) {
				contextData.pricing_currency = rowObject['instrument.pricing_currency.id'];
				contextData.pricing_currency_object = {
					id: rowObject['instrument.pricing_currency.id'],
					name: rowObject['instrument.pricing_currency.name'],
					user_code: rowObject['instrument.pricing_currency.user_code'],
					content_type: "currencies.currency"
				};
			}

			if (rowObject['instrument.accrued_currency.id']) {
				contextData.accrued_currency = rowObject['instrument.accrued_currency.id'];
				contextData.accrued_currency_object = {
					id: rowObject['instrument.accrued_currency.id'],
					name: rowObject['instrument.accrued_currency.name'],
					user_code: rowObject['instrument.accrued_currency.user_code'],
					content_type: "currencies.currency"
				};
			}

			if (rowObject['instrument.id']) {
				contextData.instrument = rowObject['instrument.id'];
				contextData.instrument_object = {
					id: rowObject['instrument.id'],
					name: rowObject['instrument.name'],
					user_code: rowObject['instrument.user_code'],
					content_type: "instruments.instrument"
				};
			}

			if (rowObject['allocation_balance.id']) {
				contextData.allocation_balance = rowObject['allocation_balance.id'];
				contextData.allocation_balance_object = {
					id: rowObject['allocation_balance.id'],
					name: rowObject['allocation_balance.name'],
					user_code: rowObject['allocation_balance.user_code'],
					content_type: "instruments.instrument"
				};
			}

			if (rowObject['allocation_pl.id']) {
				contextData.allocation_pl = rowObject['allocation_pl.id'];
				contextData.allocation_pl_object = {
					id: rowObject['allocation_pl.id'],
					name: rowObject['allocation_pl.name'],
					user_code: rowObject['allocation_pl.user_code'],
					content_type: "instruments.instrument"
				};
			}

			if (rowObject['portfolio.id']) {
				contextData.portfolio = rowObject['portfolio.id'];
				contextData.portfolio_object = {
					id: rowObject['portfolio.id'],
					name: rowObject['portfolio.name'],
					user_code: rowObject['portfolio.user_code'],
					content_type: "portfolios.portfolio"
				};
			}

			if (rowObject['account.id']) {
				contextData.account = rowObject['account.id'];
				contextData.account_object = {
					id: rowObject['account.id'],
					name: rowObject['account.name'],
					user_code: rowObject['account.user_code'],
					content_type: "accounts.account"
				};
			}

			if (rowObject['strategy1.id']) {
				contextData.strategy1 = rowObject['strategy1.id'];
				contextData.strategy1_object = {
					id: rowObject['strategy1.id'],
					name: rowObject['strategy1.name'],
					user_code: rowObject['strategy1.user_code'],
					content_type: "strategies.strategy1"
				};
			}

			if (rowObject['strategy2.id']) {
				contextData.strategy2 = rowObject['strategy2.id'];
				contextData.strategy2_object = {
					id: rowObject['strategy2.id'],
					name: rowObject['strategy2.name'],
					user_code: rowObject['strategy2.user_code'],
					content_type: "strategies.strategy2"
				};
			}

			if (rowObject['strategy3.id']) {
				contextData.strategy3 = rowObject['strategy3.id'];
				contextData.strategy3_object = {
					id: rowObject['strategy3.id'],
					name: rowObject['strategy3.name'],
					user_code: rowObject['strategy3.user_code'],
					content_type: "strategies.strategy3"
				};
			}

			return contextData;
		};

		const createEntity = function (event, locals) {

			var dialogController = 'EntityViewerAddDialogController as vm';
			var dialogTemplateUrl = 'views/entity-viewer/entity-viewer-add-dialog-view.html';

			if (locals.entityType && locals.entityType === 'complex-transaction') {
				dialogController = 'ComplexTransactionAddDialogController as vm';
				dialogTemplateUrl = 'views/entity-viewer/complex-transaction-add-dialog-view.html';
			}

			$mdDialog.show({
				controller: dialogController,
				templateUrl: dialogTemplateUrl,
				parent: angular.element(document.body),
				targetEvent: event,
				locals: locals
			}).then(function (res) {

				if (res && res.status === 'agree') {

					const autoRefreshState = viewModel.entityViewerDataService.getAutoRefreshState();

					if (autoRefreshState) {
						viewModel.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
					}

				}

				updateTableAfterEntityChanges(res);

			});

		};

		const editEntity = function (activeObject, locals) {

			var dialogController = 'EntityViewerEditDialogController as vm';
			var dialogTemplateUrl = 'views/entity-viewer/entity-viewer-edit-dialog-view.html';

			locals.openedIn = 'modal';

			if (locals.entityType && locals.entityType === 'complex-transaction') {
				dialogController = 'ComplexTransactionEditDialogController as vm';
				dialogTemplateUrl = 'views/entity-viewer/complex-transaction-edit-dialog-view.html';
			}

			$mdDialog.show({
				controller: dialogController,
				templateUrl: dialogTemplateUrl,
				parent: angular.element(document.body),
				targetEvent: activeObject.event,
				locals: locals

			}).then(function (res) {

				const autoRefreshState = viewModel.entityViewerDataService.getAutoRefreshState();

				if (autoRefreshState) {
					viewModel.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
				}

				updateTableAfterEntityChanges(res);

			});

		};

		const offerToCreateEntity = function (event, warningDescription, createEntityLocals) {

			/* $mdDialog.show({
				controller: 'WarningDialogController as vm',
				templateUrl: 'views/dialogs/warning-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: event,
				preserveScope: true,
				autoWrap: true,
				multiple: true,
				skipHide: true,
				locals: {
					warning: {
						title: 'Warning',
						description: warningDescription
					}
				}

			}).then(function (res) {
				if (res.status === 'agree') {

					createEntity(event, createEntityLocals);

				}
			}); */

			const warningLocals = {
				warning: {
					title: 'Warning',
					description: warningDescription
				}
			};

			commonDialogsService.warning(warningLocals).then(function (res) {
				if (res.status === 'agree') {

					createEntity(event, createEntityLocals);

				}
			});

		};


		const executeRowAction = function () {

			const actionData = viewModel.entityViewerDataService.getRowsActionData();
			const action = actionData.actionKey;
			const reportOptions = viewModel.entityViewerDataService.getReportOptions();
			let flatList = viewModel.entityViewerDataService.getFlatList();
			const activeRowIndex = flatList.findIndex(object => object.___is_activated);
			const activeRowExist = activeRowIndex > -1;

			let currencies = reportOptions.item_currencies;

			var getCurrencyObject = function (currencyKey) {
				let currencyObj = {};

				currencies.forEach(function (item) {

					if (item.id === actionData.object[currencyKey]) {
						currencyObj.id = item.id;
						currencyObj.name = item.name;
						currencyObj.short_name = item.short_name;
						currencyObj.user_code = item.user_code;
					}

				});

				return currencyObj;
			};

			// if (activeObject) {
			if (actionData.object || activeRowExist) {

				if (action === 'edit_instrument') {

					var locals = {
						entityType: 'instrument',
						entityId: actionData.object['instrument.id'],
						data: {}
					};

					editEntity(actionData.event, locals);
				}
				else if (action === 'edit_account') {

					var locals = {
						entityType: 'account',
						entityId: actionData.object['account.id'],
						data: {}
					};

					editEntity(actionData.event, locals);

				}
				else if (action === 'edit_portfolio') {

					var locals = {
						entityType: 'portfolio',
						entityId: actionData.object['portfolio.id'],
						data: {}
					};

					editEntity(actionData.event, locals);

				}
				else if (action === 'edit_currency') {

					var locals = {
						entityType: 'currency',
						entityId: actionData.object['currency.id'],
						data: {}
					};

					editEntity(actionData.event, locals);

				}
				else if (action === 'edit_pricing_currency') {

					var locals = {
						entityType: 'currency',
						entityId: actionData.object['instrument.pricing_currency.id'],
						data: {}
					};

					editEntity(actionData.event, locals);

				}
				else if (action === 'edit_accrued_currency') {

					var locals = {
						entityType: 'currency',
						entityId: actionData.object['instrument.accrued_currency.id'],
						data: {}
					};

					editEntity(actionData.event, locals);

				}
				else if (action === 'edit_price') {

					var filters = {
						instrument: actionData.object['instrument.id'],
						pricing_policy: reportOptions.pricing_policy,
						date_after: reportOptions.report_date,
						date_before: reportOptions.report_date
					};

					priceHistoryService.getList({filters: filters}).then(function (data) {

						if (data.results.length) {

							var item = data.results[0];

							var locals = {
								entityType: 'price-history',
								entityId: item.id,
								data: {}
							};

							editEntity(actionData.event, locals);

						} else {

							var warningDescription = 'No corresponding record in Price History. Do you want to add the record?';

							var createEntityLocals = {
								entityType: 'price-history',
								entity: {
									instrument: actionData.object['instrument.id'],
									instrument_object: {
										id: actionData.object['instrument.id'],
										name: actionData.object['instrument.name'],
										user_code: actionData.object['instrument.user_code'],
										short_name: actionData.object['instrument.short_name']
									},
									pricing_policy: reportOptions.pricing_policy,
									pricing_policy_object: reportOptions.pricing_policy_object,
									date: reportOptions.report_date
								},
								data: {}
							};

							offerToCreateEntity(actionData.event, warningDescription, createEntityLocals);

						}

					})


				}
				else if (action === 'edit_fx_rate') {

					var filters = {
						currency: actionData.object['currency.id'],
						pricing_policy: reportOptions.pricing_policy,
						date_0: reportOptions.report_date,
						date_1: reportOptions.report_date
					};

					currencyHistoryService.getList({filters: filters}).then(function (data) {

						if (data.results.length) {

							var item = data.results[0];
							let contextData = getContextDataForRowAction(reportOptions, actionData.object);
							contextData.date = reportOptions.report_date

							var locals = {
								entityType: 'currency-history',
								entityId: item.id,
								contextData: contextData,
								data: {}
							};

							editEntity(actionData.event, locals);

						} else {

							var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';
							var createEntityLocals = {
								entityType: 'currency-history',
								entity: {
									currency: actionData.object['currency.id'],
									currency_object: {
										id: actionData.object['currency.id'],
										name: actionData.object['currency.name'],
										short_name: actionData.object['currency.short_name'],
										user_code: actionData.object['currency.user_code']
									},
									pricing_policy: reportOptions.pricing_policy,
									pricing_policy_object: reportOptions.pricing_policy_object,
									date: reportOptions.report_date
								},
								data: {}
							};

							offerToCreateEntity(actionData.event, warningDescription, createEntityLocals);

						}

					})

				}
				else if (action === 'edit_pricing_currency_price' && actionData.object.id) {

					var filters = {
						currency: actionData.object['instrument.pricing_currency'],
						instrument: actionData.object['instrument.id'],
						pricing_policy: reportOptions.pricing_policy,
						date_0: reportOptions.report_date,
						date_1: reportOptions.report_date
					};

					currencyHistoryService.getList({filters: filters}).then(function (data) {

						if (data.results.length) {

							var item = data.results[0];

							var locals = {
								entityType: 'currency-history',
								entityId: item.id,
								data: {}
							};

							editEntity(actionData.event, locals);

						} else {

							var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

							var currency_object = getCurrencyObject('instrument.pricing_currency.id');
							var createEntityLocals = {
								entityType: 'currency-history',
								entity: {
									currency: actionData.object['instrument.pricing_currency'],
									currency_object: currency_object,
									pricing_policy: reportOptions.pricing_policy,
									pricing_policy_object: reportOptions.pricing_policy_object,
									date: reportOptions.report_date
								},
								data: {}
							};

							offerToCreateEntity(actionData.event, warningDescription, createEntityLocals);

						}

					})

				}
				else if (action === 'edit_accrued_currency_fx_rate' && actionData.object.id) {

					var filters = {
						currency: actionData.object['instrument.accrued_currency.id'],
						// instrument: actionData.object['instrument.id'],
						pricing_policy: reportOptions.pricing_policy,
						date_0: reportOptions.report_date,
						date_1: reportOptions.report_date
					};

					currencyHistoryService.getList({filters: filters}).then(function (data) {

						if (data.results.length) {

							var item = data.results[0];

							var locals = {
								entityType: 'currency-history',
								entityId: item.id,
								data: {}
							};

							editEntity(actionData.event, locals);

						} else {

							var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

							var currency_object = getCurrencyObject('instrument.accrued_currency');
							var createEntityLocals = {
								entityType: 'currency-history',
								entity: {
									currency: actionData.object['instrument.accrued_currency'],
									currency_object: currency_object,
									pricing_policy: reportOptions.pricing_policy,
									pricing_policy_object: reportOptions.pricing_policy_object,
									date: reportOptions.report_date
								},
								data: {}
							};

							offerToCreateEntity(actionData.event, warningDescription, createEntityLocals);


						}

					})

				}
				else if (action === 'edit_pricing_currency_fx_rate' && actionData.object.id) {

					var filters = {
						currency: actionData.object['instrument.pricing_currency.id'],
						// instrument: actionData.object['instrument.id'],
						pricing_policy: reportOptions.pricing_policy,
						date_0: reportOptions.report_date,
						date_1: reportOptions.report_date
					};

					currencyHistoryService.getList({filters: filters}).then(function (data) {

						if (data.results.length) {

							var item = data.results[0];

							var locals = {
								entityType: 'currency-history',
								entityId: item.id,
								data: {}
							};

							editEntity(actionData.event, locals);

						} else {

							var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

							var currency_object = getCurrencyObject('instrument.pricing_currency.id');
							var createEntityLocals = {
								entityType: 'currency-history',
								entity: {
									currency: actionData.object['instrument.pricing_currency.id'],
									currency_object: currency_object,
									pricing_policy: reportOptions.pricing_policy,
									pricing_policy_object: reportOptions.pricing_policy_object,
									date: reportOptions.report_date
								},
								data: {}
							};

							offerToCreateEntity(actionData.event, warningDescription, createEntityLocals);


						}

					})

				}
				else if (action === 'book_transaction') {

					var locals = {
						entityType: 'complex-transaction',
						entity: {},
						data: {}
					};

					if (viewModel.entityType === 'transaction-report') {

						const contextData = getContextDataForRowAction(reportOptions, actionData.object);
						locals.entity.transaction_type = actionData.object['complex_transaction.transaction_type.id'];
						locals.data.contextData = contextData;

					}

					createEntity(actionData.event, locals);

				}
				else if (action === 'book_transaction_specific') {

					const contextData = getContextDataForRowAction(reportOptions, actionData.object);

					var locals = {
						entityType: 'complex-transaction',
						entity: {},
						data: {
							contextData: contextData
						}
					};

					if (actionData && actionData.id) {
						locals.entity.transaction_type = actionData.id
					}

					createEntity(actionData.event, locals);

				}
				else if (action === 'rebook_transaction') {

					var complex_transaction_id = actionData.object['complex_transaction.id'] || actionData.object['complex_transaction']

					var locals = {
						entityType: 'complex-transaction',
						entityId: complex_transaction_id,
						data: {}
					};

					editEntity(actionData.event, locals);

				}
			}

		};

        return {
			setLayoutDataForView: setLayoutDataForView,
			downloadAttributes: downloadAttributes,
            calculateReportDatesExprs: calculateReportDatesExprs,
            onSetLayoutEnd: onSetLayoutEnd,

			updateTableAfterEntityChanges: updateTableAfterEntityChanges,
			executeRowAction: executeRowAction,
        }

    }

}());