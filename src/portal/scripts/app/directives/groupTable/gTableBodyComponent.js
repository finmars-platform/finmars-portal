/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evRenderer = require('../../services/ev-renderer/ev.renderer');
    var rvRenderer = require('../../services/rv-renderer/rv.renderer');
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');
    var rvDomManager = require('../../services/rv-dom-manager/rv-dom.manager');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var rvDataHelper = require('../../helpers/rv-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');

    var evFilterService = require('../../services/ev-data-provider/filter.service');

    var metaService = require('../../services/metaService');
    var EvScrollManager = require('../../services/ev-dom-manager/ev-scroll.manager');

    module.exports = function (evRvDomManagerService) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                rootWrapElement: '=',
                contentWrapElement: '=',
                workareaWrapElement: '='
            },
/*            template: '<div>' +
                '<div class="ev-progressbar-holder" layout="row" layout-sm="column">\n' +
                '            <progress-linear class="ev-progressbar"></progress-linear>\n' +
                '        </div>' +
                '<div class="ev-viewport">' +
                '<div class="ev-content"></div>' +
                '</div>' +
                '</div>',*/
            templateUrl: 'views/directives/groupTable/g-table-body-view.html',
            link: function (scope, elem) {

                var contentElem = elem[0].querySelector('.ev-content');
                var viewportElem = elem[0].querySelector('.ev-viewport');
                var progressBar = elem[0].querySelector('.ev-progressbar');

                var toggleBookmarksBtn = document.querySelector('.toggle-bookmarks-panel-btn');

                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem,
                    workareaWrapElem: scope.workareaWrapElement,
                    contentWrapElem: scope.contentWrapElement,
                    rootWrapElem: scope.rootWrapElement
                };

                var projection;
                var entityType = scope.evDataService.getEntityType();
                var viewContext = scope.evDataService.getViewContext();

                var isReport = metaService.isReport(entityType);
                var isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                var activeLayoutConfigIsSet = false;

                function renderReportViewer() {

                    console.log('renderReportViewer');

                    rvDataHelper.syncLevelFold(scope.evDataService);

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.filter(function (item) {
                        return item.___type !== 'group';
                    });

                    var index = 0;
                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;

                        if (item.___type === 'object' ||
                            item.___type === 'blankline') {
                            item.___flat_list_offset_top_index = index;
                            index = index + 1;
                        }

                        if (item.___type === 'subtotal') {

                            if (item.___subtotal_type !== 'proxyline') {
                                item.___flat_list_offset_top_index = index;
                                index = index + 1;
                            }
                        }

                        return item
                    });
                    console.log("flat list", flatList);



                    scope.evDataService.setFlatList(flatList);

                    projection = rvDataHelper.calculateProjection(flatList, scope.evDataService);

                    scope.evDataService.setProjection(projection);

                    // console.log('projection', projection);

                    rvDomManager.calculateScroll(elements, scope.evDataService);

                    window.requestAnimationFrame(function (){

                    	rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
						cellContentOverflow();

                    });

                }

                var isFilterValid = function (filterItem) {

                    if (filterItem.options && filterItem.options.enabled) { // if filter is enabled

                        var filterType = filterItem.options.filter_type;

                        if (filterType === 'empty' ||
                            filterItem.options.exclude_empty_cells) { // if filter works for empty cells

                            return true;

                        } else if (filterItem.options.filter_values) { // if filter values can be used for filtering (not empty)

                            var filterValues = filterItem.options.filter_values;

                            if (filterType === 'from_to') {

                                if ((filterValues.min_value || filterValues.min_value === 0) &&
                                    (filterValues.max_value || filterValues.max_value === 0)) {
                                    return true;
                                }

                            } else if (Array.isArray(filterValues)) {

                                if (filterValues[0] || filterValues[0] === 0) {
                                    return true;
                                }

                            }
                        }

                    }

                    return false;
                };

                function renderEntityViewer() {

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;
                        return item
                    });

                    console.log('renderEntityViewer.flatlist', flatList);

                    scope.evDataService.setUnfilteredFlatList(flatList);

                    var filters = scope.evDataService.getFilters();

                    var frontEndFilters = [];

                    for (var f = 0; f < filters.length; f++) {
                        var filter = filters[f];

                        if (filter.options &&
                            filter.options.is_frontend_filter &&
                            filter.options.enabled &&
                            isFilterValid(filter)) {

                            var filterOptions = {
                                key: filter.key,
                                filter_type: filter.options.filter_type,
                                exclude_empty_cells: filter.options.exclude_empty_cells,
                                value_type: filter.value_type,
                                value: filter.options.filter_values
                            };

                            frontEndFilters.push(filterOptions);

                        }
                    }

                    if (frontEndFilters.length > 0) {
                        var groups = scope.evDataService.getGroups();
                        flatList = evFilterService.filterTableRows(flatList, frontEndFilters, groups);
                    }

                    var index = 0;
                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;

                        if (item.___type === 'object' ||
                            item.___type === 'control' ||
                            item.___type === 'placeholder_group' ||
                            item.___type === 'placeholder_object' ||
                            item.___type === 'group') {
                            item.___flat_list_offset_top_index = index;
                            index = index + 1;
                        }

                        return item
                    });

                    scope.evDataService.setFlatList(flatList);

                    // evDomManager.calculateVirtualStep(elements, scope.evDataService, scope.scrollManager);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    console.log('renderEntityViewer.projection', projection);

                    scope.evDataService.setProjection(projection);

                    evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);

                    window.requestAnimationFrame(function (){
                        evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                    });


                    scope.evEventService.dispatchEvent(evEvents.FINISH_RENDER)

                }

				function cellContentOverflow() {

					var rows = contentElem.querySelectorAll('.g-row');
					rows = Array.from(rows);

					var subtotalRows = rows.filter(function (row) {
						return row.dataset.type === 'subtotal';
					});

					var r, w;
					for (r = 0; r < subtotalRows.length; r++) {

						var cellWraps = subtotalRows[r].querySelectorAll('.g-cell-wrap');
						var cells = subtotalRows[r].querySelectorAll('.g-cell');

						for (w = 0; w < cellWraps.length; w++) {

							var cellWrap = cellWraps[w], cellWrapWidth = cellWrap.clientWidth;
							var cell = cells[w];
							var cellContentWrap = cell.querySelector('.g-cell-content-wrap');
							var groupFoldingBtn = cellContentWrap.querySelector('.g-group-fold-button');

							var rowIsGrandTotal = false;
							var parentGroups = evRvCommonHelper.getParents(subtotalRows[r].dataset.parentGroupHashId, scope.evDataService);

							if (parentGroups[0].___level === 0 && w === 0) {
								rowIsGrandTotal = true;
							}

							if (cellContentWrap.textContent !== undefined && cellContentWrap.textContent !== '' && (groupFoldingBtn || rowIsGrandTotal)) {

								var cellContentHolder = cellContentWrap.querySelector('.g-cell-content');
								var cellSpaceForText = cellContentWrap.clientWidth;

								if (!rowIsGrandTotal) {
									cellSpaceForText = cellContentWrap.clientWidth - groupFoldingBtn.clientWidth;
								}

								if (cellContentHolder.offsetWidth > cellSpaceForText) {

									var cellStretchWidth = cellWrapWidth;
									var nextCellIndex = w;
									var overflowedCells = [];

									// Looping through next cell in the row, until encounter not empty cell or overflowing cell have enough width
									while (cellContentHolder.offsetWidth > cellSpaceForText && nextCellIndex + 1 < cellWraps.length) {

										var nextCellIndex = nextCellIndex + 1;

										var nextCellWrap = cellWraps[nextCellIndex], nextCellWrapWidth = nextCellWrap.clientWidth;
										var nextCellContentWrap = nextCellWrap.querySelector('.g-cell-content-wrap');
										var nexCellContentHolder = nextCellContentWrap.querySelector('.g-cell-content');

										if (nexCellContentHolder || nextCellContentWrap.contentText) {
											break;
										}

										overflowedCells.push(nextCellWrap);

										cellSpaceForText = cellSpaceForText + nextCellWrapWidth;
										cellStretchWidth = cellStretchWidth + nextCellWrapWidth;

									}

									if (cellStretchWidth > cellWrapWidth) { // check if there are available cells to be overflowed

										overflowedCells.pop(); // leaving right border of last overflowed cell

										overflowedCells.forEach(function (overflowedCell) {
											overflowedCell.classList.add('g-overflowed-cell');
										});

										cellWrap.classList.add('g-overflowing-cell');
										cell.style.width = cellStretchWidth + 'px';

									}
								}

							}

						}
					}

				}

                function updateTableContent() {
                    if (isReport) {
                        renderReportViewer();

                    } else {
                        renderEntityViewer();
                    }
                }

                function clearOverflowingCells() {
                    var overflowingCells = contentElem.querySelectorAll('.g-overflowing-cell');
                    var overflowedCells = contentElem.querySelectorAll('.g-overflowed-cell');

                    overflowingCells.forEach(function (overflowingCell) {
                        overflowingCell.classList.remove('g-overflowing-cell');
                        var cell = overflowingCell.querySelector('.g-cell');
                        cell.style.width = "";
                    });

                    overflowedCells.forEach(function (overflowedCell) {
                        overflowedCell.classList.remove('g-overflowed-cell');
                        var cell = overflowedCell.querySelector('.g-cell');
                        cell.style.width = "";
                    });
                }

                var calculateElemsWrapsSizes = function () {

                    evRvDomManagerService.calculateContentWrapHeight(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    // for vertical split panel contentWrapElem width calculated by gWidthAlignerComponent.js
                    // horizontal split panel contentWrapElem take all available width
                    if (isRootEntityViewer) {
                        evRvDomManagerService.calculateContentWrapWidth(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    }

                    evRvDomManagerService.calculateWorkareaWrapWidth(elements.contentWrapElem, elements.workareaWrapElem, scope.evDataService);

                }

                scope.evEventService.addEventListener(evEvents.UPDATE_PROJECTION, function () {

                    var flatList = scope.evDataService.getFlatList();

                    if (isReport) {

                        projection = rvDataHelper.calculateProjection(flatList, scope.evDataService);

                        rvDomManager.calculateScroll(elements, scope.evDataService);
                        rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                        clearOverflowingCells();
                        cellContentOverflow();

                    } else {

                        projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                        evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                        evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                    }


                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                    progressBar.style.display = 'block';
                    if (isReport) {
                        contentElem.style.opacity = '0.7';
                    }
                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    progressBar.style.display = 'none';
                    if (isReport) {
                        contentElem.style.opacity = '1';
                    }

                    updateTableContent();

                    if (!activeLayoutConfigIsSet && viewContext !== 'reconciliation_viewer') {
                        activeLayoutConfigIsSet = true;
                        scope.evDataService.setActiveLayoutConfiguration({isReport: isReport}); // saving layout for checking for changes
                        scope.evEventService.dispatchEvent(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED);
                    }

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

					var groups = scope.evDataService.getGroups();
					var cols = scope.evDataService.getColumns();

                    calculateElemsWrapsSizes();

                    updateTableContent();

                });

                /* scope.evEventService.addEventListener(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE, function () {

                    evRvDomManagerService.calculateContentWrapHeight(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    evRvDomManagerService.calculateContentWrapWidth(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);

                }); */

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                    calculateElemsWrapsSizes();

                    if (isReport) {
                        rvDomManager.calculateScroll(elements, scope.evDataService);
                    } else {
                        evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                    }

                });

                scope.evEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {
                    viewportElem.scrollTop = 0;
                });

                scope.evEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {
                    viewportElem.scrollTop = 0;
                });

                scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {
                    viewportElem.scrollTop = 0;
                });

                function onWindowResize() {

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    if (isReport) {

                        // rvDomManager.calculateScroll(elements, scope.evDataService);

                        if (projection) {
                            rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        }

                    } else {

                        // evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                        evDomManager.calculateVirtualStep(elements, scope.evDataService, scope.scrollManager);

                        if (projection) {
                            evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        }

                    }

                }

                var init = function () {

                    window.addEventListener('resize', onWindowResize);

                    if (!isReport) {
                        scope.scrollManager = new EvScrollManager();
                    }

					// TO DELETE remove after applying new interface for ev and rv
                    if (isReport) {

                    	var interfaceLayout = scope.evDataService.getInterfaceLayout();
						var components = scope.evDataService.getComponents();

						components.groupingArea = false
						components.topPart = true
						interfaceLayout.columnArea.height = 50
						// interfaceLayout.filterArea.height = 50

						scope.evDataService.setInterfaceLayout(interfaceLayout);
						scope.evDataService.setComponents(components);

					}
					// < TO DELETE remove after applying new interface for ev and rv >

                    setTimeout(function () { // prevents scroll from interfering with sizes of table parts calculation

                        calculateElemsWrapsSizes();

                        if (isReport) {

                            rvDomManager.calculateScroll(elements, scope.evDataService);

                            rvDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                            rvDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);


                            rvDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);

                            scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_START, function () {
                                clearOverflowingCells();
                            });

                            scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {
                                cellContentOverflow();
                            });


                            // If we already have data (e.g. viewType changed)
                            var flatList = rvDataHelper.getFlatStructure(scope.evDataService);

                            if (flatList.length > 1) {

                                progressBar.style.display = 'none';

                                if (isReport) {
                                    contentElem.style.opacity = '1';
                                }

                                updateTableContent();

                            }

                            //  If we already have data (e.g. viewType changed) end


                            /*scope.evEventService.addEventListener(evEvents.START_CELLS_OVERFLOW, function () {
                                cellContentOverflow();
                            });*/

                        } else {

                            evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);

                            evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                            evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                            evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService, scope.scrollManager);

                        }

                    }, 500);

                    toggleBookmarksBtn.addEventListener('click', function () {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        var headerToolbar = document.querySelector('md-toolbar.header');

                        interfaceLayout.headerToolbar.height = headerToolbar.clientHeight;

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        /* delete var splitPanelIsActive = scope.evDataService.isSplitPanelActive();

                         if (isRootEntityViewer && splitPanelIsActive) {
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);
                        } */

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });
                };

                init();

                // $(window).on('resize', function () { // TODO what?
                //
                //     if (isReport) {
                //         rvDomManager.calculateScroll(elements, scope.evDataService);
                //     } else {
                //         evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                //         evDomManager.calculateVirtualStep(elements, scope.evDataService);
                //     }
                //
                // });

                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', onWindowResize);
                })

            }
        }
    }

}());