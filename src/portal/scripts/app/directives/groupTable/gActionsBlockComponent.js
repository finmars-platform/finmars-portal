/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var middlewareService = require('../../services/middlewareService');

    var uiService = require('../../services/uiService');

    var convertReportHelper = require('../../helpers/converters/convertReportHelper')
    var reportCopyHelper = require('../../helpers/reportCopyHelper');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');

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
                scope.currentAdditions = scope.evDataService.getAdditions();

                scope.openViewConstructor = function (ev) {

                    if (scope.isReport) {

                        var controllerName = '';
                        var templateUrl = '';

                        console.log('scope.openModalSettings.entityType', scope.entityType);

                        switch (scope.entityType) {
                            case 'balance-report':
                                controllerName = 'gModalReportController as vm';
                                templateUrl = 'views/directives/groupTable/modal-report-view.html';
                                break;
                            case 'pnl-report':
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

                };

                scope.openActions = function ($mdOpenMenu, $event) {

                    scope.currentAdditions = scope.evDataService.getAdditions();

                    if (!Object.keys(scope.currentAdditions).length) {

                        clearAdditions();

                        scope.currentAdditions = scope.evDataService.getAdditions();
                    }

                    $mdOpenMenu($event);

                };

                scope.openExportActions = function ($mdOpenMenu, $event) {


                    $mdOpenMenu($event);
                };

                function clearAdditions() {

                    var additions = {
                        additionsState: false,
                        reportWizard: false,
                        editor: false,
                        permissionEditor: false
                    };

                    scope.evDataService.setAdditions(additions);
                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                }

                scope.openDataViewPanel = function () {

                    if (scope.currentAdditions.reportWizard === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: true,
                            editor: false,
                            permissionEditor: false
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

                    }

                };

                scope.openPermissionEditor = function () {

                    console.log('scope.currentAdditions', scope.currentAdditions);

                    if (scope.currentAdditions.permissionEditor === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: false,
                            editor: false,
                            permissionEditor: true
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

                    }

                };

                scope.openEditorViewPanel = function () {

                    if (scope.currentAdditions.editor === false) {

                        var additions = {
                            additionsState: true,
                            reportWizard: false,
                            editor: true,
                            permissionEditor: false
                        };

                        scope.evDataService.setAdditions(additions);
                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

                    } else {

                        clearAdditions();

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

                        scope.reportOptions = reportOptions;

                        scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE)

                    })

                };

                scope.openLayoutList = function ($event) {

                    var entityType = metaContentTypesService.getContentTypeUIByState($state.current.name);

                    $mdDialog.show({
                        controller: 'UiLayoutListDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-list-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            options: {
                                entityType: entityType
                            }
                        }
                    }).then(function (res) {
                        if (res.status == 'agree') {
                            middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar
                            $state.reload($state.current.name);
                            // $state.reload();
                        }

                    })
                };

                scope.saveLayoutList = function ($event) {

                    // saving columns widths - OUTDATED CODE
                    /*var tHead = $('.g-columns-component');
                    var th = $('.g-columns-component.g-thead').find('.g-cell');
                    var thWidths = [];
                    for (var i = 0; i < th.length; i = i + 1) {
                        var thWidth = $(th[i]).width();
                        thWidths.push(thWidth);
                    }*/

                    var listLayout = scope.evDataService.getListLayout();

                    listLayout.data.columns = scope.evDataService.getColumns();
                    listLayout.data.grouping = scope.evDataService.getGroups();
                    listLayout.data.filters = scope.evDataService.getFilters();

                    if (scope.isReport) {

                        listLayout.data.reportOptions = JSON.parse(JSON.stringify(scope.evDataService.getReportOptions()));
                        listLayout.data.reportLayoutOptions = JSON.parse(JSON.stringify(scope.evDataService.getReportLayoutOptions()));
                        console.log("transition prevention reportOptions save", listLayout.data.reportOptions);
                        if (scope.evDataService.getExportOptions()) {
                            listLayout.data.export = JSON.parse(JSON.stringify(scope.evDataService.getExportOptions()));
                        }

                        delete listLayout.data.reportOptions.items;
                        delete listLayout.data.reportOptions.item_complex_transactions;
                        delete listLayout.data.reportOptions.item_counterparties;
                        delete listLayout.data.reportOptions.item_responsibles;
                        delete listLayout.data.reportOptions.item_strategies3;
                        delete listLayout.data.reportOptions.item_strategies2;
                        delete listLayout.data.reportOptions.item_strategies1;
                        delete listLayout.data.reportOptions.item_portfolios;
                        delete listLayout.data.reportOptions.item_instruments;
                        delete listLayout.data.reportOptions.item_instrument_pricings;
                        delete listLayout.data.reportOptions.item_instrument_accruals;
                        delete listLayout.data.reportOptions.item_currency_fx_rates;
                        delete listLayout.data.reportOptions.item_currencies;
                        delete listLayout.data.reportOptions.item_accounts;

                    }

                    // listLayout.data.columnsWidth = thWidths;

                    if (listLayout.hasOwnProperty('id')) {
                        uiService.updateListLayout(listLayout.id, listLayout)
                    } else {
                        uiService.createListLayout(scope.entityType, listLayout)
                    }

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        targetEvent: $event,
                        clickOutsideToClose: false
                    }).then(function () {

                        scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);

                        middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar

                    });


                };

                scope.saveAsLayoutList = function ($event) {

                    /*var tHead = $('.g-columns-component');
                    var th = $('.g-columns-component.g-thead').find('.g-cell');
                    var thWidths = [];
                    for (var i = 0; i < th.length; i = i + 1) {
                        var thWidth = $(th[i]).width();
                        thWidths.push(thWidth);
                    }*/

                    var listLayout = scope.evDataService.getListLayout();

                    console.log('save layout listLayout', listLayout);

                    listLayout.data.columns = scope.evDataService.getColumns();
                    listLayout.data.grouping = scope.evDataService.getGroups();
                    listLayout.data.filters = scope.evDataService.getFilters();

                    console.log('save layout modified listLayout', listLayout);

                    if (scope.isReport) {

                        listLayout.data.reportOptions = JSON.parse(JSON.stringify(scope.evDataService.getReportOptions()));
                        listLayout.data.reportLayoutOptions = JSON.parse(JSON.stringify(scope.evDataService.getReportLayoutOptions()));

                        if (scope.evDataService.getExportOptions()) {
                            listLayout.data.export = JSON.parse(JSON.stringify(scope.evDataService.getExportOptions()));
                        }

                        delete listLayout.data.reportOptions.items;
                        delete listLayout.data.reportOptions.item_complex_transactions;
                        delete listLayout.data.reportOptions.item_counterparties;
                        delete listLayout.data.reportOptions.item_responsibles;
                        delete listLayout.data.reportOptions.item_strategies3;
                        delete listLayout.data.reportOptions.item_strategies2;
                        delete listLayout.data.reportOptions.item_strategies1;
                        delete listLayout.data.reportOptions.item_portfolios;
                        delete listLayout.data.reportOptions.item_instruments;
                        delete listLayout.data.reportOptions.item_instrument_pricings;
                        delete listLayout.data.reportOptions.item_instrument_accruals;
                        delete listLayout.data.reportOptions.item_currency_fx_rates;
                        delete listLayout.data.reportOptions.item_currencies;
                        delete listLayout.data.reportOptions.item_accounts;

                    }

                    // listLayout.data.columnsWidth = thWidths;

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

                            if (listLayout.id) {

                                uiService.getListLayout(scope.entityType).then(function (data) {
                                    var layouts = data.results;
                                    var activeListLayout;

                                    var i;
                                    for (i = 0; i < layouts.length; i = i + 1) {
                                        if (layouts[i].id === listLayout.id) {
                                            layouts[i].is_default = false;
                                            activeListLayout = layouts[i];
                                            break;
                                        }
                                    }

                                    console.log('save layout activeListLayout', activeListLayout);

                                    uiService.updateListLayout(activeListLayout.id, activeListLayout).then(function () {

                                        listLayout.name = res.data.name;
                                        listLayout.is_default = true;
                                        delete listLayout.id;

                                        uiService.createListLayout(scope.entityType, listLayout).then(function () {

                                            scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                                            middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar

                                        });

                                    });

                                });

                            } else {
                                console.log('save layout no id');
                                listLayout.name = res.data.name;
                                listLayout.is_default = true;

                                uiService.createListLayout(scope.entityType, listLayout).then(function () {

                                    scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
                                    middlewareService.setData('entityActiveLayoutSwitched', true); // Give signal to update active layout name in the toolbar

                                });
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

                scope.copyReport = function ($event) {
                    console.log('copy report');
                    reportCopyHelper.copy();
                };

            }
        }
    }

}());