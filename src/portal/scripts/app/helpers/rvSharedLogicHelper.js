'use strict';

// import CommonDialogsService from "../../../../shell/scripts/app/services/commonDialogsService";
// import localStorageService from "../../../../shell/scripts/app/services/localStorageService";

(function () {

    var CommonDialogsService = require("../../../../shell/scripts/app/services/commonDialogsService").default;
    var localStorageService = require("../../../../shell/scripts/app/services/localStorageService");

    const evEvents = require('../services/entityViewerEvents');

    const rvHelper = require('../helpers/rv.helper')

    module.exports = function (viewModel, $scope, $mdDialog, toastNotificationService, globalDataService, pricingPolicyService, priceHistoryService, currencyHistoryService, metaContentTypesService, pricesCheckerService, expressionService, rvDataProviderService, reportHelper) {

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
                    promises.push(viewModel.attributeDataService.downloadComplexTransactionUserFields());
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

            console.log('putUseFromAboveFiltersFirst.filters', filters);

            allFilters = useFromAboveFiters.concat(filters);

            viewModel.entityViewerDataService.setFilters(allFilters);

        };

        const setLayoutDataForView = function () {

            viewModel.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
            viewModel.entityViewerDataService.setContentType($scope.$parent.vm.contentType);
            viewModel.entityViewerDataService.setIsReport(true);
            viewModel.entityViewerDataService.setCurrentMember(viewModel.currentMember);
            // viewModel.entityViewerDataService.setVirtualScrollStep(200);
            viewModel.entityViewerDataService.setVirtualScrollStep(50);

            viewModel.entityViewerDataService.setRowHeight(36);

            // var rowFilterColor = localStorageService.getRowTypeFilter(true, viewModel.entityType);
            const rvSettings = globalDataService.getMemberEntityViewersSettings(true, viewModel.entityType);
            let rowTypeFiltersData = viewModel.entityViewerDataService.getRowTypeFilters();
            rowTypeFiltersData.markedRowFilters = rvSettings.row_type_filter;

            viewModel.entityViewerDataService.setRowTypeFilters(rowTypeFiltersData);

        };

        const onSetLayoutEnd = () => {

            viewModel.readyStatus.layout = true;

            let reportOptions = viewModel.entityViewerDataService.getReportOptions();
            const entityType = viewModel.entityViewerDataService.getEntityType();

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

            const viewContext = viewModel.entityViewerDataService.getViewContext();


            var localStorageReportData = localStorageService.getReportData();

            console.log('onSetLayoutEnd.localStorageReportData', localStorageReportData);

            var layout = viewModel.entityViewerDataService.getListLayout();
            var contentType = viewModel.entityViewerDataService.getContentType();

            viewModel.possibleToRequestReport = true // in case if user open too many groups, then we need to ask him if his ready

            if (localStorageReportData) {

                if (localStorageReportData[contentType]) {

                    if (localStorageReportData[contentType][layout.user_code]) {

                        if (localStorageReportData[contentType][layout.user_code].hasOwnProperty('groups')) {

                            viewModel.openGroupsCount = 0;

                            Object.keys(localStorageReportData[contentType][layout.user_code].groups).forEach(function (key) {

                                var _group = localStorageReportData[contentType][layout.user_code].groups[key]

                                if (_group.is_open) {
                                    viewModel.openGroupsCount = viewModel.openGroupsCount + 1;
                                }

                            })

                            if (viewModel.openGroupsCount > 10) {
                                viewModel.possibleToRequestReport = false;
                            }

                        }

                    }
                }

            }

            if (viewModel.possibleToRequestReport) {

                if (viewContext !== 'split_panel' || entityType !== 'transaction-report') {

                    if (viewContext === 'dashboard') {

                        // in that context we control in dashboard report viewer controller via applyDashboardLayoutState
                        //

                        // If we are in matrix, then we do not need request normal report,
                        // matrix will handle on it own
                        // TODO refactor, put matrix separately from Report
                        // if (!viewModel.matrixSettings) {
                        //     rvDataProviderService.updateDataStructure(viewModel.entityViewerDataService, viewModel.entityViewerEventService);
                        // }




                    } else {

                        rvDataProviderService.updateDataStructure(viewModel.entityViewerDataService, viewModel.entityViewerEventService);
                        // Frontend is deprecated since 2023-09-10
                        // if (window.location.href.indexOf('v2=true') !== -1) {
                        //     rvDataProviderService.updateDataStructure(viewModel.entityViewerDataService, viewModel.entityViewerEventService);
                        // } else {
                        //     rvDataProviderService.requestReport(viewModel.entityViewerDataService, viewModel.entityViewerEventService);
                        // }
                    }
                }

            }
            $scope.$apply();

            return viewModel.readyStatus.layout;

        };

        var datePropsMatchData = {
            'balance-report': {
                'report_date': 'report_date',
                'end_date': 'report_date'
            },
            'pl-report': {
                'pl_first_date': 'pl_first_date',
                'report_date': 'report_date',
                'begin_date': 'pl_first_date',
                'end_date': 'report_date'
            },
            'transaction-report': {
                'pl_first_date': 'begin_date',
                'report_date': 'end_date',
                'begin_date': 'begin_date',
                'end_date': 'end_date'
            }
        };

        /**
         *
         * @param {String} contentType - anotherLayout.content_type
         * @param {Object} reportOptions - anotherLayout.data.reportOptions
         * @param {Object} reportLayoutOptions - anotherLayout.data.reportLayoutOptions
         * @returns {Promise<{-readonly [P in keyof *[]]: PromiseSettledResult<Awaited<*[][P]>>}>}
         */
        const applyDatesFromAnotherLayout = function (contentType, reportOptions, reportLayoutOptions) {

            const result = [];
            const pEntityType = metaContentTypesService.findEntityByContentType(contentType);
            const dateProps = reportHelper.getDateProperties(viewModel.entityType);
            const activeLayoutRo = viewModel.entityViewerDataService.getReportOptions();

            dateProps.forEach(prop => {

                if (prop) {

                    const matchingProp = datePropsMatchData[pEntityType][prop];

                    const prom = new Promise((resolve, reject) => {

                        if (!matchingProp) { // for pl_first_date, begin_date when applying date from balance report
                            activeLayoutRo[prop] = '0001-01-01';
                            return resolve();
                        }

                        reportHelper.getReportDate(reportOptions, reportLayoutOptions, matchingProp).then(date => {


                            // resolve({key: prop, value: date})
                            activeLayoutRo[prop] = date;
                            resolve();

                        }).catch(error => reject(error));

                    });

                    result.push(prom)

                }

            });

            return Promise.allSettled(result);

        };

        /**
         * Supports calculateReportDatesExprs function
         *
         * @param {string} dateExpr
         * @param {Object} reportOptions
         * @param {Number} reportDateIndex
         * @returns {Promise<unknown>}
         */
        const calcReportDateExpr = function (dateExpr, reportOptions, reportDateIndex) {

            // const dateProp = reportDateProperties[viewModel.entityType][reportDateIndex];
            const dateProp = reportHelper.getDateProperties(viewModel.entityType)[reportDateIndex];

            /*const result = expressionService.getResultOfExpression({"expression": dateExpr}).then(function (data) {
                reportOptions[dateProp] = data.result
            });

            dateExprsProms.push(result);*/

            return new Promise((resolve, reject) => {

                expressionService.getResultOfExpression({"expression": dateExpr}).then(function (data) {

                    reportOptions[dateProp] = data.result;
                    resolve();

                }).catch(error => reject(error));

            });

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

            if (firstDateExpr && !options.noDateFromExpr) {

                var dateFromProm = calcReportDateExpr(firstDateExpr, reportOptions, 0);
                dateExprsProms.push(dateFromProm);

            }

            if (secondDateExpr && !options.noDateToExpr) {

                var dateToProm = calcReportDateExpr(secondDateExpr, reportOptions, 1);
                dateExprsProms.push(dateToProm);

            }

            return Promise.all(dateExprsProms);

        };

        //region Execute actions from report viewer table

        var updateTableAfterEntityChanges = function (res) {

            const autoRefreshState = viewModel.entityViewerDataService.getAutoRefreshState();

            if (autoRefreshState) {
                viewModel.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
            } else {

                viewModel.entityViewerDataService.setRowsActionData(null);

                if (res && res.status === 'agree') {

                    /*viewModel.entityViewerDataService.resetTableContent(true);

                    viewModel.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);*/
                    viewModel.entityViewerEventService.dispatchEvent(evEvents.CREATE_TABLE);

                    const viewContext = viewModel.entityViewerDataService.getViewContext();
                    if (viewContext === 'split_panel') viewModel.parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

            }

        };

        const createEntity = function (locals) {

            var dialogController = 'EntityViewerAddDialogController as vm';
            var dialogTemplateUrl = 'views/entity-viewer/entity-viewer-add-dialog-view.html';

            if (locals.entityType && locals.entityType === 'complex-transaction') {
                dialogController = 'ComplexTransactionAddDialogController as vm';
                dialogTemplateUrl = 'views/entity-viewer/complex-transaction-add-dialog-view.html';
            }

            $mdDialog.show({
                controller: dialogController,
                templateUrl: dialogTemplateUrl,
                parent: document.querySelector('.dialog-containers-wrap'),
                locals: locals
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    const autoRefreshState = viewModel.entityViewerDataService.getAutoRefreshState();

                    if (autoRefreshState) {
                        viewModel.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                    }

                    updateTableAfterEntityChanges(res);

                }


            })

        };

        const editEntity = function (activeObject, locals) {

            var dialogController = 'EntityViewerEditDialogController as vm';
            var dialogTemplateUrl = 'views/entity-viewer/entity-viewer-edit-dialog-view.html';

            locals.openedIn = 'modal';

            if (locals.entityType === 'complex-transaction') {
                dialogController = 'ComplexTransactionEditDialogController as vm';
                dialogTemplateUrl = 'views/entity-viewer/complex-transaction-edit-dialog-view.html';
            }

            $mdDialog.show({
                controller: dialogController,
                templateUrl: dialogTemplateUrl,
                parent: document.querySelector('.dialog-containers-wrap'),
                targetEvent: activeObject.event,
                locals: locals

            }).then(function (res) {

                console.log('res', res);

                if (res.status === 'copy') {

                    locals = {
                        entity: res.data.entity,
                        entityType: res.data.entityType,
                        data: {
                            openedIn: 'modal',
                        }
                    };

                    if (locals.entityType === 'complex-transaction') {

                        locals.data.isCopy = true;
                        locals.data.originalComplexTransaction = res.data.originalComplexTransaction;

                    }

                    createEntity(locals);

                } else if (res.status !== 'disagree') {

                    updateTableAfterEntityChanges(res);

                }
            });

        };

        const getTooManyError = function (serviceName, resultsLength) {
            return `Error [rvSharedLogicHelper ${serviceName}.getList()] ` +
                `Expected 0 or 1 objects got: ${resultsLength}`
        };

        /**
         *
         * @param {String} warningDescription
         * @param {String} entityType
         * @param {Object} localsData - dota for locals for $mdDialog
         * @param {String} pricingPolicyUc - user code of pricing policy
         * @return {Promise<void>}
         */
        const offerToCreateEntity = async function (warningDescription, entityType, localsData, pricingPolicyUc) {

            const warningLocals = {
                warning: {
                    title: 'Warning',
                    description: warningDescription
                }
            };

            const res = await commonDialogsService.warning(warningLocals);

            if (res.status === 'agree') {

                var pp = await pricingPolicyService.getByUserCode(pricingPolicyUc);

                localsData.entity.pricing_policy = pp.id;
                localsData.entity.pricing_policy_object = pp;

                createEntity(localsData);

            }

        }


        const executeRowAction = async function () {

            const actionData = viewModel.entityViewerDataService.getRowsActionData();
            const action = actionData.actionKey;
            const reportOptions = viewModel.entityViewerDataService.getReportOptions();
            let flatList = viewModel.entityViewerDataService.getFlatList();
            const activeRowIndex = flatList.findIndex(object => object.___is_activated);
            const activeRowExist = activeRowIndex > -1;

            if (viewModel.entityType !== 'transaction-report' &&
                (!reportOptions.pricing_policy || typeof reportOptions.pricing_policy !== 'string') ) {

                toastNotificationService.clientError(
                    "Invalid 'Pricing Policy' inside Report options",
                );

                throw "Error [rvSharedLogicHelper.executeRowAction] invalid value inside " +
                    `reportOptions.pricing_policy ${reportOptions.pricing_policy}`;

            }

            var getCurrencyObjectFromActionData = function (currencyKeyStart) {

                const wrongKey = ![
                    'instrument.pricing_currency',
                    'instrument.accrued_currency'
                ].includes(currencyKeyStart);

                if (wrongKey) {
                    throw `Error [rvSharedLogicHelper.getCurrencyObjectFromActionData] wrong key: ${currencyKeyStart}`
                }

                return {
                    id: actionData.object[currencyKeyStart + '.id'],
                    name: actionData.object[currencyKeyStart + '.name'],
                    user_code: actionData.object[currencyKeyStart + '.user_code'],
                    short_name: actionData.object[currencyKeyStart + '.short_name']
                };
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
                } else if (action === 'edit_account') {

                    var locals = {
                        entityType: 'account',
                        entityId: actionData.object['account.id'],
                        data: {}
                    };

                    editEntity(actionData.event, locals);

                } else if (action === 'edit_portfolio') {

                    var locals = {
                        entityType: 'portfolio',
                        entityId: actionData.object['portfolio.id'],
                        data: {}
                    };

                    editEntity(actionData.event, locals);

                } else if (action === 'edit_currency') {

                    var locals = {
                        entityType: 'currency',
                        entityId: actionData.object['currency.id'],
                        data: {}
                    };

                    editEntity(actionData.event, locals);

                } else if (action === 'edit_pricing_currency') {

                    var locals = {
                        entityType: 'currency',
                        entityId: actionData.object['instrument.pricing_currency.id'],
                        data: {}
                    };

                    editEntity(actionData.event, locals);

                } else if (action === 'edit_accrued_currency') {

                    var locals = {
                        entityType: 'currency',
                        entityId: actionData.object['instrument.accrued_currency.id'],
                        data: {}
                    };

                    editEntity(actionData.event, locals);

                }
                else if (action === 'edit_price') { // TODO: hide option for transaction report

                    var filters = {
                        instrument: actionData.object['instrument.id'],
                        date_after: reportOptions.report_date,
                        date_before: reportOptions.report_date,
                        pricing_policy: reportOptions.pricing_policy
                    };

                    priceHistoryService.getList({filters: filters}).then(function (data) {

                        if (data.results.length) {

                            if (data.results.length > 1) {
                                throw `${ getTooManyError("priceHistoryService", data.results.length) }`;
                            }

                            var item = data.results[0];

                            var locals = {
                                entityType: 'price-history',
                                entityId: item.id,
                                data: {}
                            };

                            editEntity(actionData.event, locals);

                        } else {

                            var warningDescription = 'No corresponding record in Price History. Do you want to add the record?';

                            let localsData = {
                                entityType: 'price-history',
                                entity: {
                                    instrument: actionData.object['instrument.id'],
                                    instrument_object: {
                                        id: actionData.object['instrument.id'],
                                        name: actionData.object['instrument.name'],
                                        user_code: actionData.object['instrument.user_code'],
                                        short_name: actionData.object['instrument.short_name']
                                    },
                                    date: reportOptions.report_date
                                },
                                data: {}
                            };

                            offerToCreateEntity(warningDescription, viewModel.entityType, localsData, reportOptions.pricing_policy);

                        }

                    })


                }
                else if (action === 'edit_fx_rate') {

                    var filters = {
                        currency: actionData.object['currency.id'],
                        pricing_policy: reportOptions.pricing_policy,
                        date_after: reportOptions.report_date,
                        date_before: reportOptions.report_date,
                    };

                    currencyHistoryService.getList({filters: filters}).then(async function (data) {

                        if (data.results.length) {

                            if (data.results.length > 1) {
                                throw `${getTooManyError("currencyHistoryService", data.results.length)}`;
                            }

                            var item = data.results[0];

                            let contextData = await rvHelper.getContextDataForRowAction(reportOptions, actionData.object, viewModel.entityType, pricingPolicyService);
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

                            let localsData = {
                                entityType: 'currency-history',
                                entity: {
                                    currency: actionData.object['currency.id'],
                                    currency_object: {
                                        id: actionData.object['currency.id'],
                                        name: actionData.object['currency.name'],
                                        short_name: actionData.object['currency.short_name'],
                                        user_code: actionData.object['currency.user_code']
                                    },
                                    date: reportOptions.report_date
                                },
                                data: {}
                            };

                            offerToCreateEntity(warningDescription, viewModel.entityType, localsData, reportOptions.pricing_policy);

                        }

                    })

                }
                else if (action === 'edit_accrued_currency_fx_rate' && actionData.object.id) { // TODO: hide for transaction-report

                    var filters = {
                        currency: actionData.object['instrument.accrued_currency.id'],
                        pricing_policy: reportOptions.pricing_policy,
                        date_after: reportOptions.report_date,
                        date_before: reportOptions.report_date
                    };

                    currencyHistoryService.getList({filters: filters}).then(function (data) {

                        if (data.results.length) {

                            if (data.results.length > 1) {
                                throw `${getTooManyError("currencyHistoryService", data.results.length)}`;
                            }

                            var item = data.results[0];

                            var locals = {
                                entityType: 'currency-history',
                                entityId: item.id,
                                data: {}
                            };

                            editEntity(actionData.event, locals);

                        }
                        else {

                            const warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

                            let localsData = {
                                entityType: 'currency-history',
                                entity: {
                                    currency: actionData.object['instrument.accrued_currency.id'],
                                    currency_object: getCurrencyObjectFromActionData('instrument.accrued_currency'),
                                    date: reportOptions.report_date
                                },
                                data: {}
                            };

                            offerToCreateEntity(warningDescription, viewModel.entityType, localsData, reportOptions.pricing_policy);


                        }

                    })

                }
                else if (action === 'edit_pricing_currency_fx_rate' && actionData.object.id) { // TODO: hide for transaction-report

                    var filters = {
                        currency: actionData.object['instrument.pricing_currency.id'],
                        pricing_policy: reportOptions.pricing_policy,
                        date_after: reportOptions.report_date,
                        date_before: reportOptions.report_date
                    };

                    currencyHistoryService.getList({filters: filters}).then(function (data) {

                        if (data.results.length) {

                            if (data.results.length > 1) {
                                throw `${getTooManyError("currencyHistoryService", data.results.length)}`;
                            }

                            var item = data.results[0];

                            var locals = {
                                entityType: 'currency-history',
                                entityId: item.id,
                                data: {}
                            };

                            editEntity(actionData.event, locals);

                        }
                        else {

                            var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

                            const localsData = {
                                entityType: 'currency-history',
                                entity: {
                                    currency: actionData.object['instrument.pricing_currency.id'],
                                    currency_object: getCurrencyObjectFromActionData('instrument.pricing_currency'),
                                    date: reportOptions.report_date
                                },
                                data: {}
                            };

                            offerToCreateEntity(warningDescription, viewModel.entityType, localsData, reportOptions.pricing_policy);

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

                        locals.entity.transaction_type = actionData.object['complex_transaction.transaction_type.id'];

                    }

                    // const contextData = getContextDataForRowAction(reportOptions, actionData.object);
                    locals.data.contextData = await rvHelper.getContextDataForRowAction(reportOptions, actionData.object, viewModel.entityType, pricingPolicyService);

                    createEntity(locals);

                }
                else if (action === 'book_transaction_specific') {

                    // const contextData = getContextDataForRowAction(reportOptions, actionData.object);
                    const contextData = await rvHelper.getContextDataForRowAction(reportOptions, actionData.object, viewModel.entityType, pricingPolicyService);

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

                    createEntity(locals);

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
                else if ( action === 'copy_transaction' ) {

                    var complex_transaction_id = actionData.object['complex_transaction.id'] || actionData.object['complex_transaction']

                    var locals = {
                        entityType: 'complex-transaction',
                        entityId: complex_transaction_id,
                        data: {
                            copy: true,
                        }
                    };

                    editEntity(actionData.event, locals);

                }

            }

        };

        const executeUserRequestedAction = function () {

            var action = viewModel.entityViewerDataService.getUserRequestedAction();

            console.log('USER_REQUEST_AN_ACTION action', action)

            if (action === 'add_portfolio') {

                var locals = {
                    entityType: 'portfolio',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            } else if (action === 'add_instrument') {

                var locals = {
                    entityType: 'instrument',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            } else if (action === 'add_account') {

                var locals = {
                    entityType: 'account',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            } else if (action === 'add_currency') {

                var locals = {
                    entityType: 'currency',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            } else if (action === 'add_price') {

                var locals = {
                    entityType: 'price-history',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            } else if (action === 'add_fx_rate') {

                var locals = {
                    entityType: 'currency-history',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            }

            if (action === 'book_transaction') {

                var locals = {
                    entityType: 'complex-transaction',
                    entity: {},
                    data: {}
                };

                createEntity(locals);

            }
        }

        return {
            setLayoutDataForView: setLayoutDataForView,
            downloadAttributes: downloadAttributes,
            applyDatesFromAnotherLayout: applyDatesFromAnotherLayout,
            calculateReportDatesExprs: calculateReportDatesExprs,
            onSetLayoutEnd: onSetLayoutEnd,

            updateTableAfterEntityChanges: updateTableAfterEntityChanges,
            executeRowAction: executeRowAction,
            executeUserRequestedAction: executeUserRequestedAction
        }

    }

}());