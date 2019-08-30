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

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                contentWrapElement: '='
            },
            template: '<div>' +
                '<div class="ev-progressbar-holder" layout="row" layout-sm="column">\n' +
                '            <md-progress-linear class="ev-progressbar" md-mode="indeterminate"></md-progress-linear>\n' +
                '        </div>' +
                '<div class="ev-viewport">' +
                '<div class="ev-content"></div>' +
                '</div>' +
                '</div>',
            link: function (scope, elem) {

                var contentElem = elem[0].querySelector('.ev-content');
                var viewportElem = elem[0].querySelector('.ev-viewport');
                var progressBar = elem[0].querySelector('.ev-progressbar');
                var contentWrapElem = scope.contentWrapElement;

                var toggleBookmarksBtn = document.querySelector('.toggle-bookmarks-panel-btn');
                console.log("bookmarks toggleBookmarksBtn", toggleBookmarksBtn);
                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem,
                    contentWrapElem: contentWrapElem
                };

                var projection;
                var entityType = scope.evDataService.getEntityType();

                var isReport = metaService.isReport(entityType);
                var isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                function renderReportViewer() {

                    console.log('renderReportViewer');

                    rvDataHelper.syncLevelFold(scope.evDataService);

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.filter(function (item) {
                        return item.___type !== 'group';
                    });

                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;
                        return item
                    });

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    scope.evDataService.setProjection(projection);

                    // console.log('projection', projection);

                    rvDomManager.calculateScroll(elements, scope.evDataService);

                    rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

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
                                };

                            } else if (Array.isArray(filterValues)) {

                                if (filterValues[0] || filterValues[0] === 0) {
                                    return true;
                                };

                            };
                        };

                    };

                    return false;
                };

                function renderEntityViewer() {

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;
                        return item
                    });

                    scope.evDataService.setUnfilteredFlatList(flatList);

                    var groups = scope.evDataService.getGroups();
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

                        };
                    };

                    if (frontEndFilters.length > 0) {
                        var groups = scope.evDataService.getGroups();
                        flatList = evFilterService.filterTableRows(flatList, frontEndFilters, groups);
                    };


                    scope.evDataService.setFlatList(flatList);

                    evDomManager.calculateVirtualStep(elements, scope.evDataService);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    scope.evDataService.setProjection(projection);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                }

                function updateTableContent() {
                    if (isReport) {
                        renderReportViewer();
                        cellContentOverflow();
                    } else {
                        renderEntityViewer();
                    }
                }

                function cellContentOverflow() {

                    var rows = contentElem.querySelectorAll('.g-row');
                    rows = Array.from(rows);

                    var subtotalRows = rows.filter(function (row) {
                        return row.dataset.type === 'subtotal';
                    });

                    var r;
                    for (r = 0; r < subtotalRows.length; r++) {

                        var cellWraps = subtotalRows[r].querySelectorAll('.g-cell-wrap');
                        var cells = subtotalRows[r].querySelectorAll('.g-cell');

                        var w;
                        for (w = 0; w < cellWraps.length; w++) {

                            var cellWrap = cellWraps[w];
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
                                    var cellStretchWidth = cellWrap.clientWidth;
                                    var nextCellIndex = w;
                                    var overflowedCells = [];

                                    // Looping through next cell in the row, until encounter not empty cell or overflowing cell have enough width
                                    while (cellContentHolder.offsetWidth > cellSpaceForText && nextCellIndex + 1 < cellWraps.length) {

                                        var nextCellIndex = nextCellIndex + 1;

                                        var nextCellWrap = cellWraps[nextCellIndex];
                                        var nextCellContentWrap = nextCellWrap.querySelector('.g-cell-content-wrap');
                                        var nexCellContentHolder = nextCellContentWrap.querySelector('.g-cell-content');

                                        if (nexCellContentHolder || nextCellContentWrap.contentText) {
                                            break;
                                        }

                                        overflowedCells.push(nextCellWrap);
                                        cellSpaceForText = cellSpaceForText + nextCellWrap.clientWidth;
                                        cellStretchWidth = cellStretchWidth + nextCellWrap.clientWidth;

                                    }

                                    if (cellStretchWidth !== cellWrap.clientWidth) { // check if there is available cells to be overflowed

                                        overflowedCells.pop(); // leaving right border of last overflowed cell
                                        overflowedCells.map(function (overflowedCell) {
                                            overflowedCell.classList.add('g-overflowed-cell');
                                        });

                                        cellWrap.classList.add('g-overflowing-cell');
                                        cell.style.width = cellStretchWidth + 'px';

                                    }
                                }

                            }

                        }
                    }

                };

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

                scope.evEventService.addEventListener(evEvents.UPDATE_PROJECTION, function () {

                    var flatList = scope.evDataService.getFlatList();

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    if (isReport) {

                        rvDomManager.calculateScroll(elements, scope.evDataService);
                        rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);

                        clearOverflowingCells();
                        cellContentOverflow();

                    } else {
                        evDomManager.calculateScroll(elements, scope.evDataService);
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

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    if (isReport) {
                        rvDomManager.calculateContentWrapHeight(elements.contentWrapElem, scope.evDataService);
                    } else {
                        evDomManager.calculateContentWrapHeight(elements.contentWrapElem, scope.evDataService);
                    }

                    updateTableContent();

                });

                scope.evEventService.addEventListener(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE, function () {

                    if (isReport) {
                        rvDomManager.calculateContentWrapHeight(elements.contentWrapElem, scope.evDataService);
                    } else {
                        evDomManager.calculateContentWrapHeight(elements.contentWrapElem, scope.evDataService);
                    }

                });

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                    if (isReport) {
                        rvDomManager.calculateScroll(elements, scope.evDataService);
                    } else {
                        evDomManager.calculateScroll(elements, scope.evDataService);
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

                var init = function () {

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

                        /*scope.evEventService.addEventListener(evEvents.START_CELLS_OVERFLOW, function () {
                            cellContentOverflow();
                        });*/

                    } else {

                        evDomManager.calculateScroll(elements, scope.evDataService);

                        evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                        evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                        evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);

                    }

                    toggleBookmarksBtn.addEventListener('click', function () {
                        console.log("bookmarks bookmark panel toggled!");
                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        var headerToolbar = document.querySelector('md-toolbar.header');

                        interfaceLayout.headerToolbar.height = headerToolbar.clientHeight;

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        var splitPanelIsActive = scope.evDataService.isSplitPanelActive();

                        if (isRootEntityViewer && splitPanelIsActive) {

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE);

                        }

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });
                };

                init();

                // $(window).on('resize', function () { // TODO what?
                //
                //     if (isReport) {
                //         rvDomManager.calculateScroll(elements, scope.evDataService);
                //     } else {
                //         evDomManager.calculateScroll(elements, scope.evDataService);
                //         evDomManager.calculateVirtualStep(elements, scope.evDataService);
                //     }
                //
                // });

                window.addEventListener('resize', function () {

                    if (projection) {

                        if (isReport) {
                            rvDomManager.calculateScroll(elements, scope.evDataService);
                            rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        } else {
                            evDomManager.calculateScroll(elements, scope.evDataService);
                            evDomManager.calculateVirtualStep(elements, scope.evDataService);
                            evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        }

                    }

                })

            }
        }
    }

}());