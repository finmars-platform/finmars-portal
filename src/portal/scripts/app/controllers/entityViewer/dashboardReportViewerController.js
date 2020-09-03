/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';
        var message;

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var objectComparison = require('../../helpers/objectsComparisonHelper');

        var priceHistoryService = require('../../services/priceHistoryService');
        var currencyHistoryService = require('../../services/currencyHistoryService');

        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        var rvDataHelper = require('../../helpers/rv-data.helper');

        var renderHelper = require('../../helpers/render.helper');
        var dashboardHelper = require('../../helpers/dashboard.helper');

        var dashboardEvents = require('../../services/dashboard/dashboardEvents');
        var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

        module.exports = function ($scope, $mdDialog, $transitions) {

            var vm = this;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.componentData = null;
            vm.dashboardDataService = null;
            vm.dashboardEventService = null;
            vm.dashboardComponentDataService = null;
            vm.dashboardComponentEventService = null;
            vm.matrixSettings = null;

            vm.grandTotalProcessing = true;

            vm.linkedActiveObjects = {}; // If we have several components linked to spit panel;
            var lastActiveComponentId;
            var savedInterfaceLayout;
            var savedAddtions;

            var componentsForLinking = dashboardHelper.getComponentsForLinking();
            var gotActiveObjectFromLinkedDashboardComp = false;

            var fillInModeEnabled = false;

            if ($scope.$parent.vm.entityViewerDataService) {
                fillInModeEnabled = true;
            }

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

            vm.updateGrandTotalComponent = function(){

                rvDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                vm.grandTotalProcessing = false;

                var rootGroup = vm.entityViewerDataService.getRootGroup();

                var flatList = rvDataHelper.getFlatStructure(vm.entityViewerDataService);

                console.log('Grand Total Status: rootGroup', rootGroup);
                console.log('Grand Total Status: flatList', flatList);

                var root = flatList[0];

                var column_key = vm.componentData.settings.grand_total_column;

                var val = root.subtotal[column_key];

                vm.grandTotalNegative = false;

                if (vm.componentData.settings.number_format) {

                    if (vm.componentData.settings.number_format.negative_color_format_id === 1) {

                        if (val % 1 === 0) { // check whether number is float or integer
                            if (parseInt(val) < 0) {
                                vm.grandTotalNegative = true
                            }
                        } else {
                            if (parseFloat(val) < 0) {
                                vm.grandTotalNegative = true
                            }
                        }
                    }

                    vm.grandTotalValue = renderHelper.formatValue({
                        value: val
                    }, {
                        key: 'value',
                        report_settings: vm.componentData.settings.number_format
                    });

                } else {
                    vm.grandTotalValue = val
                }

                console.log('vm.grandTotalValue', vm.grandTotalValue);

                // $scope.$apply();

            };

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

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_START, function () {
                    //$scope.readyStatus.calculating = true;

                    vm.dashboardEventService.dispatchEvent(dashboardEvents.TOGGLE_COMPONENT_BLOCKAGE);
                    message = 'Component: ' + vm.componentData.name + ' Type: ' + vm.componentData.settings.entity_type + 'listener DATA_LOAD_START';
                    console.log('%c%s', 'color: blue', message, vm.readyStatus);

                    vm.entityViewerDataService.setDataLoadStatus(false);

                    if (!fillInModeEnabled) {
                        vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.PROCESSING);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                });

                vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                    message = 'Component: ' + vm.componentData.name + ' Type: ' + vm.componentData.settings.entity_type + 'listener DATA_LOAD_END';
                    console.log('%c %s', 'color: blue', message, vm.readyStatus);

                    vm.entityViewerDataService.setDataLoadStatus(true);

                    if (!fillInModeEnabled) {
                        vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ACTIVE);
                        vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    }

                    //$scope.readyStatus.calculating = false;
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.TOGGLE_COMPONENT_BLOCKAGE);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                    var columns = vm.entityViewerDataService.getColumns();
                    vm.dashboardComponentDataService.setViewerTableColumns(columns);
                    //vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

                });

                if (vm.componentData.type === 'report_viewer_grand_total') {

                    vm.entityViewerEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                        vm.updateGrandTotalComponent();
                    })

                }

                if (componentsForLinking.indexOf(vm.componentData.type) !== -1) {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', vm.componentData.type);
                        console.log('ACTIVE_OBJECT_CHANGE vm.componentData.type', gotActiveObjectFromLinkedDashboardComp);

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        if (!gotActiveObjectFromLinkedDashboardComp) {

                            //var activeObject = vm.entityViewerDataService.getActiveObject();

                            var componentsOutputs = vm.dashboardDataService.getAllComponentsOutputs();
                            var compsKeys = Object.keys(componentsOutputs);

                            if (compsKeys.length > 0) {

                                compsKeys.forEach(function (compKey) {
                                    componentsOutputs[compKey].changedLast = false;
                                });

                                vm.dashboardDataService.setAllComponentsOutputs(componentsOutputs);

                            }

                            var compOutputData = {
                                changedLast: true,
                                deleteOnChange: true,
                                data: activeObject
                            };

                            vm.dashboardDataService.setComponentOutput(vm.componentData.id, compOutputData);

                            vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id);

                            /*if (vm.componentData.settings.auto_refresh) {
                                vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)
                            }*/
                            vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_OUTPUT_ACTIVE_OBJECT_CHANGE);

                        } else {
                            gotActiveObjectFromLinkedDashboardComp = false; // reset variable indicator
                        }

                        if (vm.componentData.type === 'report_viewer_grand_total') {
                            vm.updateGrandTotalComponent();
                        }

                    });

                }

                if (fillInModeEnabled) {

                    if (vm.componentData.type === 'report_viewer' ||
                        vm.componentData.type === 'report_viewer_split_panel') {

                        vm.entityViewerEventService.addEventListener(evEvents.OPEN_DASHBOARD_COMPONENT_EDITOR, function () {
                            vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.OPEN_COMPONENT_EDITOR);
                        });

                    }

                } else {

                    vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        var columns = vm.entityViewerDataService.getColumns();

                        if (vm.componentData.type === 'report_viewer' ||
                            vm.componentData.type === 'report_viewer_split_panel') {
                            vm.userSettings.columns = JSON.parse(angular.toJson(columns));
                        }


                    });

                    vm.entityViewerEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

                        var columns = vm.entityViewerDataService.getColumns();

                        if (vm.componentData.type === 'report_viewer' ||
                            vm.componentData.type === 'report_viewer_split_panel') {
                            vm.userSettings.columns = JSON.parse(angular.toJson(columns));
                        }

                    });
                }

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

                    console.log('activeObject', activeObject);
                    console.log('actionData', actionData);
                    console.log('action', action);

                    var contextData = getContextData(reportOptions, activeObject);

                    if (activeObject) {

                        if (action === 'edit_instrument') {

                            var locals = {
                                entityType: 'instrument',
                                entityId: activeObject['instrument.id'],
                                data: {
                                    contextData: contextData
                                }
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_account') {

                            var locals = {
                                entityType: 'account',
                                entityId: activeObject['account.id'],
                                data: {
                                    contextData: contextData
                                }
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_portfolio') {

                            var locals = {
                                entityType: 'portfolio',
                                entityId: activeObject['portfolio.id'],
                                data: {
                                    contextData: contextData
                                }
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['currency.id'],
                                data: {
                                    contextData: contextData
                                }
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_pricing_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['instrument.pricing_currency.id'],
                                data: {
                                    contextData: contextData
                                }
                            };

                            editEntity(activeObject, locals);

                        }

                        if (action === 'edit_accrued_currency') {

                            var locals = {
                                entityType: 'currency',
                                entityId: activeObject['instrument.accrued_currency.id'],
                                data: {
                                    contextData: contextData
                                }
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
                                        data: {
                                            contextData: contextData
                                        }
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
                                        data: {
                                            contextData: contextData
                                        }
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
                                        data: {
                                            contextData: contextData
                                        }
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
                                        data: {
                                            contextData: contextData
                                        }
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

                                locals.entity.transaction_type = activeObject['complex_transaction.transaction_type.id'];
                                locals.data.contextData = contextData;

                            }

                            createEntity(activeObject, locals);

                        }

                        if (action === 'book_transaction_specific') {

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

                            var locals = {
                                entityType: 'complex-transaction',
                                entityId: activeObject['complex_transaction.id'],
                                data: {}
                            };

                            editEntity(activeObject, locals);

                        }
                    }

                });


            };

            vm.setLayout = function (layout) {

                return new Promise(function (resolve, reject) {

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

                    var reportOptions = vm.entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                    // Check are there report datepicker expressions to solve
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

                                resolve();

                            });


                        } else {
                            resolve();
                        }

                    } else {
                    // < Check are there report datepicker expressions to solve >
                        resolve();
                    }


                })

            };

            vm.handleDashboardFilterLink = function (filter_link) {

                var filters = vm.entityViewerDataService.getFilters();

                var componentOutput = vm.dashboardDataService.getComponentOutput(filter_link.component_id);

                console.log('filters', filters);
                console.log('componentOutput', componentOutput);

                if (componentOutput && componentOutput.data) {

                    var linkedFilter = filters.find(function (item) {
                        return item.type === 'filter_link' && item.component_id === filter_link.component_id
                    });

                    if (linkedFilter) {

                        linkedFilter.options.filter_values = [componentOutput.data.value];

                        filters = filters.map(function (item) {

                            if (item.type === 'filter_link' && item.component_id === filter_link.component_id) {
                                return linkedFilter
                            }

                            return item
                        })

                    } else {

                        if (filter_link.value_type === 100) {

                            console.log('componentOutput.value', componentOutput.data.value)

                            var values;

                            if (Array.isArray(componentOutput.data.value)) {
                                values = componentOutput.data.value
                            } else {
                                values = [componentOutput.data.value];
                            }

                            console.log('values', values);

                            linkedFilter = {
                                type: 'filter_link',
                                component_id: filter_link.component_id,
                                key: filter_link.key,
                                name: filter_link.key,
                                value_type: filter_link.value_type,
                                options: {
                                    enabled: true,
                                    exclude_empty_cells: true,
                                    filter_type: 'multiselector',
                                    filter_values: values
                                }
                            };

                        } else {

                            linkedFilter = {
                                type: 'filter_link',
                                component_id: filter_link.component_id,
                                key: filter_link.key,
                                name: filter_link.key,
                                value_type: filter_link.value_type,
                                options: {
                                    enabled: true,
                                    exclude_empty_cells: true,
                                    filter_type: 'contains',
                                    filter_values: [componentOutput.data.value.toString()]
                                }
                            };

                        }

                        filters.push(linkedFilter)
                    }


                    vm.entityViewerDataService.setFilters(filters);

                    vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                }

            };

            vm.handleDashboardActiveObject = function (componentId) {

                gotActiveObjectFromLinkedDashboardComp = true;
                var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                console.log('COMPONENT_VALUE_CHANGED_' + componentId, componentOutput);

                //if (vm.componentData.type === 'report_viewer_split_panel' && componentOutput) {
                if (componentOutput) {

                    vm.entityViewerDataService.setActiveObject(componentOutput.data);
                    vm.entityViewerDataService.setActiveObjectFromAbove(componentOutput.data);

                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                }

            };

            /*vm.applyDashboardChanges = function () {

                if (vm.componentData.settings.linked_components.hasOwnProperty('filter_links')) {

                    vm.componentData.settings.linked_components.filter_links.forEach(function (filter_link) {
                        vm.handleDashboardFilterLink(filter_link);
                    });

                }

                if (vm.componentData.settings.linked_components.hasOwnProperty('report_settings')) {

                    Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {

                        var componentId = vm.componentData.settings.linked_components.report_settings[property];

                        var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                        if (componentOutput && componentOutput.data) {

                            var reportOptions = vm.entityViewerDataService.getReportOptions();

                            // console.log('reportOptions', reportOptions);
                            // console.log('componentOutput', componentOutput);
                            //
                            // console.log('reportOptions[property]', reportOptions[property]);
                            // console.log('componentOutput.data.value', componentOutput.data.value);

                            if (reportOptions[property] !== componentOutput.data.value) {

                                reportOptions[property] = componentOutput.data.value;

                                vm.entityViewerDataService.setReportOptions(reportOptions);
                                vm.entityViewerDataService.dashboard.setReportDateFromDashboardProp(true);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                            }

                        }

                    })

                }

                if (vm.componentData.settings.linked_components.hasOwnProperty('active_object')) { // mark if last active object changed

                    if (Array.isArray(vm.componentData.settings.linked_components.active_object)) {

                        var lastActiveCompChanged = false;

                        for (var i = 0; i < vm.componentData.settings.linked_components.active_object.length; i++) {

                            var componentId = JSON.parse(JSON.stringify(vm.componentData.settings.linked_components.active_object[i]));

                            var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                            /!*if (componentOutput && !componentOutput.recalculatedComponents) {
                                componentOutput.recalculatedComponents = [];
                            }

                            if (componentOutput && componentOutput.changedLast &&
                                componentOutput.recalculatedComponents.indexOf(vm.componentData.id) < 0) {*!/
                            if (componentOutput && componentOutput.changedLast) {

                                var compOutputData = componentOutput.data;

                                if (lastActiveComponentId !== componentId) {

                                    lastActiveComponentId = componentId;
                                    lastActiveCompChanged = true;

                                } else {

                                    if (compOutputData && typeof compOutputData === 'object' &&
                                        vm.linkedActiveObjects[lastActiveComponentId] &&
                                        typeof vm.linkedActiveObjects[lastActiveComponentId] === 'object') {

                                        if (!objectComparison.comparePropertiesOfObjects(compOutputData, vm.linkedActiveObjects[lastActiveComponentId])) {
                                            lastActiveCompChanged = true;
                                        }

                                    } else if (vm.linkedActiveObjects[lastActiveComponentId] !== compOutputData) {
                                        lastActiveCompChanged = true;
                                    }

                                }

                                if (compOutputData !== undefined && compOutputData !== null) {
                                    vm.linkedActiveObjects[lastActiveComponentId] = JSON.parse(JSON.stringify(compOutputData));
                                } else {
                                    delete vm.linkedActiveObjects[lastActiveComponentId];
                                }

                                /!*if (lastActiveCompChanged) {
                                    componentOutput.recalculatedComponents.push(vm.componentData.id);
                                }*!/

                                break;

                            }
                        }

                        if (lastActiveCompChanged) {
                            vm.handleDashboardActiveObject(lastActiveComponentId);
                        }

                    } else {

                        var componentId = vm.componentData.settings.linked_components.active_object;

                        vm.handleDashboardActiveObject(componentId);
                    }

                }

            };*/

            var updateActiveObjectUsingDashboardData = function () {

                if (vm.componentData.settings.linked_components.hasOwnProperty('active_object')) { // mark if last active object changed

                    if (Array.isArray(vm.componentData.settings.linked_components.active_object)) {

                        var lastActiveCompChanged = false;

                        for (var i = 0; i < vm.componentData.settings.linked_components.active_object.length; i++) {

                            var componentId = JSON.parse(JSON.stringify(vm.componentData.settings.linked_components.active_object[i]));

                            var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                            /*if (componentOutput && !componentOutput.recalculatedComponents) {
                                componentOutput.recalculatedComponents = [];
                            }

                            if (componentOutput && componentOutput.changedLast &&
                                componentOutput.recalculatedComponents.indexOf(vm.componentData.id) < 0) {*/

                            if (componentOutput && componentOutput.changedLast) {

                                var compOutputData = componentOutput.data;

                                if (lastActiveComponentId !== componentId) {

                                    lastActiveComponentId = componentId;
                                    lastActiveCompChanged = true;

                                } else {

                                    if (compOutputData && typeof compOutputData === 'object' &&
                                        vm.linkedActiveObjects[lastActiveComponentId] &&
                                        typeof vm.linkedActiveObjects[lastActiveComponentId] === 'object') {

                                        if (!objectComparison.comparePropertiesOfObjects(compOutputData, vm.linkedActiveObjects[lastActiveComponentId])) {
                                            lastActiveCompChanged = true;
                                        }

                                    } else if (vm.linkedActiveObjects[lastActiveComponentId] !== compOutputData) {
                                        lastActiveCompChanged = true;
                                    }

                                }

                                if (compOutputData !== undefined && compOutputData !== null) {
                                    vm.linkedActiveObjects[lastActiveComponentId] = JSON.parse(JSON.stringify(compOutputData));
                                } else {
                                    delete vm.linkedActiveObjects[lastActiveComponentId];
                                }

                                /*if (lastActiveCompChanged) {
                                    componentOutput.recalculatedComponents.push(vm.componentData.id);
                                }*/

                                break;

                            }
                        }

                        if (lastActiveCompChanged) {
                            vm.handleDashboardActiveObject(lastActiveComponentId);
                        }

                    } else {

                        var componentId = vm.componentData.settings.linked_components.active_object;

                        vm.handleDashboardActiveObject(componentId);
                    }

                }

            }

            var updateReportSettingsUsingDashboardData = function () {

                if (vm.componentData.settings.linked_components.hasOwnProperty('report_settings')) {

                    var reportOptionsChanged = false;
                    var reportOptions = vm.entityViewerDataService.getReportOptions();

                    Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {

                        var componentId = vm.componentData.settings.linked_components.report_settings[property];

                        var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                        if (componentOutput && componentOutput.data) {

                            // var reportOptions = vm.entityViewerDataService.getReportOptions();
                            // console.log('reportOptions', reportOptions);
                            // console.log('componentOutput', componentOutput);
                            //
                            // console.log('reportOptions[property]', reportOptions[property]);
                            // console.log('componentOutput.data.value', componentOutput.data.value);

                            if (reportOptions[property] !== componentOutput.data.value) {

                                if (property.indexOf(['portfolios', 'strategies1', 'strategies2', 'strategies3']) > -1 &&
                                    !Array.isArray(componentOutput.data.value)) {

                                    reportOptions[property] = [componentOutput.data.value];

                                } else {
                                    reportOptions[property] = componentOutput.data.value;
                                }

                                reportOptionsChanged = true;

                                /*vm.entityViewerDataService.setReportOptions(reportOptions);
                                vm.entityViewerDataService.dashboard.setReportDateFromDashboardProp(true);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                                vm.entityViewerEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);*/

                            }

                        }

                    })

                    if (reportOptionsChanged) {
                        vm.entityViewerDataService.setReportOptions(reportOptions);
                        vm.entityViewerDataService.dashboard.setReportDateFromDashboardProp(true);

                        vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                        vm.entityViewerEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);
                    }

                }

            }

            var cleanComponentsOutputsToDelete = function (activeTabOnly) {

                var componentsOutputs = vm.dashboardDataService.getAllComponentsOutputs();

                Object.keys(componentsOutputs).forEach(function (compKey) {

                    if (componentsOutputs[compKey] && typeof componentsOutputs[compKey] === 'object'
                        && componentsOutputs[compKey].deleteOnChange) {

                        if (activeTabOnly) {


                        } else {
                            vm.dashboardDataService.setComponentOutput(compKey, null);
                        }

                    }

                });

            };

            // TODO DEPRECATED, delete soon as dashboard will be discussed
            /*vm.oldEventExchanges = function () {

                if (vm.componentData.settings.linked_components) {

                    console.log('vm.componentData.settings.linked_components', vm.componentData.settings.linked_components);

                    if (vm.componentData.settings.linked_components.hasOwnProperty('active_object')) {

                        var componentId = vm.componentData.settings.linked_components.active_object;

                        vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {

                            vm.handleDashboardActiveObject(componentId)

                        })

                    }

                    if (vm.componentData.settings.linked_components.hasOwnProperty('report_settings')) {

                        Object.keys(vm.componentData.settings.linked_components.report_settings).forEach(function (property) {

                            var componentId = vm.componentData.settings.linked_components.report_settings[property];

                            vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + componentId, function () {

                                var componentOutput = vm.dashboardDataService.getComponentOutput(componentId);

                                var reportOptions = vm.entityViewerDataService.getReportOptions();

                                console.log('componentOutput', componentOutput);

                                reportOptions[property] = componentOutput.value;

                                vm.entityViewerDataService.setReportOptions(reportOptions);

                                vm.entityViewerEventService.dispatchEvent(evEvents.REQUEST_REPORT)

                            })

                        })

                    }

                    if (vm.componentData.settings.linked_components.hasOwnProperty('filter_links')) {

                        vm.componentData.settings.linked_components.filter_links.forEach(function (filter_link) {

                            vm.dashboardEventService.addEventListener('COMPONENT_VALUE_CHANGED_' + filter_link.component_id, function () {

                                vm.handleDashboardFilterLink(filter_link)

                            })
                        })

                    }


                }

                if (vm.componentData.type === 'report_viewer' || vm.componentData.type === 'report_viewer_matrix') {

                    vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                        var activeObject = vm.entityViewerDataService.getActiveObject();

                        console.log('click report viewer active object', activeObject);

                        vm.dashboardDataService.setComponentOutput(vm.componentData.id, activeObject);

                        vm.dashboardEventService.dispatchEvent('COMPONENT_VALUE_CHANGED_' + vm.componentData.id)

                        if(vm.componentData.settings.auto_refresh) {

                            vm.dashboardEventService.dispatchEvent(dashboardEvents.REFRESH_ALL)

                        }

                    });

                }

            }; */


            vm.initDashboardExchange = function () { // initialize only for components that are not in filled in mode

                // vm.oldEventExchanges()
                var clearUseFromAboveFilters = function () {

                    vm.entityViewerDataService.setActiveObject(null);
                    vm.entityViewerDataService.setActiveObjectFromAbove(null);

                    console.log('CLEARED ACTIVE OBJECT ', vm.entityViewerDataService.getActiveObject());
                    console.log('CLEARED ACTIVE OBJECT FROM ABOVE ', vm.entityViewerDataService.getActiveObjectFromAbove());

                    vm.entityViewerEventService.dispatchEvent(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS);

                };

                vm.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ALL, function () {
                    //vm.applyDashboardChanges();
                    updateReportSettingsUsingDashboardData();
                    cleanComponentsOutputsToDelete();
                    clearUseFromAboveFilters();

                });

                vm.dashboardEventService.addEventListener(dashboardEvents.REFRESH_ACTIVE_TAB, function () {

                    var activeTab = vm.dashboardDataService.getActiveTab();

                    console.log('activeTab', activeTab.tab_number);
                    console.log('$scope.$parent.vm.tabNumber', $scope.$parent.vm.tabNumber);

                    if (activeTab.tab_number === $scope.$parent.vm.tabNumber) {
                        //vm.applyDashboardChanges();
                        updateReportSettingsUsingDashboardData();
                        cleanComponentsOutputsToDelete();
                        clearUseFromAboveFilters();
                    }

                });

                vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_ACTIVE_OBJECT_CHANGE, function () {

                    // update report filters from dashboard component
                    if (vm.componentData.settings.linked_components.hasOwnProperty('filter_links')) {

                        vm.componentData.settings.linked_components.filter_links.forEach(function (filter_link) {
                            vm.handleDashboardFilterLink(filter_link);
                        });

                    }

                    /*if (vm.componentData.settings.auto_refresh) {
                        updateReportSettingsUsingDashboardData();
                    }*/

                    updateActiveObjectUsingDashboardData();

                });


                var message;

                vm.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_OUTPUT_CHANGE, function () {

                    message = 'Component: ' + vm.componentData.name + ' Type: ' + vm.componentData.settings.entity_type + 'listener COMPONENT_OUTPUT_CHANGE';
                    console.log('dashboardReportViewerController', vm);
                    console.log(message);
                    if (vm.componentData.settings.auto_refresh) {
                        updateReportSettingsUsingDashboardData();
                    }
                });

                vm.dashboardEventService.addEventListener(dashboardEvents.CLEAR_ACTIVE_TAB_USE_FROM_ABOVE_FILTERS, function () {

                    var activeTab = vm.dashboardDataService.getActiveTab();

                    if (activeTab.tab_number === $scope.$parent.vm.tabNumber) {
                        clearUseFromAboveFilters();
                    }

                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.UPDATE_VIEWER_TABLE_COLUMNS, function () {

                    var columns = vm.dashboardComponentDataService.getViewerTableColumns();
                    vm.entityViewerDataService.setColumns(columns);

                    vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.SAVE_VIEWER_TABLE_CONFIGURATION, function () {

                    var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);
                    // revert options that were change because of dashboard
                    currentLayoutConfig.data.interfaceLayout = savedInterfaceLayout;
                    currentLayoutConfig.data.additions = savedAddtions;

                    if (currentLayoutConfig.hasOwnProperty('id')) {
                        uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function () {
                            vm.entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});
                        });
                    }

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        clickOutsideToClose: false
                    })
                });

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.CLEAR_USE_FROM_ABOVE_FILTERS, clearUseFromAboveFilters);

                vm.dashboardComponentEventService.addEventListener(dashboardEvents.RELOAD_COMPONENT, function () {
                    vm.getView()
                });

            };

            vm.downloadAttributes = function () {

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
                        // $scope.$apply();

                        resolve();

                    }).catch(function (error) {

                        resolve({errorObj: error, errorCause: 'dynamicAttributes'});

                    })

                })

            };

            var setDataFromDashboard = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                vm.componentData = $scope.$parent.vm.componentData;
                vm.userSettings = vm.componentData.user_settings;
                vm.dashboardDataService = $scope.$parent.vm.dashboardDataService;
                vm.dashboardEventService = $scope.$parent.vm.dashboardEventService;

                console.log('vm.dashboardEventService', vm.dashboardEventService);

                vm.dashboardComponentDataService = $scope.$parent.vm.dashboardComponentDataService;
                vm.dashboardComponentEventService = $scope.$parent.vm.dashboardComponentEventService;

                if ((vm.componentData.type === 'report_viewer' ||
                    vm.componentData.type === 'report_viewer_split_panel') &&
                    vm.userSettings) {
                    // Set attributes available for columns addition
                    if (vm.userSettings.manage_columns && vm.userSettings.manage_columns.length > 0) {
                        vm.attributeDataService.setAttributesAvailableForColumns(vm.userSettings.manage_columns);
                    }

                    if (vm.componentData.settings.styles && vm.componentData.settings.styles.cell.text_align) {
                        vm.entityViewerDataService.dashboard.setColumnsTextAlign(vm.componentData.settings.styles.cell.text_align);
                    }

                }

                if (vm.componentData.type === 'report_viewer_matrix') {
                    vm.matrixSettings = {
                        top_left_title: vm.componentData.settings.top_left_title,
                        number_format: vm.componentData.settings.number_format,
                        abscissa: vm.componentData.settings.abscissa,
                        ordinate: vm.componentData.settings.ordinate,
                        value_key: vm.componentData.settings.value_key,
                        subtotal_formula_id: vm.componentData.settings.subtotal_formula_id,
                        matrix_view: vm.componentData.settings.matrix_view,
                        styles: vm.componentData.settings.styles,
                        auto_scaling: vm.componentData.settings.auto_scaling
                    };
                }

                if (vm.componentData.type === 'report_viewer_bars_chart') {
                    vm.rvChartsSettings = {
                        bar_name_key: vm.componentData.settings.bar_name_key,
                        bar_number_key: vm.componentData.settings.bar_number_key,
                        bars_direction: vm.componentData.settings.bars_direction,
                        group_number_calc_formula: vm.componentData.settings.group_number_calc_formula,
                        min_bar_width: vm.componentData.settings.min_bar_width,
                        max_bar_width: vm.componentData.settings.max_bar_width,
                        sorting_value_type: vm.componentData.settings.sorting_value_type,
                        sorting_type: vm.componentData.settings.sorting_type,
                        autocalc_ticks_number: vm.componentData.settings.autocalc_ticks_number,
                        ticks_number: vm.componentData.settings.ticks_number,
                        crop_tick_text: vm.componentData.settings.crop_tick_text,
                        tooltip_font_size: vm.componentData.settings.tooltip_font_size,
                        number_format: vm.componentData.settings.number_format,
                        abscissa_position: vm.componentData.settings.abscissa_position,
                        ordinate_position: vm.componentData.settings.ordinate_position,
                    };

                    if (vm.componentData.settings.abscissa || vm.componentData.settings.ordinate) {
                        vm.rvChartsSettings.bar_name_key = vm.componentData.settings.abscissa;
                        vm.rvChartsSettings.bar_number_key = vm.componentData.settings.ordinate;
                    }

                }

                if (vm.componentData.type === 'report_viewer_pie_chart') {
                    vm.rvChartsSettings = {
                        group_attr: vm.componentData.settings.group_attr,
                        number_attr: vm.componentData.settings.number_attr,
                        group_number_calc_formula: vm.componentData.settings.group_number_calc_formula,
                        show_legends: vm.componentData.settings.show_legends,
                        legends_font_size: vm.componentData.settings.legends_font_size,
                        legends_position: vm.componentData.settings.legends_position,
                        legends_columns_number: vm.componentData.settings.legends_columns_number,
                        number_format: vm.componentData.settings.number_format,
                        tooltip_font_size: vm.componentData.settings.tooltip_font_size,
                        chart_form: vm.componentData.settings.chart_form
                    };
                }

            };

            vm.getView = function () {

                //middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = new AttributeDataService();

                //console.log('$scope.$parent.vm.componentData', $scope.$parent.vm.componentData);

                setDataFromDashboard();

                vm.entityViewerDataService.setViewContext('dashboard');

                var downloadAttrsPromise = vm.downloadAttributes();
                vm.setEventListeners();

                vm.entityViewerDataService.setEntityType(vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(true);

                /*if (vm.componentData.type === 'report_viewer_split_panel') {
                    vm.entityViewerDataService.setUseFromAbove(true);
                }*/
                vm.entityViewerDataService.setUseFromAbove(true);

                var layoutId = vm.componentData.settings.layout;

                var setLayoutPromise = new Promise(function (resolve, reject) {

                    uiService.getListLayoutByKey(layoutId).then(function (data) {

                        //vm.layout = data;

                        vm.setLayout(data).then(function () {

                            // needed to prevent saving layout as collapsed when saving it from dashboard
                            var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();
                            savedInterfaceLayout = JSON.parse(JSON.stringify(interfaceLayout));
                            var additions = vm.entityViewerDataService.getAdditions();
                            savedAddtions = JSON.parse(JSON.stringify(additions));

                            rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                            if (vm.componentData.type === 'report_viewer' ||
                                vm.componentData.type === 'report_viewer_split_panel') {

                                var evComponents = vm.entityViewerDataService.getComponents();

                                Object.keys(vm.componentData.settings.components).forEach(function (key) {
                                    evComponents[key] = vm.componentData.settings.components[key];
                                });

                                vm.entityViewerDataService.setComponents(evComponents);

                                // set dashboard columns list for small rv table
                                if (vm.userSettings && vm.userSettings.columns) {

                                    if (fillInModeEnabled) {

                                        var listLayout = vm.entityViewerDataService.getListLayout();
                                        var columns = listLayout.data.columns;
                                        vm.entityViewerDataService.setColumns(columns);

                                    } else {

                                        var columns = JSON.parse(JSON.stringify(vm.userSettings.columns));
                                        vm.entityViewerDataService.setColumns(columns);

                                    }
                                }
                                // < set dashboard columns list for small rv table >
                            }

                            vm.initDashboardExchange();

                            vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            vm.readyStatus.layout = true;

                            $scope.$apply();

                            resolve();

                        });

                    }).catch(function (error) {

                        reject({errorObj: error, errorCause: 'layout'});

                    });

                });

                Promise.all([downloadAttrsPromise, setLayoutPromise]).then(function () {

                    vm.dashboardComponentDataService.setEntityViewerDataService(vm.entityViewerDataService);

                    vm.dashboardComponentDataService.setAttributeDataService(vm.attributeDataService);
                    vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED);

                    var columns = vm.entityViewerDataService.getColumns();
                    vm.dashboardComponentDataService.setViewerTableColumns(columns);
                    //vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.VIEWER_TABLE_COLUMNS_CHANGED);

                }).catch(function (error) {

                    if (error.errorCause === 'layout') {
                        vm.dashboardDataService.setComponentError(vm.componentData.id, {displayMessage: 'failed to load report layout'});
                    }

                    vm.dashboardDataService.setComponentStatus(vm.componentData.id, dashboardComponentStatuses.ERROR);
                    vm.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                    console.log("ERROR: dashboard component that uses report viewer error", error);
                });

            };

            var applySettingsForFilledInMode = function () {

                var listLayout = vm.entityViewerDataService.getListLayout();
                var columns = listLayout.data.columns;
                vm.entityViewerDataService.setColumns(columns);

                var components = vm.entityViewerDataService.getComponents();
                components.sidebar = true;
            };

            var getViewInsideFilledInComponent = function () {

                vm.entityViewerDataService = $scope.$parent.vm.entityViewerDataService;
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = $scope.$parent.vm.attributeDataService;

                setDataFromDashboard();
                vm.setEventListeners();

                applySettingsForFilledInMode();

                vm.readyStatus.layout = true;
                vm.readyStatus.attributes = true;

                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                vm.entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

                vm.dashboardComponentDataService.setAttributeDataService(vm.attributeDataService);
                vm.dashboardComponentEventService.dispatchEvent(dashboardEvents.ATTRIBUTE_DATA_SERVICE_INITIALIZED);

            };

            vm.init = function () {

                if (fillInModeEnabled) {

                    getViewInsideFilledInComponent();

                } else {
                    vm.getView();
                }

            };

            vm.init();

        }

    }()
);