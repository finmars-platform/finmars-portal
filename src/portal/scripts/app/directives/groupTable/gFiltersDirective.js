/**
 * Created by vzubr on 04.12.2020.
 * */
(function (){

    'use strict';

    const metaService = require('../../services/metaService');
	const evEvents = require('../../services/entityViewerEvents');
	const popupEvents = require('../../services/events/popupEvents');
	const evRvLayoutsHelper = require('../../helpers/evRvLayoutsHelper');

	const middlewareService = require('../../services/middlewareService');

	const uiService = require('../../services/uiService');
	const downloadFileHelper = require('../../helpers/downloadFileHelper');

	const convertReportHelper = require('../../helpers/converters/convertReportHelper');
	const reportCopyHelper = require('../../helpers/reportCopyHelper');

	const exportExcelService = require('../../services/exportExcelService');

	const EventService = require('../../services/eventService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                contentWrapElement: '='
            },
			templateUrl: 'views/directives/groupTable/g-filters-view.html',
            link: function (scope, elem, attrs) {

            	scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType);
                scope.currentAdditions = scope.evDataService.getAdditions();
                scope.isFiltersOpened = true;
				scope.filters = scope.evDataService.getFilters();
				scope.popupPosX = {value: null}
				scope.popupPosY = {value: null}

				scope.readyStatus = {
					filters: false
				}

                scope.calculateReport = function () {
                    scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);
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

                let getListLayoutByEntity = function (entityType) {
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

                        let interfaceLayout = scope.evDataService.getInterfaceLayout();
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

                scope.copyReport = function () {
                    reportCopyHelper.copy(scope.evDataService, scope.isReport);
                };

                scope.copySelectedToBuffer = function () {
                    reportCopyHelper.copy(scope.evDataService, scope.isReport, 'selected');
                };

                scope.openViewConstructor = function (ev) {

                    if (scope.isReport) {

                        let controllerName = '';
                        let templateUrl = '';

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

                let formatFiltersForChips = function () {

					scope.filtersChips = scope.filters.map(filter => {
						return {id: filter.key, text: filter.name};
					});

				};

                scope.onFilterChipClick = function (argumentObj) {

					scope.popupData.filterKey = argumentObj.chipsData.data.id

					scope.popupPosX.value = argumentObj.event.clientX
					scope.popupPosY.value = argumentObj.event.clientY

					scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});

				};

				let init = function () {

					scope.popupEventService = new EventService();

					scope.popupData = {
						evDataService: scope.evDataService,
						evEventService: scope.evEventService
					}

					formatFiltersForChips();

					scope.readyStatus.filters = true;

				};

				init();

            }

        }
    }
}());