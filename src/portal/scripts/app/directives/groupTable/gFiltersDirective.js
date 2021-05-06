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
                contentWrapElement: '=',
				workareaWrapElement: '=',
                hideFiltersBlock: '=',
            },
			templateUrl: 'views/directives/groupTable/g-filters-view.html',
            link: function (scope, elem, attrs) {

            	scope.entityType = scope.evDataService.getEntityType();
                scope.isReport = metaService.isReport(scope.entityType);
                scope.currentAdditions = scope.evDataService.getAdditions();
                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
                scope.viewContext = scope.evDataService.getViewContext();

                scope.isFiltersOpened = !scope.hideFiltersBlock;
				scope.filters = scope.evDataService.getFilters();
				scope.popupPosX = { value: null }
				scope.popupPosY = { value: null }
				scope.fpBackClasses = "z-index-48"
				scope.fpClasses = "z-index-49"

				scope.showUseFromAboveFilters = !scope.hideFiltersBlock;

				scope.readyStatus = {
					filters: false
				}

				const gFiltersElem = elem[0].querySelector('.gFilters');
				const gFiltersElemWidth = gFiltersElem.clientWidth;
				let filtersChipsContainer = elem[0].querySelector(".gFiltersContainerWidth");

				const gFiltersLeftPartWidth = elem[0].querySelector('.gFiltersLeftPart').clientWidth;
				const gFiltersRightPartWidth = elem[0].querySelector('.gFiltersRightPart').clientWidth;

				let useFromAboveFilters = [];

				let entityAttrs = [];
				let dynamicAttrs = [];
				let attrsWithoutFilters = ['notes'];

                // Victor 2021.03.29 #88 fix bug with deleted custom fields
                let customFields = scope.attributeDataService.getCustomFieldsByEntityType(scope.entityType);
                // <Victor 2021.03.29 #88 fix bug with deleted custom fields>

                scope.calculateReport = function () {
                    scope.evEventService.dispatchEvent(evEvents.REQUEST_REPORT);
                };

				const getAttributes = () => {

					let allAttrsList;

					if (scope.viewContext === 'reconciliation_viewer') {

						allAttrsList = scope.attributeDataService.getReconciliationAttributes();

					}

					else {

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


				// <editor-fold desc="Chips filters">
				scope.toggleUseFromAboveFilters = function () {

                	scope.showUseFromAboveFilters = !scope.showUseFromAboveFilters
					formatFiltersForChips();

                	setTimeout(() => {

                		const filterAreaHeightChanged = updateFilterAreaHeight();

						if (filterAreaHeightChanged) {
							scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
						}

					}, 0);


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

							if (!res.data.options) {
								res.data.options = {};
							}

							if (!res.data.options.filter_type) {
								res.data.options.filter_type = "contains";
							}

							if (!res.data.options.filter_values) {
								res.data.options.filter_values = [];
							}

							if (!res.data.options.hasOwnProperty('exclude_empty_cells')) {
								res.data.options.exclude_empty_cells = false;
							}

							scope.filters.push(res.data);
							scope.evDataService.setFilters(scope.filters);
							scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

						}

					});

				};

				const getUseFromAboveFilters = function () {

					useFromAboveFilters = scope.filters.filter((filter, index) => {

						if (filter.options.use_from_above && Object.keys(filter.options.use_from_above).length) {

							filter.filtersListIndex = index;
							return true;

						}

						return false;

					});

				};

				let calculateFilterChipsContainerWidth = function () {

					// let filtersChipsContainerWidth = 800;

					// using workareaWrapElement because .g-filters not always assume full width in time
					// TODO use only scope.contentWrapElement.clientWidth after removing gSidebarFilter
					let filterAreaWidth;
					if (scope.workareaWrapElement) {
						filterAreaWidth = scope.workareaWrapElement.clientWidth;
					}

					else if (scope.contentWrapElement) {
						filterAreaWidth = scope.contentWrapElement.clientWidth;
					}

					else if (scope.viewContext === 'dashboard') { // For dashboard components without wrapElems e.g. matrix
						filterAreaWidth = gFiltersElemWidth;
					}
					// < TODO use only scope.contentWrapElement.clientWidth after removing gSidebarFilter >

					const availableSpace = filterAreaWidth - gFiltersLeftPartWidth - gFiltersRightPartWidth;
					/* if (availableSpace < 800) {

						filtersChipsContainerWidth = Math.max(availableSpace, 500);

					} */

					filtersChipsContainer.style.width = availableSpace + 'px';

				};

                const formatFiltersForChips = function () {

					scope.filtersChips = [];
                    const errors = [];

					scope.filters.forEach(filter => {

						if (filter.type !== "filter_link") { // don't show filter from dashboard component

							const filterOpts = filter.options || {};
							let filterVal = filterOpts.filter_values || "";

							if (filterOpts.filter_type === 'from_to') {

								filterVal = `From ${filterOpts.filter_values.min_value} to ${filterOpts.filter_values.max_value}`

							} else if (filterOpts.filter_type === 'out_of_range' ) {

								filterVal = `Out of range from ${filterOpts.filter_values.min_value} to ${filterOpts.filter_values.max_value}`

							}

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

								filterData.text = chipText;

                                // Victor 2021.03.29 #88 fix bug with deleted custom fields
								if (filter.key.startsWith('custom_fields')) {
								    const customField = customFields.find( field => filter.key === `custom_fields.${field.user_code}`)
                                    if (!customField) {

                                        filter.options.enabled = false;
                                        const description = `The ${filter.groups ? 'group' : 'column'} does not exist in the Configuration`

                                        filterData.error_data = {
											code: 10,
                                            description: description
                                        }

                                        const error = {
                                            key: filter.key,
                                            description: description
                                        }

                                        errors.push(error)

                                    }

                                }
                                // <Victor 2021.03.29 #88 fix bug with deleted custom fields>

								scope.filtersChips.push(filterData);

							}

						}

					});

                    // Victor 2021.03.29 #88 fix bug with deleted custom fields
					const missingCustomFields = [];
					errors.forEach(error => {
					    if (!missingCustomFields.find(field => field.key === error.key)) {

					        missingCustomFields.push(error);

                        }
                    });

					scope.evDataService.setMissingCustomFields({forFilters: missingCustomFields});
                    // <Victor 2021.03.29 #88 fix bug with deleted custom fields>

                    updateFilterAreaHeight()

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
					const gFiltersHeight = gFiltersElem.clientHeight;
					const originalHeight = interfaceLayout.filterArea.height;

					interfaceLayout.filterArea.height = gFiltersHeight

					scope.evDataService.setInterfaceLayout(interfaceLayout);

					return originalHeight !== gFiltersHeight;

				};

                scope.onChipsFirstRender = function () {

					updateFilterAreaHeight();
                	scope.evEventService.dispatchEvent(evEvents.FILTERS_RENDERED);

				};
				// </editor-fold>

                const initEventListeners = function () {

                    // Victor 2021.03.29 #88 fix bug with deleted custom fields
                    scope.evEventService.addEventListener(evEvents.DYNAMIC_ATTRIBUTES_CHANGE, function () {
                        customFields = scope.attributeDataService.getCustomFieldsByEntityType(scope.entityType);
                        formatFiltersForChips();
                    })
                    // <Victor 2021.03.29 #88 fix bug with deleted custom fields>

                	scope.evEventService.addEventListener(evEvents.TABLE_SIZES_CALCULATED, calculateFilterChipsContainerWidth);

					scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

						scope.filters = scope.evDataService.getFilters();

						getUseFromAboveFilters();

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
							const gFiltersHeight = gFiltersElem.clientHeight;

							interfaceLayout.filterArea.height = gFiltersHeight;
							scope.evDataService.setInterfaceLayout(interfaceLayout);

							scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

						}, 500); // Transition time for .g-filters

					});

					scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

						if (useFromAboveFilters.length) {

							let filterChangedFromAbove = false;

							useFromAboveFilters.forEach((useFromAboveFilter) => {

								let filter = scope.filters[useFromAboveFilter.filtersListIndex];
								let key = filter.options.use_from_above; // for old layouts

								if (typeof filter.options.use_from_above === 'object') {
									key = filter.options.use_from_above.key;
								}

								var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

								if (activeObjectFromAbove && typeof activeObjectFromAbove === 'object') {

									var value = activeObjectFromAbove[key];
									filter.options.filter_values = [value]; // example value 'Bank 1 Notes 4% USD'

									filterChangedFromAbove = true;

								}

							});

							if (filterChangedFromAbove) {

								scope.evDataService.setFilters(scope.filters);

								formatFiltersForChips();
								scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

							}

						}

					});

					scope.evEventService.addEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, function () {

						/* var hasUseFromAboveFilter = false;

						scope.filters.forEach(function (filter) {

							if (filter.options.use_from_above && Object.keys(filter.options.use_from_above).length > 0) {

								if (filter.options.filter_values.length) {
									hasUseFromAboveFilter = true;
									filter.options.filter_values = [];
								}

							}

						}); */

						if (useFromAboveFilters.length) {

							useFromAboveFilters.forEach(ufaFilter => {

								scope.filters[ufaFilter.filtersListIndex].options.filter_values = [];

							});

							scope.evDataService.setFilters(scope.filters);

							scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

							scope.evDataService.resetTableContent();

							scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

						}

					});

				};

				let init = function () {

					scope.popupEventService = new EventService();
					scope.chipsListEventService = new EventService();

					scope.popupData = {
						evDataService: scope.evDataService,
						evEventService: scope.evEventService,
						attributeDataService: scope.attributeDataService
					}

					formatFiltersForChips();

					scope.readyStatus.filters = true;


                    // TDDO Refactor this
                    // 1 add on "resize" event listener for filter area height change
                    // 2 calculate before render e.g width 1000px -> we got 2 rows - height 140px
                    //                              width 500px -> we got 3 row - heiht 210px
					setTimeout(function () {
                        updateFilterAreaHeight(); // important here
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
                    }, 1000);

					initEventListeners();

				};

				init();

            }

        }
    }
}());