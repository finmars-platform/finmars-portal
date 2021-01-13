/**
 * Created by vzubr on 04.12.2020.
 * */
(function (){

    'use strict';

    const metaService = require('../../services/metaService');
	const evEvents = require('../../services/entityViewerEvents');
	const popupEvents = require('../../services/events/popupEvents');
	const directivesEvents = require('../../services/events/directivesEvents');
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
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.isFiltersOpened = true
				scope.filters = scope.evDataService.getFilters();
				scope.popupPosX = { value: null }
				scope.popupPosY = { value: null }
				scope.fpBackClasses = "z-index-48"
				scope.fpClasses = "z-index-49"

				scope.showUseFromAboveFilters = true;

				scope.readyStatus = {
					filters: false
				}

				let gFilterElem;

				let entityAttrs = [];
				let dynamicAttrs = [];
				let attrsWithoutFilters = ['notes'];

                scope.calculateReport = function () {
                    scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                };

				let getAttributes = () => {

					let allAttrsList;

					if (scope.viewContext === 'reconciliation_viewer') {

						allAttrsList = scope.attributeDataService.getReconciliationAttributes();

					} else {

						switch (scope.entityType) {
							case 'balance-report':
								allAttrsList = scope.attributeDataService.getBalanceReportAttributes();
								break;

							case 'pl-report':
								allAttrsList = scope.attributeDataService.getPlReportAttributes();
								break;

							case 'transaction-report':
								allAttrsList = scope.attributeDataService.getTransactionReportAttributes();
								break;

							default:
								entityAttrs = [];
								dynamicAttrs = [];
								allAttrsList = [];

								entityAttrs = scope.attributeDataService.getEntityAttributesByEntityType(scope.entityType);

								entityAttrs.forEach(function (item) {
									if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
										item.name = 'Group';
									}
									item.entity = scope.entityType;
								});

								let instrumentUserFields = scope.attributeDataService.getInstrumentUserFields();
								let transactionUserFields = scope.attributeDataService.getTransactionUserFields();

								instrumentUserFields.forEach(function (field) {

									entityAttrs.forEach(function (entityAttr) {

										if (entityAttr.key === field.key) {
											entityAttr.name = field.name;
										}

									})

								});

								transactionUserFields.forEach(function (field) {

									entityAttrs.forEach(function (entityAttr) {

										if (entityAttr.key === field.key) {
											entityAttr.name = field.name;
										}

									})

								});

								dynamicAttrs = scope.attributeDataService.getDynamicAttributesByEntityType(scope.entityType);


								dynamicAttrs = dynamicAttrs.map(function (attribute) {

									let result = {};

									result.attribute_type = Object.assign({}, attribute);
									result.value_type = attribute.value_type;
									result.content_type = scope.contentType;
									result.key = 'attributes.' + attribute.user_code;
									result.name = attribute.name;

									return result

								});

								allAttrsList = allAttrsList.concat(entityAttrs);
								allAttrsList = allAttrsList.concat(dynamicAttrs);

								break;
						}

					}

					return allAttrsList;

				};

                function clearAdditions() {

					let additions = scope.evDataService.getAdditions();

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

                scope.toggleUseFromAboveFilters = function () {

                	scope.showUseFromAboveFilters = !scope.showUseFromAboveFilters
					formatFiltersForChips();

				};

				scope.removeFilter = function (filtersToRemove) {

					scope.filters = scope.filters.filter(filter => {

						return filtersToRemove.find(item => item.id !== filter.key);

					});

					scope.evDataService.setFilters(scope.filters);
					scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
					scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

				};

				scope.addFilter = function (event) {

					const allAttrsList = getAttributes();

					let availableAttrs;

					availableAttrs = allAttrsList.filter(attr => {

						for (let i = 0; i < scope.filters.length; i++) {
							if (scope.filters[i].key === attr.key) {
								return false;
							}
						}

						if (attrsWithoutFilters.indexOf(attr.key) !== -1) {
							return false;
						}

						return true;

					});

					$mdDialog.show({
						controller: "TableAttributeSelectorDialogController as vm",
						templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
						targetEvent: event,
						multiple: true,
						locals: {
							data: {
								availableAttrs: availableAttrs,
								title: 'Choose filter to add'
							}
						}

					}).then(function (res) {

						if (res && res.status === "agree") {

							res.data.groups = true;

							scope.filters.push(res.data);
							scope.evDataService.setFilters(scope.filters);
							scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

						}

					});

				};

                let formatFiltersForChips = function () {

					scope.filtersChips = [];

					scope.filters.forEach(filter => {

						const filterOpts = filter.options || {};
						const filterVal = filterOpts.filter_values || "";

						// hide use from above filters if needed
						if (
							scope.showUseFromAboveFilters ||
							(!filterOpts.use_from_above || !Object.keys(filterOpts.use_from_above).length)
						) {

							let filterData = {
								id: filter.key
							};

							const filterName = filter.layout_name ? filter.layout_name : filter.name;

							let chipText = '<span class="g-filter-chips-text">' +
								'<span class="g-filter-chip-name">' + filterName + ':</span>' +
								'<span class="g-filter-chip-value text-bold"> ' + filterVal + '</span>' +
								'</span>'

							if (filterOpts.use_from_above &&
								Object.keys(filterOpts.use_from_above).length) {

								filterData.classes = "use-from-above-filter-chip"
								filterData.tooltipContent = chipText

								chipText = '<span class="material-icons">link</span>' + chipText;

							}

							filterData.text = chipText

							scope.filtersChips.push(filterData);

						}

					});

				};

                scope.onFilterChipClick = function (chipsData, event) {

					scope.popupData.filterKey = chipsData.data.id

					scope.popupPosX.value = event.clientX
					scope.popupPosY.value = event.clientY

					scope.popupEventService.dispatchEvent(popupEvents.OPEN_POPUP, {doNotUpdateScope: true});

				};

                scope.filterSettingsChange = function () {

					scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

					scope.evDataService.resetTableContent();

					scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

				};

                let updateFilterAreaHeight = () => {

                	let interfaceLayout = scope.evDataService.getInterfaceLayout();
					const gFiltersHeight = gFilterElem.clientHeight;
					const originalHeight = interfaceLayout.filterArea.height;

					interfaceLayout.filterArea.height = gFiltersHeight

					scope.evDataService.setInterfaceLayout(interfaceLayout);

					return originalHeight !== gFiltersHeight;

				};

                scope.onChipsFirstRender = function () {

					updateFilterAreaHeight();
                	scope.evEventService.dispatchEvent(evEvents.FILTERS_RENDERED);

				};

				let init = function () {

					gFilterElem = elem[0].querySelector('.g-filters');

					scope.popupEventService = new EventService();
					scope.chipsListEventService = new EventService();

					scope.popupData = {
						evDataService: scope.evDataService,
						evEventService: scope.evEventService,
						attributeDataService: scope.attributeDataService
					}

					scope.evDataService.setFilters(scope.filters);
					scope.evDataService.setFilters(scope.filters);

					formatFiltersForChips();

					scope.readyStatus.filters = true;

					scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

						scope.filters = scope.evDataService.getFilters();

						formatFiltersForChips();

						setTimeout(function () { // wait until DOM elems reflow after ng-repeat

							const filterAreaHeightChanged = updateFilterAreaHeight();

							if (filterAreaHeightChanged) {
								scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
							}

						}, 0);


					});

					scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_BLOCK, function () {

					    scope.isFiltersOpened = !scope.isFiltersOpened;

                        setTimeout(() => {
                            const interfaceLayout = scope.evDataService.getInterfaceLayout();
                            const gFiltersHeight = gFilterElem.clientHeight;
                            interfaceLayout.filterArea.height = gFiltersHeight;
                            scope.evDataService.setInterfaceLayout(interfaceLayout);

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                        }, 500); // Transition time for .g-filters

                    })

				};

				init();

            }

        }
    }
}());