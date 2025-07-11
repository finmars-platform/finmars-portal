/**
 * Created by szhitenev on 05.05.2016.
 */


(function () {

    'use strict';

    var RvDomManager = require("../../services/rv-dom-manager/rv-dom.manager").default;

    var evEvents = require('../../services/entityViewerEvents').default;
    var evRenderer = require('../../services/ev-renderer/ev.renderer').default;
    var rvRenderer = require('../../services/rv-renderer/rv.renderer').default;
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager').default;
    var evDataHelper = require('../../helpers/ev-data.helper').default;
    var rvDataHelper = require('../../helpers/rv-data.helper').default;
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper').default;

    var evFilterService = require('../../services/ev-data-provider/filter.service').default;

    var metaService = require('../../services/metaService').default;
    var EvScrollManager = require('../../services/ev-dom-manager/ev-scroll.manager').default;

    module.exports = function (toastNotificationService, usersService, globalDataService, transactionTypeService, priceHistoryService, uiService, evRvDomManagerService, rvDataProviderService) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                rootWrapElement: '=',
                contentWrapElement: '=',
                workareaWrapElement: '=',

                // optional. May not exist if columnArea is turned off.
                columnsScrollableAreaElement: '=',
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
                // var columnsScrollableAreaElem = scope.workareaWrapElement.querySelector('.g-scrollable-area');
                // var progressBar = elem[0].querySelector('.ev-progressbar');
                var toggleBookmarksBtn = document.querySelector('.toggle-bookmarks-panel-btn');

                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem,
                    workareaWrapElem: scope.workareaWrapElement,
                    contentWrapElem: scope.contentWrapElement,
                    rootWrapElem: scope.rootWrapElement // 'null' when rv / ev is inside split panel that is inside iframe
                };

                var projection;
                var entityType = scope.evDataService.getEntityType();
                var viewContext = scope.evDataService.getViewContext();

                scope.isReport = metaService.isReport(entityType);
                var isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                scope.error = false;

                var rvDomManager = new RvDomManager(toastNotificationService, transactionTypeService, priceHistoryService, uiService, evRvDomManagerService, rvDataProviderService);
                var activeLayoutConfigIsSet = false;

                if (!scope.isReport) {
                    elements.leftPanelElem = scope.workareaWrapElement.querySelector('.gEvLeftPanelHolder');
                }

                const setColorsForSubtotals = function (flatList, coloredSubtotals) {

                    return flatList.map(item => {
                        if (coloredSubtotals.hasOwnProperty(item.___id)) {
                            item.___backgrond_color = coloredSubtotals[item.___id];
                        }

                        return item;
                    })

                };

                function calculateElemsAndScrolls () {

                    /* calculateElemsWrapsSizes() must be called before
                     * calculateScroll() at least after webpage loaded the first time.
                     * */
                    evRvDomManagerService.calculateTableElementsSizes(
                        scope.rootWrapElement,
                        scope.contentWrapElement,
                        scope.workareaWrapElement,
                        viewportElem,
                        contentElem,
                        scope.columnsScrollableAreaElement,
                        scope.evDataService,
                    );

                    if (scope.isReport) {
                        rvDomManager.calculateScroll(elements, scope.evDataService);
                    } else {
                        evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                    }

                }

                function renderReportViewer() {
                    console.log('renderReportViewer');

                    var begin = Date.now();

                    scope.evDataService.setDataLoadStatus(true);


                    const coloredSubtotals = scope.evDataService.getMarkedSubtotals();

                    rvDataHelper.syncLevelFold(scope.evDataService);

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService, globalDataService);

                    flatList.shift(); // remove root group

                    flatList = flatList.filter(function (item) {
                        return item.___type !== 'group';
                    });

                    console.log('renderReportViewer.flatList', flatList);

                    var index = 0;
                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;

                        if (item.___type === 'object' ||
                            item.___type === 'control' ||
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

                    flatList = setColorsForSubtotals(flatList, coloredSubtotals);

                    scope.evDataService.setFlatList(flatList);

                    projection = rvDataHelper.calculateProjection(flatList, scope.evDataService);

                    scope.evDataService.setProjection(projection);

                    // console.log('projection', projection);

                    rvDomManager.calculateScroll(elements, scope.evDataService);

                    window.requestAnimationFrame(function () {

                        rvRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);
                        cellContentOverflow();

                        var end = Date.now();

                        var timeSpent = (end - begin) / 1000 // secs;

                        console.log("Report viewer render time", timeSpent);

                        scope.evDataService.setRenderTime(timeSpent)

                        scope.evEventService.dispatchEvent(evEvents.FINISH_RENDER)

                    });

                }

                function renderEntityViewer() {
                    var flatList = evDataHelper.getObjectsFromSelectedGroups(scope.evDataService, globalDataService);
                    console.log('renderEntityViewer.flatlist', flatList);

                    var filters = scope.evDataService.getFilters();
                    var regularFilters = evFilterService.convertIntoRegularFilters(filters.frontend);

                    if (regularFilters.length) {
                        var groups = scope.evDataService.getGroups();
                        flatList = evFilterService.filterTableRows(flatList, regularFilters, groups);
                    }

                    var selGroupsList = scope.evDataService.getSelectedGroups();
                    if (selGroupsList.length) {
                        var lastSelGroup = selGroupsList[selGroupsList.length - 1];
                        var controlObj = {
                            ___parentId: lastSelGroup.___id,
                            ___type: 'control',
                            ___level: lastSelGroup.___level + 1
                        };
                        controlObj.___id = evRvCommonHelper.getId(controlObj);
                        flatList.push(controlObj);
                    } else if (flatList.length) {
                        var controlObj = {
                            ___parentId: flatList[0].___parentId,
                            ___type: 'control',
                            ___level: 1
                        };
                        controlObj.___id = evRvCommonHelper.getId(controlObj);
                        flatList.push(controlObj);
                    }

                    var index = 0;
                    flatList = flatList.map(function (item) {
                        item.___flat_list_index = index;

                        if (['object', 'control', 'placeholder_group', 'placeholder_object', 'group'].includes(item.___type)) {
                            item.___flat_list_offset_top_index = index;
                            index++;
                        } else {
                            index++;
                        }

                        return item;
                    });

                    scope.evDataService.setFlatList(flatList);

                    var projection = evDataHelper.calculateProjection(flatList, scope.evDataService);
                    console.log('renderEntityViewer.projection', projection);
                    scope.evDataService.setProjection(projection);

                    evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);

                    window.requestAnimationFrame(function () {
                        evRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);
                    });

                    scope.evEventService.dispatchEvent(evEvents.FINISH_RENDER);
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

                                    // Looping through next cells in the row, until encounter not empty cell or overflowing cell have enough width
                                    while (cellContentHolder.offsetWidth > cellSpaceForText && nextCellIndex + 1 < cellWraps.length) {

                                        var nextCellIndex = nextCellIndex + 1;

                                        var nextCellWrap = cellWraps[nextCellIndex],
                                            nextCellWrapWidth = nextCellWrap.clientWidth;
                                        var nextCellContentWrap = nextCellWrap.querySelector('.g-cell-content-wrap');
                                        var nexCellContentHolder = nextCellContentWrap.querySelector('.g-cell-content');

                                        var nextCellNotEmpty = nexCellContentHolder || nextCellContentWrap.contentText;

                                        if (nextCellNotEmpty) {
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

                    scope.dataLoadStatus = true;

                    setTimeout(function () {
                        scope.$apply();
                    }, 0)

                    // scope.firstRender = true; // IF SOMETHING WENT WRONG AND SOMEHOW REPORT IS NOT RENDERER, WE HAVE 1 min timeoout to render

                    if (scope.isReport) {
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

                    /*evRvDomManagerService.calculateContentWrapHeight(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    // for vertical split panel contentWrapElem width calculated by gWidthAlignerComponent.js
                    // horizontal split panel contentWrapElem take all available width
                    if (isRootEntityViewer) {
                        evRvDomManagerService.calculateContentWrapWidth(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    }

                    evRvDomManagerService.calculateWorkareaWrapWidth(elements.contentWrapElem, elements.workareaWrapElem, scope.evDataService);*/

                }

                scope.evEventService.addEventListener(evEvents.UPDATE_PROJECTION, function () {

                    var flatList = scope.evDataService.getFlatList();

                    if (scope.isReport) {

                        projection = rvDataHelper.calculateProjection(flatList, scope.evDataService);

                        rvDomManager.calculateScroll(elements, scope.evDataService);
                        rvRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);

                        clearOverflowingCells();
                        cellContentOverflow();

                    } else {

                        projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                        evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                        evRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);
                    }


                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_START, function () {

                    console.log("gTableBodyComponent DATA_LOAD_START");

                    // progressBar.style.display = 'block';
                    /* if (scope.isReport) {
                        contentElem.style.opacity = '0.7';
                    } */
                    // contentElem.style.opacity = '0.7';

                    // scope.evDataService.setDataLoadStatus(false);

                    // scope.dataLoadStatus = false;

                    setTimeout(function () {
                        scope.$apply();

                    }, 0);

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    console.log("gTableBodyComponent DATA_LOAD_END");
                    // progressBar.style.display = 'none';

                    if ( errorWhileLoadingData() ) {

                        scope.evDataService.setDataLoadStatus(true);

                        scope.dataLoadStatus = true;

                        scope.error = true;

                        return setTimeout(function () {
                            scope.$apply();
                        }, 0)

                    }

                    contentElem.style.opacity = '1';

                    updateTableContent();

                    if (!activeLayoutConfigIsSet && viewContext !== 'reconciliation_viewer') {
                        activeLayoutConfigIsSet = true;
                        scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport}); // saving layout for checking for changes
                        scope.evEventService.dispatchEvent(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED);
                    }

                    scope.evDataService.setDataLoadStatus(true);

                    scope.dataLoadStatus = true;
                    scope.error = false;

                    setTimeout(function () {
                        scope.$apply();
                    }, 0)

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_ERROR, function () {

                    // TODO: integrate event DATA_LOAD_ERROR into ev-data-provider/ev-data-provider.service.js
                    if ( errorWhileLoadingData() ) {

                        scope.error = true;

                        setTimeout(function () {
                            scope.$apply();
                        }, 0)

                    }

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    evRvDomManagerService.calculateTableElementsSizes(
                        scope.rootWrapElement,
                        scope.contentWrapElement,
                        scope.workareaWrapElement,
                        viewportElem,
                        contentElem,
                        scope.columnsScrollableAreaElement,
                        scope.evDataService,
                    );

                    updateTableContent();

                    scope.evEventService.dispatchEvent(evEvents.TABLE_SIZES_CALCULATED);

                });

                /* scope.evEventService.addEventListener(evEvents.UPDATE_ENTITY_VIEWER_CONTENT_WRAP_SIZE, function () {

                    evRvDomManagerService.calculateContentWrapHeight(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);
                    evRvDomManagerService.calculateContentWrapWidth(elements.rootWrapElem, elements.contentWrapElem, scope.evDataService);

                }); */

                scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

                    calculateElemsAndScrolls();

                    scope.evEventService.dispatchEvent(evEvents.TABLE_SIZES_CALCULATED);

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

                    if (scope.isReport) {

                        // rvDomManager.calculateScroll(elements, scope.evDataService);

                        if (projection) {
                            rvRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);
                        }

                    } else {

                        // evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);
                        // evDomManager.calculateVirtualStep(elements, scope.evDataService, scope.scrollManager);

                        if (projection) {
                            evRenderer.render(contentElem, projection, globalDataService, scope.evDataService, scope.evEventService);
                        }

                    }

                }

                /**
                 * Check whether error occurred while trying to load root group.
                 * In that case there is no data to show, so show an error message.
                 *
                 * @return {boolean} - true if error occurred
                 */
                const errorWhileLoadingData = function () {

                    const requestParamsList = scope.evDataService.getRequestParametersAsList();

                    const rootRequestParam = requestParamsList.find(rp => rp.level === 1);

                    if (!rootRequestParam) {
                        return false;
                    }

                    return rootRequestParam.status === 'error';

                }

                var init = function () {

                    if ( errorWhileLoadingData() ) {
                        // When data was loaded before gTableBodyComponent initialized
                        scope.error = true;
                    }

                    if (viewContext === 'split_panel' && entityType === 'transaction-report') {

                        scope.dataLoadStatus = true;
                        // scope.firstRender = true;

                    } else {

                        // WTF is this shit code is?
                        // setTimeout(function () {
                        //
                        //     if (!scope.firstRender) { // Force Table render if not rendered in first 60 second
                        //
                        //         console.log("Special render trigger")
                        //
                        //         updateTableContent();
                        //     }
                        //
                        // }, 60 * 1000)


                    }

                    window.addEventListener('resize', onWindowResize);

                    if (!scope.isReport) {
                        scope.scrollManager = new EvScrollManager();
                    }

                    setTimeout(function () { // prevents scroll from interfering with sizes of table parts calculation

                        calculateElemsAndScrolls();

                        if (scope.isReport) {

                            // rvDomManager.calculateScroll(elements, scope.evDataService);

                            rvDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService, usersService, globalDataService);
                            // rvDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                            rvDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);

                            scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_START, function () {
                                clearOverflowingCells();
                            });

                            scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {
                                cellContentOverflow();
                            });


                            // If we already have data (e.g. viewType changed. 'report_viewer' to 'matrix' etc.)
                            var flatList = rvDataHelper.getFlatStructure(scope.evDataService, globalDataService);

                            if (flatList.length > 1) {

                                // progressBar.style.display = 'none';

                                if (scope.isReport) {
                                    contentElem.style.opacity = '1';
                                }

                                if ( scope.evDataService.didDataLoadEnd() ) {
                                    updateTableContent();
                                }

                            }

                            //  If we already have data (e.g. viewType changed) end

                            /*scope.evEventService.addEventListener(evEvents.START_CELLS_OVERFLOW, function () {
                                cellContentOverflow();
                            });*/

                        }
                        else {

                            // evDomManager.calculateScroll(elements, scope.evDataService, scope.scrollManager);

                            evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService, usersService, globalDataService);
                            evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                            evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService, scope.scrollManager);

                            if ( scope.evDataService.didDataLoadEnd() ) {
                                updateTableContent();
                            }

                        }

                        const componentStatuses = scope.evDataService.getComponentsStatuses();
                        componentStatuses.tableBody = true;
                        scope.evDataService.setComponentsStatuses(componentStatuses);

                        scope.evEventService.dispatchEvent(evEvents.TABLE_SIZES_CALCULATED);

                    }, 500);

                    if (!activeLayoutConfigIsSet && viewContext !== 'reconciliation_viewer') {

                        activeLayoutConfigIsSet = true;

                        scope.evDataService.setActiveLayoutConfiguration({isReport: scope.isReport}); // saving layout for checking for changes
                        scope.evEventService.dispatchEvent(evEvents.ACTIVE_LAYOUT_CONFIGURATION_CHANGED);

                    }

                    if (toggleBookmarksBtn) {

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

                    }

                };

                init();

                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', onWindowResize);
                })

            }
        }
    }

}());