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

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

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

                                scope.evDataService.resetData();
                                scope.evDataService.resetRequestParameters();

                                var rootGroup = scope.evDataService.getRootGroupData();

                                scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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

                                    scope.evDataService.resetData();
                                    scope.evDataService.resetRequestParameters();

                                    var rootGroup = scope.evDataService.getRootGroupData();

                                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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

                                    scope.evDataService.resetData();
                                    scope.evDataService.resetRequestParameters();

                                    var rootGroup = scope.evDataService.getRootGroupData();

                                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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
                        middlewareService.deleteData('splitPanelActiveLayoutSwitched');

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

                        reportOptions = res.data;

                        scope.evDataService.setReportOptions(reportOptions);

                        reportOptions = reportOptions;

                        scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE)

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

                    setInterval(function () {

                        var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();
                        var layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                        if (activeLayoutConfig.hasOwnProperty('name') && layoutCurrentConfig.hasOwnProperty('name')) {

                            if (scope.layoutChanged !== !evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport)) {
                                scope.layoutChanged = !scope.layoutChanged;
                                scope.$apply();
                            }

                        }

                    }, 1000)

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
                                middlewareService.setData('entityActiveLayoutSwitched', res.data.layoutName); // Give signal to update active layout name in the toolbar
                            } else {
                                middlewareService.setData('splitPanelActiveLayoutSwitched', res.data.layoutName); // Give signal to update active layout name in the toolbar
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
                            scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);

                            scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport});

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            middlewareService.setData('entityActiveLayoutSwitched', listLayout.name); // Give signal to update active layout name in the toolbar

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


                            var getPricingPolicy = function () {

                                pricingPolicyService.getList().then(function (data) {

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

                            currencyService.getList({"pageSize": 200}).then(function (data) {

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

                        middlewareService.setData('entityActiveLayoutSwitched', listLayout.name); // Give signal to update active layout name in the toolbar

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

                    // middlewareService.setData('entityActiveLayoutSwitched', listLayout.name); // Give signal to update active layout name in the toolbar
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
                                        middlewareService.setData('entityActiveLayoutSwitched', listLayout.name); // Give signal to update active layout name in the toolbar
                                    } else {
                                        scope.evDataService.setSplitPanelDefaultLayout(listLayout.id);
                                        scope.evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                                        middlewareService.setData('splitPanelActiveLayoutSwitched', listLayout.name); // Give signal to update active split panel layout name in the toolbar
                                    }

                                    scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);

                                    scope.evDataService.setListLayout(listLayout);
                                    scope.evDataService.setActiveLayoutConfiguration({layoutConfig: listLayout});

                                    scope.isNewLayout = false;
                                    // scope.didLayoutChanged();
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

                    var blobPart = convertReportHelper.convertToCSV(flatList, columns, scope.isReport, groups.length);
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
                didLayoutChanged();

            }
        }
    }

}());