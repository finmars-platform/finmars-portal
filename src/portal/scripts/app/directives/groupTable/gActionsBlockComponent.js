/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var evEvents = require('../../services/entityViewerEvents');
    var evHelperService = require('../../services/entityViewerHelperService');
    var evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');

    var metaContentTypesService = require('../../services/metaContentTypesService');
    var middlewareService = require('../../services/middlewareService');

    var uiService = require('../../services/uiService');
    var usersService = require('../../services/usersService');

    var convertReportHelper = require('../../helpers/converters/convertReportHelper');
    var reportCopyHelper = require('../../helpers/reportCopyHelper');
    var downloadFileHelper = require('../../helpers/downloadFileHelper');
    var objectComparisonHelper = require('../../helpers/objectsComparisonHelper');
    var metaHelper = require('../../helpers/meta.helper');

    var ecosystemDefaultService = require('../../services/ecosystemDefaultService');

    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');

    var exportExcelService = require('../../services/exportExcelService');


    module.exports = function ($mdDialog, $state, $bigDrawer) {
        return {
            restrict: 'AE',
            scope: {
                attributeDataService: '=',
                evDataService: '=',
                evEventService: '=',
                spExchangeService: '=',
                contentWrapElement: '='
            },
            templateUrl: 'views/directives/groupTable/g-actions-block-view.html',
            link: function (scope, elem, attrs) {

                scope.entityType = scope.evDataService.getEntityType();
                scope.viewContext = scope.evDataService.getViewContext();
                scope.isReport = metaService.isReport(scope.entityType);
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                //scope.isLayoutDefault = false;

                scope.hasCreatePermission = false;
                scope.isBaseTransaction = $state.current.name === 'app.data.transaction'; // Victor 2021.01.06 #72 remove ADD TRANSACTION button

                scope.currentAdditions = scope.evDataService.getAdditions();
                scope.isNewLayout = false;

                scope.verticalAdditions = scope.evDataService.getVerticalAdditions();

                var dleEventIndex;

                // TMP LOGIC FOR REPORT DEBUG STARTS
                // scope.isSqlReport = window.location.search.indexOf('sql=true') !== -1;

                scope.loadingDiff = false

                scope.downloadSqlDiff = function () {

                    var flatList = scope.evDataService.getFlatList();
                    var columns = scope.evDataService.getColumns();
                    var groups = scope.evDataService.getGroups();
                    var reportOptions = scope.evDataService.getReportOptions();
                    var entityType = scope.evDataService.getEntityType();

                    scope.loadingDiff = true

                    return new Promise(function (resolve, reject) {

                        var reportRepository = require('../../repositories/reportRepository');

                        if (entityType === 'balance-report') {

                            reportRepository.getBalanceReport(reportOptions, false).then(function (data) {

                                resolve(data)

                            })

                        }

                        if (entityType === 'pl-report') {

                            reportRepository.getPnlReport(reportOptions, false).then(function (data) {

                                resolve(data)

                            })

                        }

                        if (entityType === 'transaction-report') {

                            reportRepository.getTransactionReport(reportOptions, false).then(function (data) {

                                resolve(data)

                            })

                        }

                    }).then(function (data) {

                        scope.loadingDiff = false;
                        scope.$apply();

                        console.log("Old report data", data);

                        var blobPart = convertReportHelper.convertFlatListToCSV(flatList, columns, scope.isReport, groups.length);
                        downloadFileHelper.downloadFile(blobPart, "text/plain", "report_sql.csv");

                        var blobPartOld = convertReportHelper.convertFlatListToCSV(data.items, columns, scope.isReport, groups.length);
                        downloadFileHelper.downloadFile(blobPartOld, "text/plain", "report_old.csv");

                    })

                };

                // TMP LOGIC FOR DEBUG ENDS
                /*var checkIsLayoutDefault = function () {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (scope.isRootEntityViewer) {
                        scope.isLayoutDefault = listLayout.is_default;
                    } else {

                        var spDefaultLayoutData = scope.evDataService.getSplitPanelDefaultLayout();
                        if (spDefaultLayoutData.layoutId === listLayout.id) {
                            scope.isLayoutDefault = true;
                        } else {
                            scope.isLayoutDefault = false;
                        }

                    }

                };*/

                var checkLayoutExistence = function () {
                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (!listLayout.hasOwnProperty('id')) {
                        scope.isNewLayout = true;
                    }
                };

                scope.getCurrentMember = function () {

                    usersService.getMyCurrentMember().then(function (data) {

                        scope.currentMember = data;

                        scope.currentMember.groups_object.forEach(function (group) {

                            if (group.permission_table) {

                                if (group.permission_table.data) {

                                    group.permission_table.data.forEach(function (item) {

                                        var itemEntityType = metaContentTypesService.findEntityByContentType(item.content_type);

                                        if (itemEntityType === scope.entityType) {

                                            if (item.data.create_objects) {
                                                scope.hasCreatePermission = true;
                                            }

                                        }

                                    })

                                }

                            }

                        });

                        if (scope.currentMember.is_admin || scope.currentMember.is_owner) {
                            scope.hasCreatePermission = true;
                        }

                        scope.$apply();

                    });
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
                            targetEvent: ev,
                            locals: {
                                attributeDataService: scope.attributeDataService,
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService,
                                contentWrapElement: scope.contentWrapElement
                            }
                        });


                    } else {
                        $mdDialog.show({
                            controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                            templateUrl: 'views/directives/groupTable/g-modal-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: {
                                attributeDataService: scope.attributeDataService,
                                entityViewerDataService: scope.evDataService,
                                entityViewerEventService: scope.evEventService,
                                contentWrapElement: scope.contentWrapElement
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
                        /* case 'app.data.pricing-policy':
                            return "PRICING POLICY";
                            break; */
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

				scope.addEntity = async function (ev) {

					var postAddEntityFn = function (res) {
						if (res && res.res === 'agree') {
							scope.insertObjectAfterCreateHandler(res.data);
                            // Victor 2021.02.15 Save button on ADD Entity
/*							if (res.data.action === 'edit') {

                            }*/
						}
					};

					switch (scope.entityType) {

						case 'transaction-type':

							$mdDialog.show({
								controller: 'TransactionTypeAddDialogController as vm',
								templateUrl: 'views/entity-viewer/transaction-type-add-dialog-view.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								locals: {
									entityType: scope.entityType,
									entity: {}
								}

							}).then(postAddEntityFn);

							break;

						case 'complex-transaction':

							/* $mdDialog.show({
                                controller: 'ComplexTransactionAddDialogController as vm',
                                templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: ev,
                                locals: {
                                    entityType: scope.entityType,
                                    entity: {},
                                    data: {}
                                }
                            }).then(function (res) {

                                if (res && res.res === 'agree') {
                                    scope.insertObjectAfterCreateHandler(res.data.complex_transaction);
                                }

                            }) */

							$bigDrawer.show({
								controller: 'ComplexTransactionAddDialogController as vm',
								templateUrl: 'views/entity-viewer/complex-transaction-add-drawer-view.html',
								locals: {
									entityType: scope.entityType,
									entity: {},
									data: {
										openedIn: 'big-drawer'
									}
								}

							}).then(function (res) {

								if (res && res.res === 'agree') {
									scope.insertObjectAfterCreateHandler(res.data.complex_transaction);
								}

							});

							break;

						default:

							/* $mdDialog.show({
								controller: 'EntityViewerAddDialogController as vm',
								templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
								parent: angular.element(document.body),
								targetEvent: ev,
								locals: {
									entityType: scope.entityType,
									entity: {},
									data: {
										openedIn: 'modal-dialog'
									}
								}

							}).then(postAddEntityFn); */

                            var fixedAreaColumns = 6;
                            if (scope.entityType !== 'instrument-type') {
                                fixedAreaColumns = 1;
                            }

                            var bigDrawerWidthPercent = evHelperService.getBigDrawerWidthPercent(fixedAreaColumns);

							$bigDrawer.show({
								controller: 'EntityViewerAddDialogController as vm',
								templateUrl: 'views/entity-viewer/entity-viewer-universal-add-drawer-view.html',
                                addResizeButton: true,
								drawerWidth: bigDrawerWidthPercent,
								locals: {
									entityType: scope.entityType,
									entity: {},
									data: {
										openedIn: 'big-drawer'
									}
								}

							}).then(postAddEntityFn);

					}

				};

                scope.applyFilters = function () {

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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
                    delete additions.layoutData;
                    /*delete additions.layoutId;*/

                    scope.evDataService.setSplitPanelStatus(false);
                    scope.evDataService.setAdditions(additions);

                    scope.currentAdditions = scope.evDataService.getAdditions();

                    scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                    // delete scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                }

                var getListLayoutByEntity = function (entityType) {
                    var options = {
                        pageSize: 1000,
                        page: 1,
                        sort: {
                            key: 'content_type',
                            direction: 'DSC'
                        }
                    };

                    var layouts = [];

                    var getLayouts = function (resolve, reject) {

                        uiService.getListLayout(entityType, options).then(function (data) {

                            layouts = layouts.concat(data.results);

                            if (data.next) {

                                options.page = options.page + 1;
                                getLayouts();

                            } else {
                                resolve(layouts);
                            }

                        }).catch(function (error) {
                            reject(error);
                        })

                    };

                    return new Promise(function (resolve, reject) {

                        getLayouts(resolve, reject);

                    });

                };


                scope.toggleSplitPanel = function ($event, type) {

                    if (scope.currentAdditions.type === type) {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();
                        interfaceLayout.splitPanel.height = 0;

                        scope.evDataService.setInterfaceLayout(interfaceLayout);
                        middlewareService.setNewSplitPanelLayoutName(false);

                        clearAdditions();

                    } else {

                        var entityType = null;

                        switch (type) {
                            case "balance-report":
                            case "pl-report":
                            case "transaction-report":
                                entityType = type;
                                break;
                        }

                        if (entityType) { // in case of choosing entity viewer layout

                            getListLayoutByEntity(entityType).then(function (layoutsList) {

                                var layouts = evRvLayoutsHelper.getDataForLayoutSelectorWithFilters(layoutsList);

                                $mdDialog.show({
                                    controller: "ExpandableItemsSelectorDialogController as vm",
                                    templateUrl: "views/dialogs/expandable-items-selector-dialog-view.html",
                                    targetEvent: $event,
                                    multiple: true,
                                    locals: {
                                        data: {
                                            dialogTitle: 'Choose layout to open Split Panel with',
                                            items: layouts
                                        }
                                    }

                                }).then(function (res) {

                                    if (res.status === 'agree') {

                                        var additions = scope.evDataService.getAdditions();

                                        additions.isOpen = true;
                                        additions.type = type;

                                        if (res.selected.id) {

                                            if (!additions.layoutData) {
                                                additions.layoutData = {};
                                            }

                                            additions.layoutData.layoutId = res.selected.id;
                                            additions.layoutData.name = res.selected.name;

                                            for (var i = 0; i < layouts.length; i++) {

                                                if (layouts[i].id === res.selected.id) {
                                                    additions.layoutData.content_type = layouts[i].content_type;
                                                    break;
                                                }

                                            }

                                            additions.layoutData.content_type = res.selected.content_type;

                                        } else {
                                            delete additions.layoutData;
                                        }

                                        scope.evDataService.setSplitPanelStatus(true);
                                        scope.evDataService.setAdditions(additions);
                                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                                        scope.currentAdditions = scope.evDataService.getAdditions();

                                    }

                                });

                            });

                        } else {

                            var additions = scope.evDataService.getAdditions();

                            additions.isOpen = true;
                            additions.type = type;

                            delete additions.layoutData;

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

                            //reportOptions = reportOptions; // ????????

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                        }

                    })

                };

                scope.openManageAttrsDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'AttributesManagerDialogController as vm',
                        templateUrl: 'views/dialogs/attributes-manager-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    });

                };

                scope.openInputFormEditor = function (ev) {

                    $mdDialog.show({
                        controller: 'EntityDataConstructorDialogController as vm',
                        templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                        targetEvent: ev,
                        multiple: true,
                        locals: {
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    });

                };

                scope.openEntityViewerSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'GEntityViewerSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-entity-viewer-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            entityViewerDataService: scope.evDataService,
                            entityViewerEventService: scope.evEventService
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.evEventService.dispatchEvent(evEvents.ENTITY_VIEWER_SETTINGS_CHANGED);
                        }

                    });

                };

                scope.toggleRecon = function ($event) {

                    var additions = scope.evDataService.getVerticalAdditions();

                    if (additions.type === 'reconciliation') {

                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/dialogs/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            multiple: true,
                            locals: {
                                warning: {
                                    title: 'Warning',
                                    description: "Reconciliation will be closed and it's tables settings will be reset.",
                                    actionButtons: [
                                        {
                                            name: 'CANCEL',
                                            response: {status: 'disagree'}
                                        },
                                        {
                                            name: 'OK',
                                            response: {status: 'agree'}
                                        }
                                    ]
                                }
                            }

                        }).then(function (res) {

                            if (res.status === 'agree') {

                                var interfaceLayout = scope.evDataService.getInterfaceLayout();
                                interfaceLayout.verticalSplitPanel.width = 0;

                                scope.evDataService.setVerticalSplitPanelStatus(false);
                                scope.evDataService.setVerticalAdditions({});

                                scope.evEventService.dispatchEvent(evEvents.VERTICAL_ADDITIONS_CHANGE);
                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            }

                        });

                    } else {

                        $mdDialog.show({
                            controller: 'ReconProcessBankFileDialogController as vm',
                            templateUrl: 'views/dialogs/reconciliation/recon-process-bank-file-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            preserveScope: false,
                            locals: {
                                data: {}
                            }
                        }).then(function (res) {

                            if (res.status === 'agree') {

                                console.log('res.data', res.data);

                                scope.evDataService.setReconciliationFile(res.data.parsedFile);
                                scope.evDataService.setReconciliationData(res.data.results);
                                scope.evDataService.setReconciliationImportConfig(res.data.config);

                                additions.isOpen = true;
                                additions.type = 'reconciliation';

                                scope.evDataService.setVerticalSplitPanelStatus(true);
                                scope.evDataService.setVerticalAdditions(additions);

                                scope.evEventService.dispatchEvent(evEvents.VERTICAL_ADDITIONS_CHANGE);
                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            }

                        });

                    }

                };

                // show indicator if table layout changed
                scope.layoutChanged = false;

                var changesTrackingEvents = {
                    GROUPS_CHANGE: null,
                    COLUMNS_CHANGE: null,
                    COLUMN_SORT_CHANGE: null,
                    RESIZE_COLUMNS_END: null,
                    FILTERS_CHANGE: null,
                    ADDITIONS_CHANGE: null,
                    UPDATE_TABLE_VIEWPORT: null,
                    TOGGLE_FILTER_AREA: null,
                    REPORT_OPTIONS_CHANGE: null,
                    REPORT_TABLE_VIEW_CHANGED: null,
                    REPORT_EXPORT_OPTIONS_CHANGED: null,
                    DATA_LOAD_END: null,
                    ENTITY_VIEWER_PAGINATION_CHANGED: null,
                    VIEW_TYPE_CHANGED: null
                };

                var removeChangesTrackingEventListeners = function () {

                    var trackingEventsListenerNames = Object.keys(changesTrackingEvents);

                    for (var i = 0; i < trackingEventsListenerNames.length; i++) {
                        var telName = trackingEventsListenerNames[i];

                        if (changesTrackingEvents[telName]) { // execute only if event listener has been added

                            scope.evEventService.removeEventListener(evEvents[telName], changesTrackingEvents[telName]);

                        }
                    }
                };

                var didLayoutChanged = function () {

                    var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                    if (activeLayoutConfig && activeLayoutConfig.data) {

                        var isLayoutTheSame = function (data1, data2) {

                            if (typeof data1 === 'object' && typeof data2 === 'object') {

                                return objectComparisonHelper.areObjectsTheSame(data1, data2);

                            } else {

                                if (data1 !== data2) {
                                    return false;
                                }

                                return true;

                            }

                        };

                        var areReportOptionsTheSame = function () {

                            var originalReportOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportOptions);

                            var originReportLayoutOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportLayoutOptions);

                            if (originReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                                delete originalReportOptions.pl_first_date;
                                delete originalReportOptions.begin_date;
                            }

                            if (originReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                                delete originalReportOptions.report_date;
                                delete originalReportOptions.end_date;
                            }

                            delete originalReportOptions.task_id;
                            delete originalReportOptions.recieved_at;
                            delete originalReportOptions.task_status;


                            var currentReportOptions = metaHelper.recursiveDeepCopy(scope.evDataService.getReportOptions());

                            var currentReportLayoutOptions = metaHelper.recursiveDeepCopy(scope.evDataService.getReportLayoutOptions());

                            if (currentReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                                delete currentReportOptions.pl_first_date;
                                delete currentReportOptions.begin_date;
                            }

                            if (currentReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                                delete currentReportOptions.report_date;
                                delete currentReportOptions.end_date;
                            }

                            delete currentReportOptions.task_id;
                            delete currentReportOptions.recieved_at;
                            delete currentReportOptions.task_status;
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

                            if (isLayoutTheSame(originalReportOptions, currentReportOptions) &&
                                isLayoutTheSame(originReportLayoutOptions, currentReportLayoutOptions)) {

                                return true;

                            } else {
                                return false;
                            }

                        };

                        var groupsChangeEventIndex = scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                            var originalGroups = activeLayoutConfig.data.grouping;
                            var currentGroups = scope.evDataService.getGroups();

                            if (!isLayoutTheSame(currentGroups, originalGroups)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var columnsChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                            var originalColumns = activeLayoutConfig.data.columns;
                            var currentColumns = scope.evDataService.getColumns();

                            if (!isLayoutTheSame(currentColumns, originalColumns)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var columnsSortChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                            var originalColumns = activeLayoutConfig.data.columns;
                            var currentColumns = scope.evDataService.getColumns();

                            if (!isLayoutTheSame(currentColumns, originalColumns)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var rceEventIndex = scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

                            var originalColumns = activeLayoutConfig.data.columns;
                            var currentColumns = scope.evDataService.getColumns();

                            if (!isLayoutTheSame(currentColumns, originalColumns)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                                scope.$apply();
                            }

                        });

                        var filtersChangeEventIndex = scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                            var originalFilters = activeLayoutConfig.data.filters;
                            var currentFilters = scope.evDataService.getFilters();

                            if (!isLayoutTheSame(currentFilters, originalFilters)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var additionsChangeEventIndex = scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

                            var originAdditions = activeLayoutConfig.data.additions;
                            var currentAdditions = scope.evDataService.getAdditions();

                            if (!isLayoutTheSame(originAdditions, currentAdditions)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var utvEventIndex = scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                            var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
                            var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

                            if (!isLayoutTheSame(originInterfaceLayout, currentInterfaceLayout)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                            }

                        });

                        var tfaEventIndex = scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                            var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
                            var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

                            if (!isLayoutTheSame(originInterfaceLayout, currentInterfaceLayout)) {
                                scope.layoutChanged = true;
                                removeChangesTrackingEventListeners();
                                scope.$apply();
                            }

                        });

                        var evpcEventIndex = scope.evEventService.addEventListener(evEvents.ENTITY_VIEWER_PAGINATION_CHANGED, function () {
                            scope.layoutChanged = true;
                            removeChangesTrackingEventListeners();
                        });

                        if (scope.isReport) {

                            var roChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                                if (!areReportOptionsTheSame()) {
                                    scope.layoutChanged = true;
                                    removeChangesTrackingEventListeners();
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

                                }

                            });

                            var reoChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_EXPORT_OPTIONS_CHANGED, function () {

                                var originalReportExportOptions = activeLayoutConfig.data.export;
                                var currentReportExportOptions = scope.evDataService.getExportOptions();

                                if (!isLayoutTheSame(originalReportExportOptions, currentReportExportOptions)) {
                                    scope.layoutChanged = true;
                                    removeChangesTrackingEventListeners();
                                }

                            });

                            var viewTypeChangedEI = scope.evEventService.addEventListener(evEvents.VIEW_TYPE_CHANGED, function () {

                                var originalViewType = activeLayoutConfig.data.viewType;
                                var originalViewSettings = activeLayoutConfig.data.viewSettings;

                                var currentViewType = scope.evDataService.getViewType();
                                var currentViewSettings = null;

                                if (originalViewType === currentViewType) {

                                    if (currentViewType) {
                                        currentViewSettings = scope.evDataService.getViewSettings(currentViewType);
                                    }

                                    if (!isLayoutTheSame(originalViewSettings, currentViewSettings)) {
                                        scope.layoutChanged = true;
                                        removeChangesTrackingEventListeners();
                                    }

                                } else {
                                    scope.layoutChanged = true;
                                    removeChangesTrackingEventListeners();
                                }

                            });

                        } else {

                            var evSettingsIndex = scope.evEventService.addEventListener(evEvents.ENTITY_VIEWER_SETTINGS_CHANGED, function () {

                                var originalEvSettings = activeLayoutConfig.data.ev_options;
                                var evSettings = scope.evDataService.getEntityViewerOptions();

                                if (!isLayoutTheSame(originalEvSettings, evSettings)) {
                                    scope.layoutChanged = true;
                                    removeChangesTrackingEventListeners();
                                }

                            });

                        }

                        changesTrackingEvents.GROUPS_CHANGE = groupsChangeEventIndex;
                        changesTrackingEvents.COLUMNS_CHANGE = columnsChangeEventIndex;
                        changesTrackingEvents.COLUMN_SORT_CHANGE = columnsSortChangeEventIndex;
                        changesTrackingEvents.RESIZE_COLUMNS_END = rceEventIndex;
                        changesTrackingEvents.FILTERS_CHANGE = filtersChangeEventIndex;
                        changesTrackingEvents.ADDITIONS_CHANGE = additionsChangeEventIndex;
                        changesTrackingEvents.UPDATE_TABLE_VIEWPORT = utvEventIndex;
                        changesTrackingEvents.TOGGLE_FILTER_AREA = tfaEventIndex;
                        changesTrackingEvents.REPORT_OPTIONS_CHANGE = roChangeEventIndex;
                        changesTrackingEvents.REPORT_TABLE_VIEW_CHANGED = rtvChangedEventIndex;
                        // Report viewer specific tracking
                        changesTrackingEvents.REPORT_EXPORT_OPTIONS_CHANGED = reoChangeEventIndex;
                        changesTrackingEvents.DATA_LOAD_END = dleEventIndex;
                        changesTrackingEvents.ENTITY_VIEWER_PAGINATION_CHANGED = evpcEventIndex;
                        changesTrackingEvents.VIEW_TYPE_CHANGED = viewTypeChangedEI;
                        // Entity viewer specific tracking
                        changesTrackingEvents.ENTITY_VIEWER_SETTINGS_CHANGED = evSettingsIndex;
                    }

                };
                // < show indicator if table layout changed >

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

                            if (scope.isRootEntityViewer) {

                                if (res.data.layoutUserCode) {

                                    middlewareService.setNewEntityViewerLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar
                                    $state.transitionTo($state.current, {layoutUserCode: res.data.layoutUserCode});

                                } else {
                                    var errorText = 'Layout "' + res.data.layoutName + '" has no user code.';
                                    toastNotificationService.error(errorText);
                                }

                            } else {
                                middlewareService.setNewSplitPanelLayoutName(res.data.layoutName); // Give signal to update active layout name in the toolbar

                                scope.evDataService.setSplitPanelLayoutToOpen(res.data.layoutId);
                                scope.evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);
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
                        columnArea: true,
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

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    interfaceLayout.groupingArea.collapsed = false;
                    interfaceLayout.groupingArea.height = 98;
                    interfaceLayout.columnArea.collapsed = false;
                    interfaceLayout.columnArea.height = 70;

                    scope.evDataService.setInterfaceLayout(interfaceLayout);

                    middlewareService.setNewSplitPanelLayoutName(false);
                    clearAdditions();

                    if (scope.isReport) {

                        var rootGroupOptions = scope.evDataService.getRootGroupOptions();
                        rootGroupOptions.subtotal_type = false;
                        scope.evDataService.setRootGroupOptions(rootGroupOptions);

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
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                            middlewareService.setNewEntityViewerLayoutName(listLayout.name); // Give signal to update active layout name in the toolbar
                            scope.$apply(); // needed to update Report settings area in right sidebar and layout name
                            scope.isNewLayout = true;

                        };

                        reportOptions.cost_method = 1;
                        reportOptions.portfolio_mode = 1;
                        reportOptions.account_mode = 0;
                        reportOptions.strategy1_mode = 0;
                        reportOptions.strategy2_mode = 0;
                        reportOptions.strategy3_mode = 0;
                        reportOptions.accounts_cash = [];
                        // reportOptions.accounts_cash[0] = 1;
                        reportOptions.accounts_position = [];
                        // reportOptions.accounts_position[0] = 1;
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

                            ecosystemDefaultService.getList().then(function (data) {

                                var defaultValues = data.results[0];
                                reportOptions.pricing_policy = defaultValues.pricing_policy;
                                reportOptions.report_currency = defaultValues.currency;

                                finishCreatingNewReportLayout();

                            });

                        } else { // For transaction report

                            reportOptions.date_field = null;

                            reportOptions.begin_date = todaysDate;

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

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                        scope.isNewLayout = true;

                    }

                };

                scope.createNewLayout = function () {

                    /*var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();
                    var layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);*/

                    var activeLayoutConfig = scope.evDataService.getActiveLayoutConfiguration();

                    var spChangedLayout = false;
                    if (scope.isRootEntityViewer) {

                        var additions = scope.evDataService.getAdditions();
                        if (additions.isOpen) {
                            spChangedLayout = scope.spExchangeService.getSplitPanelChangedLayout();
                        }

                    }

                    var layoutIsUnchanged = true;
                    if (activeLayoutConfig && activeLayoutConfig.data) {
                        var layoutCurrentConfig = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                        layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport);
                    }

                    //if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, scope.isReport)) {
                    if (!layoutIsUnchanged || spChangedLayout) {

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

                                var layoutsSavePromises = [];

                                // if split panel layout changed, save it
                                if (spChangedLayout) {

                                    var saveSPLayoutChanges = new Promise(function (spLayoutSaveRes, spLayoutSaveRej) {

                                        if (spChangedLayout.hasOwnProperty('id')) {

                                        	uiService.updateListLayout(spChangedLayout.id, spChangedLayout).then(function () {
                                                spLayoutSaveRes(true);
                                            });

                                        } else {

                                        	uiService.createListLayout(scope.entityType, spChangedLayout).then(function () {
                                                spLayoutSaveRes(true);
                                            });

                                        }

                                    });

                                    layoutsSavePromises.push(saveSPLayoutChanges);

                                }
                                // < if split panel layout changed, save it >

                                /*if (layoutCurrentConfig.hasOwnProperty('id')) {

                                    uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                } else {

                                    uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                        createNewLayoutMethod();
                                    });

                                }*/
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
                                            uiService.getDefaultListLayout(scope.entityType).then(function (data) {

                                                layoutCurrentConfig.is_default = true;

                                                if (data.count > 0 && data.results) {
                                                    var activeLayout = data.results[0];
                                                    activeLayout.is_default = false;

                                                    uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                                        uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                                            saveLayoutRes(true);
                                                        });

                                                    });

                                                } else {
                                                    uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
                                                        saveLayoutRes(true);
                                                    });
                                                }

                                            }); */

											uiService.createListLayout(scope.entityType, layoutCurrentConfig).then(function () {
												saveLayoutRes(true);
											});

                                        }

                                        layoutsSavePromises.push(saveLayoutChanges);

                                    });
                                }

                                Promise.all(layoutsSavePromises).then(function () {
                                    createNewLayoutMethod();
                                });

                            } else if (res.status === 'do_not_save_layout') {
                                createNewLayoutMethod();
                            }

                        });

                    } else {
                        createNewLayoutMethod();
                    }
                };

                scope.saveLayoutList = function () {
					evRvLayoutsHelper.saveLayoutList(scope.evDataService, scope.isReport);
                };

                scope.saveAsLayoutList = function ($event) {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            options: {
                                complexSaveAsLayoutDialog: {
                                    entityType: scope.entityType
                                },
								layoutName: listLayout.name
                            }
                        },
                        clickOutsideToClose: false

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            var saveAsLayout = function () {

                                listLayout.name = res.data.name;
                                listLayout.user_code = res.data.user_code;

                                uiService.createListLayout(scope.entityType, listLayout).then(function (data) {

                                    listLayout.id = data.id;
                                    applyLayout(listLayout);

                                }).catch(function (error) {
                                    toastNotificationService.error("Error occurred");
                                });

                            };

                            if (listLayout.id) { // if layout based on another existing layout

                                if (scope.isRootEntityViewer) {

                                    /* uiService.getDefaultListLayout(scope.entityType).then(function (openedLayoutData) {

                                        var currentlyOpenLayout = openedLayoutData.results[0];
                                        currentlyOpenLayout.is_default = false;

                                        uiService.updateListLayout(currentlyOpenLayout.id, currentlyOpenLayout).then(function () {

                                            listLayout.is_default = true;
                                            delete listLayout.id;

                                            saveAsLayout();

                                        }).catch(function (error) {
                                            toastNotificationService.error("Error occurred");
                                        });

                                    }).catch(function (error) {
                                        toastNotificationService.error("Error occurred");
                                    }); */

									listLayout.is_default = true;

                                } else { // for split panel

									listLayout.is_default = false;
                                    /*delete listLayout.id;
                                    saveAsLayout();*/

                                }

								delete listLayout.id;
								saveAsLayout();

                            } else { // if layout was not based on another layout

                                if (scope.isRootEntityViewer) {
                                    listLayout.is_default = true;
                                }

                                saveAsLayout();
                            }
                        }

                        if (res.status === 'overwrite') {

                            var userCode = res.data.user_code;

                            listLayout.name = res.data.name;
                            listLayout.user_code = userCode;

                            scope.getLayoutByUserCode(userCode).then(function (changeableLayoutData) {

								var changeableLayout = changeableLayoutData.results[0];
								overwriteLayout(changeableLayout, listLayout).then(function (updatedLayoutData) {

									listLayout.is_default = true;
									listLayout.modified = updatedLayoutData.modified;
									applyLayout(listLayout);

								});

							});

                        }

                    });

                };

                scope.getLayoutByUserCode = function (userCode) {

                    var contentType = metaContentTypesService.findContentTypeByEntity(scope.entityType, 'ui');

                    /* return uiService.getListLayoutDefault({
                        pageSize: 1000,
                        filters: {
                            content_type: contentType,
                            user_code: userCode
                        }
                    }); */
                    return uiService.getListLayout(
                        null,
                        {
                            pageSize: 1000,
                            filters: {
                                content_type: contentType,
                                user_code: userCode
                            }
                        }
                    );

                };

                var overwriteLayout = function (changeableLayout, listLayout) {

                    var id = changeableLayout.id;

                    listLayout.id = id;
                    changeableLayout.data = listLayout.data;
                    changeableLayout.name = listLayout.name;

                    return uiService.updateListLayout(id, changeableLayout);

                };

                var applyLayout = function (layout) {

                    if (scope.isRootEntityViewer) {

                        middlewareService.setNewEntityViewerLayoutName(layout.name);

                    } else {
                        scope.evDataService.setSplitPanelDefaultLayout(layout.id);
                        scope.evEventService.dispatchEvent(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED);
                        middlewareService.setNewSplitPanelLayoutName(layout.name); // Give signal to update active split panel layout name in the toolbar
                    }

                    scope.evDataService.setListLayout(layout);
                    scope.evDataService.setActiveLayoutConfiguration({layoutConfig: layout});

                    scope.evEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

                    toastNotificationService.success("New layout with name '" + layout.name + "' created");

                    scope.isNewLayout = false;
                    scope.$apply();

                };

                scope.exportLayout = function ($event) {

                    var layout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    $mdDialog.show({
                        controller: 'LayoutExportDialogController as vm',
                        templateUrl: 'views/dialogs/layout-export-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: {layout: layout, isReport: scope.isReport}
                        }
                    })

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

                /*scope.exportAsXls = function () {
                    var blobPart = convertReportHelper.convertToExcel();
                    downloadFileHelper.downloadFile(blobPart, "text/plain", "report.xls");
                };*/

                scope.exportAsCSV = function () {

                    var flatList = scope.evDataService.getFlatList();
                    var columns = scope.evDataService.getColumns();
                    var groups = scope.evDataService.getGroups();

                    var blobPart = convertReportHelper.convertFlatListToCSV(flatList, columns, scope.isReport, groups.length);
                    downloadFileHelper.downloadFile(blobPart, "text/plain", "report.csv");
                };

                scope.exportAsExcel = function(){

                    var data = {
                        entityType: scope.entityType,
                        contentSettings: {
                            columns: scope.evDataService.getColumns(),
                            groups: scope.evDataService.getGroups()
                        },
                        content: scope.evDataService.getFlatList()
                    };

                    exportExcelService.generatePdf(data).then(function (blob) {

                        downloadFileHelper.downloadFile(blob, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "report.xlsx");

                        $mdDialog.hide();

                    })

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
                        templateUrl: 'views/dialogs/custom-field/custom-field-dialog-view.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            attributeDataService: scope.attributeDataService,
                            entityViewerEventService: scope.evEventService,
                            data: {
                                entityType: scope.entityType
                            }
                        }
                    })

                };

                scope.toggleMatrix = function ($event) {

                    var viewType = scope.evDataService.getViewType();
                    var newViewType;

                    if (viewType === 'matrix') {
                        newViewType = 'report_viewer'
                    } else {
                        newViewType = 'matrix'
                    }

                    if (newViewType === 'matrix') {

                        var settings = scope.evDataService.getViewSettings(newViewType);

                        $mdDialog.show({
                            controller: 'ReportViewerMatrixSettingsDialogController as vm',
                            templateUrl: 'views/dialogs/report-viewer-matrix-settings-dialog-view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            targetEvent: $event,
                            preserveScope: true,
                            multiple: true,
                            autoWrap: true,
                            skipHide: true,
                            locals: {
                                data: {
                                    attributeDataService: scope.attributeDataService,
                                    evDataService: scope.evDataService,
                                    evEventService: scope.evEventService,
                                    settings: settings
                                }
                            }
                        }).then(function (res) {

                            if (res.status === 'agree') {

                                settings = res.data.settings;

                                scope.evDataService.setViewType(newViewType);
                                scope.evDataService.setViewSettings(newViewType, settings);

                                scope.evEventService.dispatchEvent(evEvents.VIEW_TYPE_CHANGED)

                            }

                        })

                    } else {

                        scope.evDataService.setViewType(newViewType);
                        scope.evDataService.setViewSettings(newViewType, {});

                        scope.evEventService.dispatchEvent(evEvents.VIEW_TYPE_CHANGED)
                    }

                };

                scope.matchReconciliationLines = function ($event) {

                    $mdDialog.show({
                        controller: 'ReconMatchDialogController as vm',
                        templateUrl: 'views/dialogs/reconciliation/recon-match-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true,
                        multiple: true,
                        locals: {
                            data: {
                                parentEntityViewerDataService: scope.evDataService.getParentDataService(),
                                entityViewerDataService: scope.evDataService
                            }
                        }
                    })


                };

                scope.openMatchEditor = function () {
                    scope.evEventService.dispatchEvent(evEvents.RECON_TOGGLE_MATCH_EDITOR);
                };

                scope.reconBookSelected = function () {
                    scope.evEventService.dispatchEvent(evEvents.RECON_BOOK_SELECTED)
                };

                scope.saveReconLayout = function ($event) {

                    scope.savingReconLayout = true;

                    var config = scope.evDataService.getReconciliationImportConfig();

                    var scheme = config.scheme_object;

                    scheme.recon_layout = {
                        data: {
                            grouping: scope.evDataService.getGroups(),
                            columns: scope.evDataService.getColumns(),
                            filters: scope.evDataService.getFilters()
                        }
                    };

                    console.log('scheme', scheme);

                    transactionImportSchemeService.update(scheme.id, scheme).then(function (data) {

                        scope.savingReconLayout = false;
                        scope.$apply();

                        toastNotificationService.success('Layout was successfully saved');

                    })


                };

                /*scope.editDashboardComponent = function () {

                };*/

                scope.openEvLayout = function () {
                    var currentState;
                    switch (scope.entityType) {
                        case 'balance-report':
                            currentState = 'app.reports.balance-report';
                            break;
                        case 'balance-report':
                            currentState = 'app.reports.pl-report';
                            break;
                        case 'balance-report':
                            currentState = 'app.reports.transaction-report';
                            break;
                    }

                    var listLayout = scope.evDataService.getListLayout();

                    var url = $state.href(currentState);
                    url += '?layout=' + listLayout.name;

                    window.open(url, '_bland');
                };

                scope.openDashboardComponentConstructor = function () {
                    scope.evEventService.dispatchEvent(evEvents.OPEN_DASHBOARD_COMPONENT_EDITOR);
                };

                scope.init = function () {

                    scope.getCurrentMember();

                    if (scope.isRootEntityViewer) {

                        scope.evEventService.addEventListener(evEvents.RECON_TOGGLE_MATCH_EDITOR, function () {

                            var additions = scope.evDataService.getAdditions();

                            if (additions.type === "reconciliation_match_editor") {

                                clearAdditions();
                                var interfaceLayout = scope.evDataService.getInterfaceLayout();
                                interfaceLayout.splitPanel.height = 0;

                                scope.evDataService.setInterfaceLayout(interfaceLayout);
                                middlewareService.setNewSplitPanelLayoutName(false);

                            } else {

                                additions.isOpen = true;
                                additions.type = "reconciliation_match_editor";

                                delete additions.layoutData;

                                scope.evDataService.setSplitPanelStatus(true);
                                scope.evDataService.setAdditions(additions);
                                scope.evEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);
                                scope.currentAdditions = scope.evDataService.getAdditions();

                            }

                        });

                    }

                    if (scope.viewContext !== 'reconciliation_viewer') {

                        checkLayoutExistence();

                        dleEventIndex = scope.evEventService.addEventListener(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED, function () {
                            removeChangesTrackingEventListeners();
                            changesTrackingEvents.DATA_LOAD_END = dleEventIndex;
                            didLayoutChanged();
                        });

                        scope.layout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                        scope.evEventService.addEventListener(evEvents.VERTICAL_ADDITIONS_CHANGE, function () {

                            scope.verticalAdditions = scope.evDataService.getVerticalAdditions();

                        })


                    }

                };

                scope.init()

            }
        }
    }

}());