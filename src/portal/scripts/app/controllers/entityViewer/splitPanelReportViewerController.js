/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var metaContentTypesService = require('../../services/metaContentTypesService');
        var evHelperService = require('../../services/entityViewerHelperService');

        var priceHistoryService = require('../../services/priceHistoryService');
        var currencyHistoryService = require('../../services/currencyHistoryService');

        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

            var vm = this;

            console.log('parentEntityViewerDataService', parentEntityViewerDataService);
            console.log('parentEntityViewerEventService', parentEntityViewerEventService);

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.entityViewerDataService = null;
            vm.entityViewerEventService = null;

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
                    parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                }

            };

            var getContextDataForComplexTransaction = function (reportOptions, activeObject) {

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

                if (activeObject['pricing_currency.id']) {
                    contextData.pricing_currency = activeObject['pricing_currency.id'];
                    contextData.pricing_currency_object = {
                        id: activeObject['pricing_currency.id'],
                        name: activeObject['pricing_currency.name'],
                        user_code: activeObject['pricing_currency.user_code'],
                        content_type: "currencies.currency"
                    };
                }

                if (activeObject['instrument.accrued_currency.id']) {
                    contextData.accured_currency = activeObject['instrument.accrued_currency.id'];
                    contextData.accured_currency_object = {
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
                    templateUrl: 'views/warning-dialog-view.html',
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

                parentEntityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = parentEntityViewerDataService.getActiveObject();
                    var columns = parentEntityViewerDataService.getColumns();

                    vm.entityViewerDataService.setActiveObjectFromAbove(activeObject);
                    vm.entityViewerDataService.setAttributesFromAbove(columns);


                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                });

                parentEntityViewerEventService.addEventListener(evEvents.UPDATE_SPLIT_PANEL_TABLE_VIEWPORT, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                });

                parentEntityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

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

                    var spActiveLayout = vm.entityViewerDataService.getSplitPanelLayoutToOpen();
                    parentEntityViewerDataService.setSplitPanelLayoutToOpen(spActiveLayout);

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED, function () {

                    var spDefaultLayout = vm.entityViewerDataService.getSplitPanelDefaultLayout();
                    var additions = parentEntityViewerDataService.getAdditions();

                    additions.layoutData.layoutId = spDefaultLayout.layoutId;
                    additions.layoutData.name = spDefaultLayout.name;
                    additions.layoutData.content_type = spDefaultLayout.content_type;

                    parentEntityViewerDataService.setAdditions(additions);

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

                            if(item.id === activeObject[currencyKey]) {
                                currencyObj.id = item.id;
                                currencyObj.name = item.name;
                                currencyObj.short_name = item.short_name;
                                currencyObj.user_code = item.user_code;
                            }

                        });

                        return currencyObj;
                    };

                    console.log('split panel activeObject', activeObject);
                    console.log('split panel actionData', actionData);
                    console.log('split panel action', action);

                    if (activeObject) {

                        switch (action) {
                            case 'edit_instrument':
                                var locals = {
                                    entityType: 'instrument',
                                    entityId: activeObject['instrument.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_account':

                                var locals = {
                                    entityType: 'account',
                                    entityId: activeObject['account.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_portfolio':
                                var locals = {
                                    entityType: 'portfolio',
                                    entityId: activeObject['portfolio.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_currency':
                                var locals = {
                                    entityType: 'currency',
                                    entityId: activeObject['currency.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_pricing_currency':
                                var locals = {
                                    entityType: 'currency',
                                    entityId: activeObject['pricing_currency.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_accrued_currency':
                                var locals = {
                                    entityType: 'currency',
                                    entityId: activeObject['accrued_currency.id']
                                };

                                editEntity(activeObject, locals);

                                break;

                            case 'edit_price':
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
                                            entityId: item.id
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
                                            }
                                        };

                                        offerToCreateEntity(activeObject, warningDescription, createEntityLocals);

                                    }

                                });

                                break;

                            case 'edit_fx_rate':
                                var filters = {
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
                                            entityId: item.id
                                        };

                                        editEntity(activeObject, locals);

                                    } else {

                                        var warningDescription = 'No corresponding record in FX Rates History. Do you want to add the record?';
                                        var createEntityLocals = {
                                            entityType: 'currency-history',
                                            entity: {
                                                currency: activeObject['currency.id'],
                                                currency_object: {
                                                    id: activeObject['currency.id']
                                                },
                                                pricing_policy: reportOptions.pricing_policy,
                                                pricing_policy_object: reportOptions.pricing_policy_object,
                                                date: reportOptions.report_date
                                            }
                                        };

                                        offerToCreateEntity(activeObject, warningDescription, createEntityLocals);

                                    }

                                })

                                break;

                            case 'book_transaction':
                                var contextData = getContextDataForComplexTransaction(reportOptions, activeObject);

                                var entity = {
                                    contextData: contextData
                                };

                                var locals = {
                                    entityType: 'complex-transaction',
                                    entity: entity
                                };

                                createEntity(activeObject, locals);

                                break;

                            case 'book_transaction_specific':
                                var contextData = getContextDataForComplexTransaction(reportOptions, activeObject);

                                var entity = {
                                    contextData: contextData
                                };

                                if (actionData && actionData.id) {
                                    entity.transaction_type = actionData.id
                                }

                                var locals = {
                                    entityType: 'complex-transaction',
                                    entity: entity
                                };

                                createEntity(activeObject, locals);

                                break;

                            case 'rebook_transaction':
                                var locals = {
                                    entityType: 'complex-transaction',
                                    entityId: activeObject['complex_transaction.id']
                                };

                                editEntity(activeObject, locals);
                                break;
                        }


                        if (action === 'edit_pricing_currency_price' && activeObject.id) {

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
                                        entityId: item.id
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
                                        }
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
                                        entityId: item.id
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
                                        }
                                    };

                                    offerToCreateEntity(activeObject, warningDescription, createEntityLocals);


                                }

                            })

                        }

                    }

                });

                // Events that dispatch events inside parent
                vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

            };

            var getLayoutChanges = function () {
                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();

                if (activeLayoutConfig && activeLayoutConfig.data) {
                    var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, currentLayoutConfig, true)) {
                        return currentLayoutConfig;
                    }
                }

                return false
            };

            splitPanelExchangeService.setSplitPanelLayoutChangesCheckFn(getLayoutChanges);

            vm.downloadAttributes = function(){

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
                    $scope.$apply();

                })

            };

            vm.getView = function () {

                // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = new AttributeDataService();

                console.log('scope, ', $scope);

                vm.entityType = $scope.$parent.vm.entityType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(false);
                vm.entityViewerDataService.setUseFromAbove(true);
                vm.entityViewerDataService.setViewContext('split_panel');


                vm.downloadAttributes();

                var columns = parentEntityViewerDataService.getColumns();

                var splitPanelLayoutToOpen = parentEntityViewerDataService.getSplitPanelLayoutToOpen();
                var additions = parentEntityViewerDataService.getAdditions();

                var spDefaultLayoutData = {
                    layoutId: additions.layoutData.layoutId,
                    name: additions.layoutData.name,
                    content_type: additions.layoutData.content_type
                };

                var defaultLayoutId;

                if (splitPanelLayoutToOpen) {
                    defaultLayoutId = splitPanelLayoutToOpen;
                } else {
                    defaultLayoutId = additions.layoutId; // needed in order for old system layouts work

                    if (additions.layoutData && additions.layoutData.layoutId) {
                        defaultLayoutId = additions.layoutData.layoutId;
                    }

                }

                vm.entityViewerDataService.setAttributesFromAbove(columns);

                vm.setEventListeners();

                var setLayout = function (layout) {

                    vm.entityViewerDataService.setSplitPanelDefaultLayout(spDefaultLayoutData);
                    vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

                    var reportOptions = vm.entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                    // Check if there is need to solve report datepicker expression
                    if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                        var reportFirstDatepickerExpression = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // field for the first datepicker in reports with two datepickers, e.g. p&l report
                        var reportLastDatepickerExpression = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression;

                        if (reportFirstDatepickerExpression || reportLastDatepickerExpression) {

                            var datepickerExpressionsToSolve = [];

                            if (reportFirstDatepickerExpression) {

                                var solveFirstExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportFirstDatepickerExpression}).then(function (data) {
                                        reportOptions.pl_first_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveFirstExpression());
                            }

                            if (reportLastDatepickerExpression) {

                                var solveLastExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportLastDatepickerExpression}).then(function (data) {
                                        reportOptions.report_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveLastExpression());
                            }

                            Promise.all(datepickerExpressionsToSolve).then(function () {

                                vm.readyStatus.layout = true;

                                rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                                $scope.$apply();

                                //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                            });


                        } else {

                            vm.readyStatus.layout = true;

                            rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                            $scope.$apply();

                            //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                        }
                    // < Check if there is need to solve report datepicker expression >
                    } else {

                        vm.readyStatus.layout = true;

                        rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        $scope.$apply();

                        //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});
                    }

                };

                if (defaultLayoutId) {

                    uiService.getListLayoutByKey(defaultLayoutId).then(function (spLayoutData) {

                        if (spLayoutData) {
                            middlewareService.setNewSplitPanelLayoutName(spLayoutData.name);
                        }

                        setLayout(spLayoutData);

                    }).catch(function (reason) {

                        uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                            var defaultLayout = null;
                            if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

                                defaultLayout = defaultLayoutData.results[0];
                                middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);

                            }

                            setLayout(defaultLayout);

                        });

                    })

                } else {

                    uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                        var defaultLayout = null;
                        if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

                            defaultLayout = defaultLayoutData.results[0];
                            middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);

                        }

                        setLayout(defaultLayout);

                    });
                }

            };

            vm.init = function () {

                vm.getView();

            };

            vm.init();


        }

    }()
);