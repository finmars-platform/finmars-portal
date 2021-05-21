/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var metaService = require('../../services/metaService');
        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var evHelperService = require('../../services/entityViewerHelperService');
        var usersService = require('../../services/usersService');

        var priceHistoryService = require('../../services/priceHistoryService');
        var currencyHistoryService = require('../../services/currencyHistoryService');

        var RvSharedLogicHelper = require('../../helpers/rvSharedLogicHelper');
        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/eventService');
        var SplitPanelExchangeService = require('../../services/groupTable/exchangeWithSplitPanelService');
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');
        var pricesCheckerService = require('../../services/reports/pricesCheckerService');

        var expressionService = require('../../services/expression.service');
        // var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $stateParams, $transitions, middlewareService) {

            var vm = this;

            var rvSharedLogicHelper = new RvSharedLogicHelper(vm, $scope, $mdDialog);

            vm.readyStatus = {
                attributes: false,
                layout: false // changed by rvSharedLogicHelper.onSetLayoutEnd();
            };

            // var doNotCheckLayoutChanges = false;

            // Functions for context menu

            var updateTableAfterEntityChanges = function (res) {

                vm.entityViewerDataService.setActiveObjectAction(null);
                vm.entityViewerDataService.setActiveObjectActionData(null);

                if (res && res.res === 'agree') {

                    vm.entityViewerDataService.resetData();
                    vm.entityViewerDataService.resetRequestParameters();

                    var rootGroup = vm.entityViewerDataService.getRootGroupData();

                    vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                }

            };

            var getContextData = function (reportOptions, activeObject) {

                var report_date = null;
                var report_start_date = null;

                if (vm.entityType === 'balance-report') {
                    report_date = reportOptions.report_date;
                }

                if (vm.entityType === 'pl-report') {
                    report_date = reportOptions.report_date;
                    report_start_date = reportOptions.pl_first_date;
                }

                if (vm.entityType === 'transaction-report') {
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

                if (activeObject.item_type === 2) { // currency

                    contextData.currency = activeObject['currency.id'];
                    contextData.currency_object = {
                        id: activeObject['currency_object.id'],
                        name: activeObject['currency_object.name'],
                        user_code: activeObject['currency_object.user_code'],
                        content_type: "currencies.currency"
                    };

                }

                if (activeObject['position_size']) {
                    contextData.position = activeObject['position_size'];
                }

                if (reportOptions['pricing_policy']) {
                    contextData.pricing_policy = reportOptions.pricing_policy;
                    contextData.pricing_policy_object = Object.assign({}, reportOptions.pricing_policy_object)
                }

                if (activeObject['instrument.pricing_currency.id']) {
                    contextData.pricing_currency = activeObject['instrument.pricing_currency.id'];
                    contextData.pricing_currency_object = {
                        id: activeObject['instrument.pricing_currency.id'],
                        name: activeObject['instrument.pricing_currency.name'],
                        user_code: activeObject['instrument.pricing_currency.user_code'],
                        content_type: "currencies.currency"
                    };
                }

                if (activeObject['instrument.accrued_currency.id']) {
                    contextData.accrued_currency = activeObject['instrument.accrued_currency.id'];
                    contextData.accrued_currency_object = {
                        id: activeObject['instrument.accrued_currency.id'],
                        name: activeObject['instrument.accrued_currency.name'],
                        user_code: activeObject['instrument.accrued_currency.user_code'],
                        content_type: "currencies.currency"
                    };
                }

                if (activeObject['instrument.id']) {
                    contextData.instrument = activeObject['instrument.id'];
                    contextData.instrument_object = {
                        id: activeObject['instrument.id'],
                        name: activeObject['instrument.name'],
                        user_code: activeObject['instrument.user_code'],
                        content_type: "instruments.instrument"
                    };
                }

                if (activeObject['allocation_balance.id']) {
                    contextData.allocation_balance = activeObject['allocation_balance.id'];
                    contextData.allocation_balance_object = {
                        id: activeObject['allocation_balance.id'],
                        name: activeObject['allocation_balance.name'],
                        user_code: activeObject['allocation_balance.user_code'],
                        content_type: "instruments.instrument"
                    };
                }

                if (activeObject['allocation_pl.id']) {
                    contextData.allocation_pl = activeObject['allocation_pl.id'];
                    contextData.allocation_pl_object = {
                        id: activeObject['allocation_pl.id'],
                        name: activeObject['allocation_pl.name'],
                        user_code: activeObject['allocation_pl.user_code'],
                        content_type: "instruments.instrument"
                    };
                }

                if (activeObject['portfolio.id']) {
                    contextData.portfolio = activeObject['portfolio.id'];
                    contextData.portfolio_object = {
                        id: activeObject['portfolio.id'],
                        name: activeObject['portfolio.name'],
                        user_code: activeObject['portfolio.user_code'],
                        content_type: "portfolios.portfolio"
                    };
                }

                if (activeObject['account.id']) {
                    contextData.account = activeObject['account.id'];
                    contextData.account_object = {
                        id: activeObject['account.id'],
                        name: activeObject['account.name'],
                        user_code: activeObject['account.user_code'],
                        content_type: "accounts.account"
                    };
                }

                if (activeObject['strategy1.id']) {
                    contextData.strategy1 = activeObject['strategy1.id'];
                    contextData.strategy1_object = {
                        id: activeObject['strategy1.id'],
                        name: activeObject['strategy1.name'],
                        user_code: activeObject['strategy1.user_code'],
                        content_type: "strategies.strategy1"
                    };
                }

                if (activeObject['strategy2.id']) {
                    contextData.strategy2 = activeObject['strategy2.id'];
                    contextData.strategy2_object = {
                        id: activeObject['strategy2.id'],
                        name: activeObject['strategy2.name'],
                        user_code: activeObject['strategy2.user_code'],
                        content_type: "strategies.strategy2"
                    };
                }

                if (activeObject['strategy3.id']) {
                    contextData.strategy3 = activeObject['strategy3.id'];
                    contextData.strategy3_object = {
                        id: activeObject['strategy3.id'],
                        name: activeObject['strategy3.name'],
                        user_code: activeObject['strategy3.user_code'],
                        content_type: "strategies.strategy3"
                    };
                }

                return contextData;
            };

            var createEntity = function (activeObject, locals) {

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
                    targetEvent: activeObject.event,
                    locals: locals
                }).then(function (res) {

                    updateTableAfterEntityChanges(res);

                });

            };

            var editEntity = function (activeObject, locals) {

                var dialogController = 'EntityViewerEditDialogController as vm';
                var dialogTemplateUrl = 'views/entity-viewer/entity-viewer-edit-dialog-view.html';

                locals.openedIn = 'modal'

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

                    updateTableAfterEntityChanges(res);

                });

            };

            var offerToCreateEntity = function (activeObject, warningDescription, createEntityLocals) {

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: activeObject.event,
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

                        /*$mdDialog.show({
                            controller: 'EntityViewerAddDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'price-history',
                                entity: {
                                    instrument: activeObject['instrument.id'],
                                    instrument_object: {
                                        id: activeObject['instrument.id'],
                                        name: activeObject['instrument.name'],
                                        user_code: activeObject['instrument.user_code'],
                                        short_name: activeObject['instrument.short_name']
                                    },
                                    pricing_policy: reportOptions.pricing_policy,
                                    pricing_policy_object: reportOptions.pricing_policy_object,
                                    date: reportOptions.report_date
                                }
                            }
                        }).then(function (res) {

                            vm.entityViewerDataService.setActiveObjectAction(null);
                            vm.entityViewerDataService.setActiveObjectActionData(null);

                            if (res && res.res === 'agree') {

                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });*/

                        createEntity(activeObject, createEntityLocals);

                    }
                });

            };

            // < Functions for context menu >

            vm.setEventListeners = function () {

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    rvDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                    rvDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                    rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = vm.entityViewerDataService.getActiveObject();
                    var action = vm.entityViewerDataService.getActiveObjectAction();
                    var actionData = vm.entityViewerDataService.getActiveObjectActionData();
                    var reportOptions = vm.entityViewerDataService.getReportOptions();

                    var currencies = reportOptions.item_currencies;

                    var getCurrencyObject = function (currencyKey) {
                        var currencyObj = {};

                        currencies.forEach(function (item) {

                            if (item.id === activeObject[currencyKey]) {
                                currencyObj.id = item.id;
                                currencyObj.name = item.name;
                                currencyObj.short_name = item.short_name;
                                currencyObj.user_code = item.user_code;
                            }

                        });

                        return currencyObj;
                    };

                    console.log('activeObject', activeObject);
                    console.log('actionData', actionData);
                    console.log('action', action);

                    var contextData = getContextData(reportOptions, activeObject);

                    if (activeObject) {

                        if (action === 'edit_instrument') {

                            var locals = {
                                entityType: 'instrument',
                                entityId: activeObject['instrument.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);
                        }

                        if (action === 'edit_account') {

                            var locals = {
                                entityType: 'account',
                                entityId: activeObject['account.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_portfolio') {

                            var locals = {
                                entityType: 'portfolio',
                                entityId: activeObject['portfolio.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['currency.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_pricing_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['instrument.pricing_currency.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_accrued_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['instrument.accrued_currency.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_price') {

                            var filters = {
                                instrument: activeObject['instrument.id'],
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

                                    editEntity(activeObject, locals);

                                } else {

                                    var warningDescription = 'No corresponding record in Price History. Do you want to add the record?';

                                    var createEntityLocals = {
                                        entityType: 'price-history',
                                        entity: {
                                            instrument: activeObject['instrument.id'],
                                            instrument_object: {
                                                id: activeObject['instrument.id'],
                                                name: activeObject['instrument.name'],
                                                user_code: activeObject['instrument.user_code'],
                                                short_name: activeObject['instrument.short_name']
                                            },
                                            pricing_policy: reportOptions.pricing_policy,
                                            pricing_policy_object: reportOptions.pricing_policy_object,
                                            date: reportOptions.report_date
                                        },
                                        data: {}
                                    };

                                    offerToCreateEntity(activeObject, warningDescription, createEntityLocals);

                                }

                            })


                        }

                        if (action === 'edit_fx_rate') {

                            var filters = {
                                currency: activeObject['currency.id'],
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
                                        contextData: contextData,
                                        data: {}
                                    };

                                    editEntity(activeObject, locals);

                                } else {

                                    var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';
                                    var createEntityLocals = {
                                        entityType: 'currency-history',
                                        entity: {
                                            currency: activeObject['currency.id'],
                                            currency_object: {
                                                id: activeObject['currency.id'],
                                                name: activeObject['currency.name'],
                                                short_name: activeObject['currency.short_name'],
                                                user_code: activeObject['currency.user_code']
                                            },
                                            pricing_policy: reportOptions.pricing_policy,
                                            pricing_policy_object: reportOptions.pricing_policy_object,
                                            date: reportOptions.report_date
                                        },
                                        data: {}
                                    };

                                    offerToCreateEntity(activeObject, warningDescription, createEntityLocals);

                                }

                            })

                        }

                        if (action === 'edit_pricing_currency_price' && activeObject.id) {

                            console.log('activeObject', activeObject);

                            var filters = {
                                currency: activeObject['instrument.pricing_currency'],
                                instrument: activeObject['instrument.id'],
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

                                    editEntity(activeObject, locals);

                                } else {

                                    var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

                                    var currency_object = getCurrencyObject('instrument.pricing_currency');
                                    var createEntityLocals = {
                                        entityType: 'currency-history',
                                        entity: {
                                            currency: activeObject['instrument.pricing_currency'],
                                            currency_object: currency_object,
                                            pricing_policy: reportOptions.pricing_policy,
                                            pricing_policy_object: reportOptions.pricing_policy_object,
                                            date: reportOptions.report_date
                                        },
                                        data: {}
                                    };

                                    offerToCreateEntity(activeObject, warningDescription, createEntityLocals);

                                }

                            })

                        }

                        if (action === 'edit_accrued_currency_fx_rate' && activeObject.id) {

                            var filters = {
                                currency: activeObject['instrument.accrued_currency'],
                                instrument: activeObject['instrument.id'],
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

                                    editEntity(activeObject, locals);

                                } else {

                                    var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';

                                    var currency_object = getCurrencyObject('instrument.accrued_currency');
                                    var createEntityLocals = {
                                        entityType: 'currency-history',
                                        entity: {
                                            currency: activeObject['instrument.accrued_currency'],
                                            currency_object: currency_object,
                                            pricing_policy: reportOptions.pricing_policy,
                                            pricing_policy_object: reportOptions.pricing_policy_object,
                                            date: reportOptions.report_date
                                        },
                                        data: {}
                                    };

                                    offerToCreateEntity(activeObject, warningDescription, createEntityLocals);


                                }

                            })

                        }

                        if (action === 'book_transaction') {

                            var locals = {
                                entityType: 'complex-transaction',
                                entity: {},
                                data: {}
                            };

                            if (vm.entityType === 'transaction-report') {

                                var contextData = getContextData(reportOptions, activeObject);
                                locals.entity.transaction_type = activeObject['complex_transaction.transaction_type.id'];
                                locals.data.contextData = contextData;

                            }

                            createEntity(activeObject, locals);

                        }

                        if (action === 'book_transaction_specific') {

                            var contextData = getContextData(reportOptions, activeObject);

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

                            createEntity(activeObject, locals);

                        }

                        if (action === 'rebook_transaction') {

                            var complex_transaction_id = activeObject['complex_transaction.id'] || activeObject['complex_transaction']

                            var locals = {
                                entityType: 'complex-transaction',
                                entityId: complex_transaction_id,
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }
                    }

                });


            };

            /* vm.downloadAttributes = function () {

            	return new Promise(function (resolve, reject) {

            		var promises = [];

					promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('balance-report'));
					promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('pl-report'));
					promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('transaction-report'));

					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('portfolio'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('account'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('instrument'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('responsible'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('counterparty'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('transaction-type'));
					promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('complex-transaction'));

					if (vm.entityType === 'balance-report') {
						promises.push(vm.attributeDataService.downloadInstrumentUserFields());
					}

					if (vm.entityType === 'pl-report') {
						promises.push(vm.attributeDataService.downloadInstrumentUserFields());
					}

					if (vm.entityType === 'transaction-report') {
						promises.push(vm.attributeDataService.downloadInstrumentUserFields());
						promises.push(vm.attributeDataService.downloadTransactionUserFields());
					}

					Promise.all(promises).then(function (data) {

						vm.readyStatus.attributes = true;
						resolve(data);

					}).catch(function (error) {
						reject(error);
					});

				});

            }; */

            vm.isLayoutFromUrl = function () {
                return window.location.href.indexOf('?layout=') !== -1
            };

            /* vm.getLayoutByUserCode = function (userCode) {

                console.log('vm.getLayoutByUserCode.userCode', userCode);

                uiService.getListLayout(vm.entityType, {
                    pageSize: 1000,
                    filters: {
                        user_code: userCode
                    }
                }).then(function (activeLayoutData) {

                    console.log('vm.getLayoutByName.activeLayoutData1', activeLayoutData);

                    var activeLayout = null;

                    if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results[0]) {
                        activeLayout = activeLayoutData.results[0];
                    }

                    if (activeLayout) {

                        vm.setLayout(activeLayout);

                    } else {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Warning',
                                    description: "Layout " + name + " is not found. Switching back to Default Layout."
                                }
                            }
                        }).then(function (value) {

                            vm.getDefaultLayout()

                        })

                    }

                });

            };

            vm.getDefaultLayout = function () {

                uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                    var defaultLayout = null;
                    if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {
                        defaultLayout = defaultLayoutData.results[0];
                    }

                    vm.setLayout(defaultLayout);

                });

            }; */

            vm.getActiveObjectFromQueryParameters = function () {

                var queryParameters = window.location.href.split('?')[1];

                var result = null;

                if (queryParameters) {

                    var parameters = queryParameters.split('&');

                    result = {};

                    parameters.forEach(function (parameter) {

                        var pieces = parameter.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        result[key] = decodeURI(value);

                    });

                    return result;

                }

            };

            vm.setFiltersValuesFromQueryParameters = function () {

                var activeObject = vm.getActiveObjectFromQueryParameters();

                if (activeObject) {

                    console.log('vm.getView activeObject', activeObject);

                    var filters = vm.entityViewerDataService.getFilters();

                    filters.forEach(function (item) {

                        if (activeObject.hasOwnProperty(item.key)) {
                            item.options.filter_values = [activeObject[item.key]]
                        }

                    })

                }

            };

            /* var calculateReportDateExpr = function (dateExpr, reportOptions, reportDateIndex, dateExprsProms) {

                var reportDateProperties = {
                    'balance-report': [null, 'report_date'],
                    'pl-report': ['pl_first_date', 'report_date'],
                    'transaction-report': ['begin_date', 'end_date']
                };

                var dateProp = reportDateProperties[vm.entityType][reportDateIndex];

                var result = expressionService.getResultOfExpression({"expression": dateExpr}).then(function (data) {
                    reportOptions[dateProp] = data.result
                });

                dateExprsProms.push(result);

            }; */

            vm.setLayout = function (layout) {

            	return new Promise(async function (resolve, reject) {

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);
                    vm.setFiltersValuesFromQueryParameters();

                    // var reportOptions = vm.entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                    /* var finishSetLayout = function () {

                        // REPORT REQUEST STARTS HERE
                        rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        var additions = vm.entityViewerDataService.getAdditions();
                        var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();

                        if (additions.isOpen && interfaceLayout.splitPanel.height && interfaceLayout.splitPanel.height > 0) {
                            vm.entityViewerDataService.setSplitPanelStatus(true);
                        }

                        vm.readyStatus.layout = true;

                        $scope.$apply();

                    } */

                    var additions = vm.entityViewerDataService.getAdditions();
                    var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();

                    if (additions.isOpen && interfaceLayout.splitPanel.height && interfaceLayout.splitPanel.height > 0) {
                        vm.entityViewerDataService.setSplitPanelStatus(true);
                    }

                    interfaceLayout.filterArea.width = 0;

                    // Check if there is need to solve report datepicker expression
                    if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                        /* var firstDateExpr = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // for pl_first_date, begin_date
                        var secondDateExpr = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression; // for report_date, end_date

                        var dateExprsProms = [];

                        if (firstDateExpr) {
                            calculateReportDateExpr(firstDateExpr, reportOptions, 0, dateExprsProms);
                        }

                        if (secondDateExpr) {
                            calculateReportDateExpr(secondDateExpr, reportOptions, 1, dateExprsProms);
                        }

                        Promise.all(dateExprsProms).then(function () {
                            onSetLayoutEnd();

                        }).catch(function () {
                            onSetLayoutEnd();
                        }); */
                        await rvSharedLogicHelper.calculateReportDatesExprs();
                        rvSharedLogicHelper.onSetLayoutEnd();

                        var activeColumnSortProm = new Promise(function (sortResolve, sortReject) {

                            var activeColumnSort = vm.entityViewerDataService.getActiveColumnSort();

                            console.log('activeColumnSortProm.activeColumnSort', activeColumnSort);

                            if (activeColumnSort && activeColumnSort.manual_sort_layout_user_code) {

                                uiService.getColumnSortDataList({
                                    filters: {
                                        user_code: activeColumnSort.manual_sort_layout_user_code
                                    }
                                }).then(function (data){

                                    if(data.results.length) {

                                        var layout = data.results[0];

                                        console.log('activeColumnSortProm', layout);

                                        vm.entityViewerDataService.setColumnSortData(activeColumnSort.key, layout.data)

                                    } else {

                                        toastNotificationService.error("Manual Sort is not configured");

                                        activeColumnSort.manual_sort_layout_user_code = null;

                                    }

									sortResolve();

                                })



                            } else {
								sortResolve();
                            }


                        })


                        Promise.all([activeColumnSortProm]).then(function (){
                            resolve();
                        })

                    } else {
                        rvSharedLogicHelper.onSetLayoutEnd();
                    }

                    resolve();

                });

            };

            // called inside entityViewerHelperService
            vm.getView = function () {

                // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false; // switched to true by rvSharedLogicHelper.onSetLayoutEnd()

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.splitPanelExchangeService = new SplitPanelExchangeService();
                vm.attributeDataService = new AttributeDataService();

                vm.entityType = $scope.$parent.vm.entityType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setContentType($scope.$parent.vm.contentType);
                vm.entityViewerDataService.setRootEntityViewer(true);
                vm.entityViewerDataService.setViewContext('entity_viewer');
                vm.entityViewerDataService.setCurrentMember(vm.currentMember);
                vm.entityViewerDataService.setVirtualScrollStep(500);

                vm.entityViewerDataService.setRowHeight(36);

				vm.entityViewerDataService.setLayoutChangesLossWarningState(true);

                var downloadAttrsProm = rvSharedLogicHelper.downloadAttributes();
                var setLayoutProm;

                var crossEntityAttributeExtensionProm = new Promise(function (resolve, reject){

                    uiService.getCrossEntityAttributeExtensionList({
                        filters: {
                            context_content_type: $scope.$parent.vm.contentType
                        }
                    }).then(function (data){

                        console.log('getCrossEntityAttributeExtensionList.data', data);

                        vm.entityViewerDataService.setCrossEntityAttributeExtensions(data.results);
						resolve();

                    }).catch(error => reject(error))

                })

                vm.setEventListeners();

                var layoutUserCode;

                if (vm.isLayoutFromUrl()) {

                    var queryParams = window.location.href.split('?')[1];
                    var params = queryParams.split('&');

                    params.forEach(function (param) {

                        var pieces = param.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        if (key === 'layout') {
                            layoutUserCode = value;

                            if (layoutUserCode.indexOf('%20') !== -1) {
                                layoutUserCode = layoutUserCode.replace(/%20/g, " ")
                            }
                        }

                    });

                    // vm.getLayoutByUserCode(layoutUserCode);
                    setLayoutProm = evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

                } else if ($stateParams.layoutUserCode) {

                    layoutUserCode = $stateParams.layoutUserCode;
                    // vm.getLayoutByUserCode(layoutUserCode);
                    setLayoutProm = evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

                } else {
                    // vm.getDefaultLayout();
                    setLayoutProm = evHelperService.getDefaultLayout(vm);
                }

                Promise.allSettled([downloadAttrsProm, setLayoutProm, crossEntityAttributeExtensionProm]).then(function (getViewData) {
                	metaService.logRejectedPromisesAfterAllSettled(getViewData, 'report viewer get view');
					$scope.$apply();
                });

            };

            vm.init = function () {

                middlewareService.onMasterUserChanged(function () {
					vm.entityViewerDataService.setLayoutChangesLossWarningState(false);
                    removeTransitionWatcher();
                });

                middlewareService.onLogOut(function () {
					vm.entityViewerDataService.setLayoutChangesLossWarningState(false);
                    removeTransitionWatcher();
                });

                vm.getCurrentMember().then(function () {

                    vm.getView();

                })


            };



            vm.getCurrentMember = function () {

                return usersService.getMyCurrentMember().then(function (data) {

                    vm.currentMember = data;

                    $scope.$apply();

                });
            };


            var checkLayoutForChanges = function () { // called on attempt to change or reload page

                return new Promise(function (resolve, reject) {

                	var checkForLayoutChanges = vm.entityViewerDataService.isLayoutChangesLossWarningNeeded();

                    if (checkForLayoutChanges) {

                        var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                        var spChangedLayout = false;
                        var additions = vm.entityViewerDataService.getAdditions();

                        if (additions.isOpen) {
                            spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                        }

                        var layoutIsUnchanged = true;
                        if (activeLayoutConfig && activeLayoutConfig.data) {
                            var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                            layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, true);
                        }

                        if (!layoutIsUnchanged || spChangedLayout) {

                            $mdDialog.show({
                                controller: 'LayoutChangesLossWarningDialogController as vm',
                                templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                                parent: angular.element(document.body),
                                preserveScope: true,
                                autoWrap: true,
                                multiple: true,
                                locals: {
                                    data: {
                                        evDataService: vm.entityViewerDataService,
                                        entityType: vm.entityType
                                    }
                                }
                            }).then(function (res, rej) {

                                if (res.status === 'save_layout') {

                                    var layoutsSavePromises = [];

                                    // if split panel layout changed, save it
                                    if (spChangedLayout) {

                                        var saveSPLayoutChanges = new Promise(function (spLayoutSaveRes, spLayoutSaveRej) {

                                            if (spChangedLayout.hasOwnProperty('id')) {
                                                uiService.updateListLayout(spChangedLayout.id, spChangedLayout).then(function () {
                                                    spLayoutSaveRes(true);
                                                });
                                            } else {
                                                uiService.createListLayout(vm.entityType, spChangedLayout).then(function () {
                                                    spLayoutSaveRes(true);
                                                });
                                            }

                                        });

                                        layoutsSavePromises.push(saveSPLayoutChanges);

                                    }
                                    // < if split panel layout changed, save it >

                                    if (activeLayoutConfig && !layoutIsUnchanged) {

                                        var saveLayoutChanges = new Promise(function (saveLayoutRes, saveLayoutRej) {

                                            if (layoutCurrentConfig.hasOwnProperty('id')) {

                                                uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                                    saveLayoutRes(true);
                                                });

                                            } else {

                                                if (res.data && res.data.layoutName) {
                                                    layoutCurrentConfig.name = res.data.layoutName;
                                                }

                                                /* When saving is_default: true layout on backend, others become is_default: false
                                                uiService.getDefaultListLayout(vm.entityType).then(function (data) {

                                                    layoutCurrentConfig.is_default = true;

                                                    if (data.count > 0 && data.results) {
                                                        var activeLayout = data.results[0];
                                                        activeLayout.is_default = false;

                                                        uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                                            uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                                saveLayoutRes(true);
                                                            });

                                                        });

                                                    } else {
                                                        uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                            saveLayoutRes(true);
                                                        });
                                                    }

                                                });*/
                                                uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                    saveLayoutRes(true);
                                                });

                                            }

                                            layoutsSavePromises.push(saveLayoutChanges);

                                        });
                                    }

                                    Promise.all(layoutsSavePromises).then(function () {
                                        resolve(true);
                                    });

                                } else if (res.status === 'do_not_save_layout') {

                                    resolve(true);

                                } else {

                                    reject(false);

                                }

                            }).catch(function () {
                                reject(false);
                            });

                        } else {
                            resolve(true);
                        }

                    } else {

                    	removeTransitionWatcher();
                        resolve(true);

                    }

                });

            };

            var deregisterOnBeforeTransitionHook = $transitions.onBefore({}, checkLayoutForChanges);

            /*var doOnMasterUserSelect = function () {
                deregisterOnBeforeTransitionHook();
                return warnOnMasterUserChange();
            };

            middlewareService.setWarningOfLayoutChangesLossFn(doOnMasterUserSelect);*/

            var removeTransitionWatcher = function () {
                deregisterOnBeforeTransitionHook();
                window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);
            };

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();

                var layoutIsUnchanged = true;
                if (activeLayoutConfig && activeLayoutConfig.data) {
                    var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                    layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, true);
                }

                var spChangedLayout = false;
                var additions = vm.entityViewerDataService.getAdditions();
                if (additions.isOpen) {
                    spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                }

                if (!layoutIsUnchanged || spChangedLayout) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }

            };

            window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);

            this.$onDestroy = function () {

                removeTransitionWatcher();

            }

            vm.init();
        }

    }()
);