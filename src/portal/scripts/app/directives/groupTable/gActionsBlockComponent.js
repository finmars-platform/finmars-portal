/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');
    var evHelperService = require('../../services/entityViewerHelperService');

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var middlewareService = require('../../services/middlewareService');

    var uiService = require('../../services/uiService');

    var convertReportHelper = require('../../helpers/converters/convertReportHelper');
    var reportCopyHelper = require('../../helpers/reportCopyHelper');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var objectComparisonHelper = require('../../helpers/objectsComparisonHelper');
    var metaHelper = require('../../helpers/meta.helper');

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    module.exports = function ($mdDialog, $state) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/actions-block-view.html',
            link: function (scope, elem, attrs) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType);
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.currentAdditions = scope.evDataService.getAdditions();
                scope.isNewLayout = false;

                var checkLayoutExistence = function () {
                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (!listLayout.hasOwnProperty('id')) {
                        scope.isNewLayout = true;
                    }
                };

                scope.openViewConstructor = function (ev) {

                    if (scope.isReport) {

                        var controllerName = '';
                        var templateUrl = '';

                        switch (scope.entityType) {
                            case 'balance-report':
                                controllerName = 'gModalReportController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'pl-report':
                                controllerName = 'gModalReportPnlController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'performance-report':
                                controllerName = 'gModalReportPerformanceController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-performance-view.html';
                                break;
                            case 'cash-flow-projection-report':
                                controllerName = 'gModalReportCashFlowProjectionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-cash-flow-projection-view.html';
                                break;
                            case 'transaction-report':
                                controllerName = 'gModalReportTransactionController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-transaction-view.html';
                                break;
                        }

                        $mdDialog.show({
                            controller: controllerName,
                            templateUrl: templateUrl,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });


                    } else {
                        $mdDialog.show({
                            controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                            templateUrl: 'views/directives/groupTable/modal-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService
                            }
                        });
                    }
                };

                scope.insertObjectAfterCreateHandler = function (resultItem) {

                    var groups = scope.evDataService.getDataAsList();
                    var requestParameters = scope.evDataService.getAllRequestParameters();
                    var requestParametersKeys = Object.keys(requestParameters);

                    var matchedRequestParameter;

                    for (var i = 0; i < requestParametersKeys.length; i = i + 1) {

                        var key = requestParametersKeys[i];

                        var match = true;

                        var filter_types = requestParameters[key].body.groups_types.map(function (item) {
                            return item.key
                        });

                        var filter_values = requestParameters[key].body.groups_values;

                        if (filter_values.length) {
                            filter_values.forEach(function (value, index) {

                                if (resultItem[filter_types[index]] !== value) {
                                    match = false
                                }


                            })
                        } else {

                            if (filter_types.length) {
                                match = false;
                            }
                        }

                        if (match) {
                            matchedRequestParameter = requestParameters[key];
                            break;
                        }

                    }

                    if (matchedRequestParameter) {

                        groups.forEach(function (group) {

                            if (group.___id === matchedRequestParameter.id) {

                                var exampleItem = group.results[0]; // copying of ___type, ___parentId and etc fields

                                var result = Object.assign({}, exampleItem, resultItem);

                                result.___id = evRvCommonHelper.getId(result);
                                var beforeControlRowIndex = group.results.length - 1;

                                group.results.splice(beforeControlRowIndex, 0, result);

                            }


                        })

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.getEntityNameByState = function () {

                    switch ($state.current.name) {
                        case 'app.data.portfolio':
                            return "PORTFOLIO";
                            break;
                        case 'app.data.account':
                            return "ACCOUNT";
                            break;
                        case 'app.data.counterparty':
                            return "COUNTERPARTY";
                            break;
                        case 'app.data.counterparty-group':
                            return "COUNTERPARTY GROUP";
                            break;
                        case 'app.data.responsible':
                            return "RESPONSIBLE";
                            break;
                        case 'app.data.responsible-group':
                            return "RESPONSIBLE GROUP";
                            break;
                        case 'app.data.instrument':
                            return "INSTRUMENT";
                            break;
                        case 'app.data.transaction':
                            return "TRANSACTION";
                            break;
                        case 'app.data.price-history':
                            return "PRICE HISTORY";
                            break;
                        case 'app.data.currency-history':
                            return "CURRENCY HISTORY";
                            break;
                        case 'app.data.strategy':
                            return "STRATEGY";
                            break;
                        case 'app.data.strategy-subgroup':
                            return "STRATEGY SUBGROUP";
                            break;
                        case 'app.data.strategy-group':
                            return "STRATEGY GROUP";
                            break;
                        case 'app.data.account-type':
                            return "ACCOUNT TYPES";
                            break;
                        case 'app.data.instrument-type':
                            return "INSTRUMENT TYPES";
                            break;
                        case 'app.data.pricing-policy':
                            return "PRICING POLICY";
                            break;
                        case 'app.data.transaction-type':
                            return "TRANSACTION TYPE";
                            break;
                        case 'app.data.transaction-type-group':
                            return "TRANSACTION TYPE GROUP";
                            break;
                        case 'app.data.currency':
                            return "CURRENCY";
                            break;
                        case 'app.data.complex-transaction':
                            return "TRANSACTION";
                            break;
                        case 'app.data.tag':
                            return "TAG";
                            break;
                        default:
                            return "ENTITIY";
                            break;
                    }
                };

                scope.addEntity = function (ev) {

                    if (scope.entityType === 'transaction-type') {

                        $mdDialog.show({
                            controller: 'TransactionTypeAddDialogController as vm',
                            templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                entityType: scope.entityType,
                                entity: {}
                            }
                        }).then(function (res) {

                            if (res && res.res === 'agree') {

                                scope.insertObjectAfterCreateHandler(res.data);

                            }

                        })


                    } else {

                        if (scope.entityType === 'complex-transaction') {

                            $mdDialog.show({
                                controller: 'ComplexTransactionAddDialogController as vm',
                                templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                locals: {
                                    entityType: scope.entityType,
                                    entity: {}
                                }
                            }).then(function (res) {

                                if (res && res.res === 'agree') {

                                    scope.insertObjectAfterCreateHandler(res.data.complex_transaction);

                                }

                            })


                        } else {

                            $mdDialog.show({
                                controller: 'EntityViewerAddDialogController as vm',
                                templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                locals: {
                                    entityType: scope.entityType,
                                    entity: {}
                                }
                            }).then(function (res) {

                                if (res && res.res === 'agree') {

                                    scope.insertObjectAfterCreateHandler(res.data);

                                }

                            })

                        }

                    }

                };

                scope.openActions = function ($mdOpenMenu, $event) {

                    $mdOpenMenu($event);

                };

                scope.openExportActions = function ($mdOpenMenu, $event) {
                    $mdOpenMenu($event);
                };

                function clearAdditions() {

                    var additions = scope.evDataService.getAdditions();

                    additions.isOpen = false;
                    additions.type = '';
                    delete additions.layoutId;

                    scope.evDataService.setSplitPanelStatus(false);
                    scope.evDataService.setAdditions(additions);

                    scope.currentAdditions = scope.evDataService.getAdditions();

                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                }


                scope.toggleSplitPanel = function ($event, type) {

                    if (scope.currentAdditions.type === type) {

                        clearAdditions();
                        middlewareService.setNewSplitPanelLayoutName(false);

                    } else {

                        var entityType = null;

                        switch (type) {
                            case "balance-report":
                            case "pl-report":
                            case "transaction-report":
                                entityType = type;
                                break;
                        };

                        if (entityType) {

                            $mdDialog.show({
                                controller: 'SelectLayoutDialogController as vm',
                                templateUrl: 'views/dialogs/select-layout-dialog-view.html',
                                targetEvent: $event,
                                locals: {
                                    options: {
                                        dialogTitle: 'Choose layout to open Split Panel with',
                                        entityType: entityType,
                                        noFolding: true
                                    }
                                }

                            }).then(function (res) {

                                if (res.status === 'agree') {

                                    var additions = scope.evDataService.getAdditions();

                                    additions.isOpen = true;
                                    additions.type = type;

                                    if (res.data.listLayoutId) {
                                        additions.layoutId = res.data.listLayoutId;
                                    } else {
                                        delete additions.layoutId;
                                    };

                                    scope.evDataService.setSplitPanelStatus(true);
                                    scope.evDataService.setAdditions(additions);
                                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                                    scope.currentAdditions = scope.evDataService.getAdditions();

                                };

                            });

                        } else {

                            var additions = scope.evDataService.getAdditions();

                            additions.isOpen = true;
                            additions.type = type;
                            delete additions.layoutId;

                            scope.evDataService.setSplitPanelStatus(true);
                            scope.evDataService.setAdditions(additions);
                            scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                            scope.currentAdditions = scope.evDataService.getAdditions();

                        }



                    }

                };

                scope.calculateReport = function () {

                    scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                };

                scope.openReportSettings = function ($event) {

                    var reportOptions = scope.evDataService.getReportOptions();

                    $mdDialog.show({
                        controller: 'GReportSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            reportOptions: reportOptions,
                            options: {
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            reportOptions = res.data;

                            scope.evDataService.setReportOptions(reportOptions);

                            reportOptions = reportOptions;

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                        }

                    })

                };

                scope.openEntityViewerSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'GEntityViewerSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-entity-viewer-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: {
                                entityViewerDataService: scope.evDataService
                            }
                        }
                    });

                };

                scope.layoutChanged = false;

                var didLayoutChanged = function () {

                    var changedEntityViewerParts = {}; // Will be needed to check if changes have been reset by user.

                    var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                    var dleEventIndex = scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                        activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();
                    });

                    var isLayoutTheSame = function (data1, data2) {

                        if (typeof data1 === 'object' && typeof data2 === 'object') {

                            return objectComparisonHelper.comparePropertiesOfObjects(data1, data2);

                        } else {

                            if (data1 !== data2) {
                                return false;
                            }

                            return true;

                        };

                    };

                    var areReportOptionsTheSame = function () {

                        var originalReportOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportOptions);

                        delete originalReportOptions.task_id;
                        delete originalReportOptions.recieved_at;
                        delete originalReportOptions.task_status;

                        var currentReportOptions = metaHelper.recursiveDeepCopy(scope.evDataService.getReportOptions());

                        delete currentReportOptions.task_id;
                        delete currentReportOptions.recieved_at;
                        delete currentReportOptions.task_status;
                        delete currentReportOptions.custom_fields;
                        delete currentReportOptions.custom_fields_object;
                        delete currentReportOptions.items;
                        delete currentReportOptions.item_complex_transactions;
                        delete currentReportOptions.item_counterparties;
                        delete currentReportOptions.item_responsibles;
                        delete currentReportOptions.item_strategies3;
                        delete currentReportOptions.item_strategies2;
                        delete currentReportOptions.item_strategies1;
                        delete currentReportOptions.item_portfolios;
                        delete currentReportOptions.item_instruments;
                        delete currentReportOptions.item_instrument_pricings;
                        delete currentReportOptions.item_instrument_accruals;
                        delete currentReportOptions.item_currency_fx_rates;
                        delete currentReportOptions.item_currencies;
                        delete currentReportOptions.item_accounts;

                        return isLayoutTheSame(originalReportOptions, currentReportOptions);
                    };

                    var groupsChangeEventIndex = scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                        var originalGroups = activeLayoutConfig.data.grouping;
                        var currentGroups = scope.evDataService.getGroups();

                        if (!isLayoutTheSame(currentGroups, originalGroups)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var columnsChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        var originalColumns = activeLayoutConfig.data.columns;
                        var currentColumns = scope.evDataService.getColumns();

                        if (!isLayoutTheSame(currentColumns, originalColumns)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var columnsSortChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                        var originalColumns = activeLayoutConfig.data.columns;
                        var currentColumns = scope.evDataService.getColumns();

                        if (!isLayoutTheSame(currentColumns, originalColumns)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var rceEventIndex = scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

                        var originalColumns = activeLayoutConfig.data.columns;
                        var currentColumns = scope.evDataService.getColumns();

                        if (!isLayoutTheSame(currentColumns, originalColumns)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                            scope.$apply();
                        };

                    });

                    var filtersChangeEventIndex = scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                        var originalFilters = activeLayoutConfig.data.filters;
                        var currentFilters = scope.evDataService.getFilters();

                        if (!isLayoutTheSame(currentFilters, originalFilters)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var additionsChangeEventIndex = scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                        var originAdditions = activeLayoutConfig.data.additions;
                        var currentAdditions = scope.evDataService.getAdditions();

                        if (!isLayoutTheSame(originAdditions, currentAdditions)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var utvEventIndex = scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                        var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
                        var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

                        if (!isLayoutTheSame(originInterfaceLayout, currentInterfaceLayout)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        };

                    });

                    var tfaEventIndex = scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                        var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
                        var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

                        if (!isLayoutTheSame(originInterfaceLayout, currentInterfaceLayout)) {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                            scope.$apply();
                        };

                    });

                    if (scope.isReport) {

                        var roChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                            var originReportLayoutOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportLayoutOptions);

                            if (originReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                                delete activeLayoutConfig.data.reportOptions.pl_first_date;
                            }

                            if (originReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                                delete activeLayoutConfig.data.reportOptions.report_date;
                            }


                            var currentReportLayoutOptions = metaHelper.recursiveDeepCopy(scope.evDataService.getReportLayoutOptions());

                            if (currentReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                                delete activeLayoutConfig.data.reportOptions.pl_first_date;
                            }

                            if (currentReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                                delete activeLayoutConfig.data.reportOptions.report_date;
                            }

                            if (!areReportOptionsTheSame() ||
                                !isLayoutTheSame(originReportLayoutOptions, currentReportLayoutOptions)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                                // scope.$apply();
                            }

                        });

                        var rtvChangedEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_TABLE_VIEW_CHANGED, function () {

                            var originalColumns = activeLayoutConfig.data.columns;
                            var currentColumns = scope.evDataService.getColumns();

                            var originalRootGroupOptions = activeLayoutConfig.data.rootGroupOptions;
                            var currentRootGroupOptions = scope.evDataService.getRootGroupOptions();

                            var originalGroups = activeLayoutConfig.data.grouping;
                            var currentGroups = scope.evDataService.getGroups();

                            if (!isLayoutTheSame(originalColumns, currentColumns) ||
                                !isLayoutTheSame(originalGroups, currentGroups) ||
                                !isLayoutTheSame(originalRootGroupOptions, currentRootGroupOptions) ||
                                !areReportOptionsTheSame()) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();

                            };

                        });

                        var reoChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_EXPORT_OPTIONS_CHANGED, function () {

                            var originalReportExportOptions = activeLayoutConfig.data.export;
                            var currentReportExportOptions = scope.evDataService.getExportOptions();

                            if (!isLayoutTheSame(originalReportExportOptions, currentReportExportOptions)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                    };

                    var changesTrackingEvents = {
                        GROUPS_CHANGE: groupsChangeEventIndex,
                        COLUMNS_CHANGE: columnsChangeEventIndex,
                        COLUMN_SORT_CHANGE: columnsSortChangeEventIndex,
                        RESIZE_COLUMNS_END: rceEventIndex,
                        FILTERS_CHANGE: filtersChangeEventIndex,
                        ADDITIONS_CHANGE: additionsChangeEventIndex,
                        UPDATE_TABLE_VIEWPORT: utvEventIndex,
                        TOGGLE_FILTER_AREA: tfaEventIndex,
                        REPORT_OPTIONS_CHANGE: roChangeEventIndex,
                        REPORT_TABLE_VIEW_CHANGED: rtvChangedEventIndex,
                        REPORT_EXPORT_OPTIONS_CHANGED: reoChangeEventIndex,
                        DATA_LOAD_END: dleEventIndex
                    };

                    var removeChangesTrackingEventListeners = function () {

                        var trackingEventsListenerNames = Object.keys(changesTrackingEvents);

                        for (var i = 0; i < trackingEventsListenerNames.length; i++) {
                            var telName = trackingEventsListenerNames[i];

                            if (changesTrackingEvents[telName]) { // execute only if event listener has been added

                                scope.evEventService.removeEventListener(evEvents[telName], changesTrackingEvents[telName]);

                            }
                        };
                    };

                };

                scope.openLayoutList = function ($event) {

                    $mdDialog.show({
                        controller: 'UiLayoutListDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-list-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: false,
                        locals: {
                            options: {
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService,
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                            if (scope.isRootEntityViewer) {
                                middlewareService.setNewEntityViewerLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar
                            } else {
                                middlewareService.setNewSplitPanelLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar
                            }

                        }

                    })
                };

                var createNewLayoutMethod = function () {

                    scope.evDataService.resetData();

                    var rootGroup = scope.evDataService.getRootGroupData();
                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    var defaultList = uiService.getListLayoutTemplate();

                    var listLayout = {};
                    listLayout.data = Object.assign({}, defaultList[0].data);

                    listLayout.name = "New Layout";
                    listLayout.data.columns = [];

                    scope.evDataService.setColumns(listLayout.data.columns);
                    scope.evDataService.setGroups(listLayout.data.grouping);
                    scope.evDataService.setFilters(listLayout.data.filters);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    if (!scope.isReport) {
                        scope.evDataService.setListLayout(listLayout);
                    }

                    listLayout.data.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    scope.evDataService.setComponents(listLayout.data.components);
                    scope.evDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    scope.evDataService.setRootEntityViewer(true);

                    if (scope.isReport) {

                        var reportOptions = {};
                        var reportLayoutOptions = {
                            datepickerOptions: {
                                reportFirstDatepicker: {},
                                reportLastDatepicker: {}
                            }
                        };

                        var todaysDate = moment(new Date()).format('YYYY-MM-DD');

                        var finishCreatingNewReportLayout = function () {

                            scope.evDataService.setReportOptions(reportOptions);
                            scope.evDataService.setReportLayoutOptions(reportLayoutOptions);
                            scope.evDataService.setExportOptions({});

                            listLayout.data.reportOptions = reportOptions;
                            listLayout.data.reportLayoutOptions = reportLayoutOptions;
                            listLayout.data.export = {};

                            scope.evDataService.setListLayout(listLayout);

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);
                            scope.$apply(); // needed to update Report settings area in right sidebar
                            scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                            scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport});

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar

                            scope.isNewLayout = true;

                        };

                        reportOptions.cost_method = 1;
                        reportOptions.portfolio_mode = 1;
                        reportOptions.strategy1_mode = 0;
                        reportOptions.strategy2_mode = 0;
                        reportOptions.strategy3_mode = 0;
                        reportOptions.accounts_cash = [];
                        reportOptions.accounts_cash[0] = 1;
                        reportOptions.accounts_position = [];
                        reportOptions.accounts_position[0] = 1;
                        reportOptions.approach_multiplier = 0.5;
                        reportOptions.calculationGroup = 'portfolio';

                        if (scope.entityType !== 'transaction-report') {

                            if (scope.entityType === 'pl-report') {

                                reportOptions.pl_first_date = todaysDate;

                                reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {
                                    datepickerMode: 'datepicker'
                                };

                            }

                            // For Balance report
                            reportOptions.report_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportLastDatepicker = {
                                datepickerMode: 'datepicker'
                            };


                            var optionsForDataRequest = {
                                pageSize: 1000,
                                page: 1
                            };

                            var getPricingPolicy = function () {

                                pricingPolicyService.getList(optionsForDataRequest).then(function (data) {

                                    var pricingPolicies = data.results;

                                    var p;
                                    for (p = 0; p < pricingPolicies.length; p++) {

                                        if (pricingPolicies[p].name === '-') {
                                            reportOptions.pricing_policy = pricingPolicies[p].id;
                                            break;
                                        }

                                    }

                                    finishCreatingNewReportLayout();


                                }, function (rej) {

                                    finishCreatingNewReportLayout();

                                });

                            };

                            currencyService.getList(optionsForDataRequest).then(function (data) {

                                var currencies = data.results;

                                var c;
                                for (c = 0; c < currencies.length; c++) {

                                    if (currencies[c].name === '-') {
                                        reportOptions.report_currency = currencies[c].id;
                                        break;
                                    }

                                }

                                getPricingPolicy();

                            }, function (rej) {

                                getPricingPolicy();

                            });

                        } else { // For transaction report

                            reportOptions.date_field = null;

                            reportOptions.pl_first_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {
                                datepickerMode: 'datepicker'
                            };

                            reportOptions.end_date = todaysDate;

                            reportLayoutOptions.datepickerOptions.reportLastDatepicker = {
                                datepickerMode: 'datepicker'
                            };

                            finishCreatingNewReportLayout();

                        }

                    } else {

                        scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport});

                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar

                        scope.isNewLayout = true;

                    }

                };

                scope.createNewLayout = function () {

                    var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();
                    var layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport)) {

                        $mdDialog.show({
                            controller: 'LayoutChangesLossWarningDialogController as vm',
                            templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                            parent: angular.element(document.body),
                            preserveScope: false,
                            autoWrap: true,
                            multiple: true,
                            locals: {
                                data: null
                            }
                        }).then(function (res, rej) {

                            if (res.status === 'save_layout') {

                                if (layoutCurrentConfig.hasOwnProperty('id')) {

                                    uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                } else {

                                    uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                }

                            } else if ('do_not_save_layout') {
                                createNewLayoutMethod();
                            }

                        });

                    } else {
                        createNewLayoutMethod();
                    }
                };

                scope.saveLayoutList = function ($event) {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (listLayout.hasOwnProperty('id')) {
                        uiService.updateListLayout(listLayout.id, listLayout).then(function () {
                            scope.evDataService.setActiveLayoutConfiguration({layoutConfig: listLayout});
                        });
                    };

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        targetEvent: $event,
                        clickOutsideToClose: false
                    }).then(function () {

                        scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);

                    });

                    // middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar
                };

                scope.saveAsLayoutList = function ($event) {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            options: {}
                        },
                        clickOutsideToClose: false
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            var saveAsLayout = function () {

                                listLayout.name = res.data.name;

                                uiService.createListLayout(scope.entityType, listLayout).then(function (data) {

                                    listLayout.id = data.id;

                                    if (scope.isRootEntityViewer) {
                                        middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar
                                    } else {
                                        scope.evDataService.setSplitPanelDefaultLayout(listLayout.id);
                                        scope.evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                                        middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active split panel layout name in the toolbar
                                    }

                                    scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);

                                    scope.evDataService.setListLayout(listLayout);
                                    scope.evDataService.setActiveLayoutConfiguration({layoutConfig: listLayout});

                                    scope.isNewLayout = false;
                                    scope.$apply();

                                });

                            };

                            if (listLayout.id) { // if layout based on another existing layout

                                if (scope.isRootEntityViewer) {

                                    uiService.getDefaultListLayout(scope.entityType).then(function (openedLayoutData) {

                                        var currentlyOpenLayout = openedLayoutData.results[0];
                                        currentlyOpenLayout.is_default = false;

                                        uiService.updateListLayout(currentlyOpenLayout.id, currentlyOpenLayout).then(function () {

                                            listLayout.is_default = true;
                                            delete listLayout.id;

                                            saveAsLayout();

                                        });

                                    });

                                } else {

                                    delete listLayout.id;
                                    listLayout.is_default = false;
                                    saveAsLayout();

                                }

                            } else { // if layout was not based on another layout

                                if (scope.isRootEntityViewer) {
                                    listLayout.is_default = true;
                                }

                                saveAsLayout();
                            }
                        }

                    });


                };

                scope.exportAsPdf = function ($event) {

                    $mdDialog.show({
                        controller: 'ExportPdfDialogController as vm',
                        templateUrl: 'views/dialogs/export-pdf-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            evDataService: scope.evDataService,
                            evEventService: scope.evEventService,
                            data: {entityType: scope.entityType}
                        }
                    })

                };

                scope.exportAsXls = function () {
                    var blobPart = convertReportHelper.convertToExcel();
                    downloadFileHelper.downloadFile(blobPart, "text/plain", "report.xls");
                };

                scope.exportAsCSV = function () {
                    /*var rows = document.querySelectorAll('.ev-content .g-row');
                    var columns = document.querySelectorAll('.g-columns-holder .g-cell');*/
                    var flatList = scope.evDataService.getFlatList();
                    var columns = scope.evDataService.getColumns();
                    var groups = scope.evDataService.getGroups();

                    var blobPart = convertReportHelper.convertFlatListToCSV(flatList, columns, scope.isReport, groups.length);
                    downloadFileHelper.downloadFile(blobPart, "text/plain", "report.csv");
                };

                /*scope.copyReport = function ($event) {
                    reportCopyHelper.copy();
                };*/
                scope.copyReport = function () {
                    reportCopyHelper.copy(scope.evDataService, scope.isReport);
                };

                scope.copySelectedToBuffer = function () {
                    reportCopyHelper.copy(scope.evDataService, scope.isReport, 'selected');
                };

                scope.openCustomFieldsManager = function () {

                    $mdDialog.show({
                        controller: 'CustomFieldDialogController as vm',
                        templateUrl: 'views/dialogs/custom-field-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    })

                };

                checkLayoutExistence();

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                    didLayoutChanged();
                });

            }
        }
    }

}());