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

    var metaService = require('../../services/metaService')

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
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
                console.log("overflow elem", elem);
                var viewportElem = elem[0].querySelector('.ev-viewport');
                var contentElem = elem[0].querySelector('.ev-content');
                var progressBar = elem[0].querySelector('.ev-progressbar');

                var elements = {
                    viewportElem: viewportElem,
                    contentElem: contentElem
                };

                var projection;
                var entityType = scope.evDataService.getEntityType();

                var isReport = metaService.isReport(entityType);

                function renderReportViewer() {

                    // console.log('renderReportViewer');

                    rvDataHelper.syncLevelFold(scope.evDataService);

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.filter(function (item) {
                        return item.___type !== 'group';
                    });

                    console.log('renderReportViewer.flatList', flatList);

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

                function renderEntityViewer() {

                    var flatList = evDataHelper.getFlatStructure(scope.evDataService);
                    flatList.shift(); // remove root group

                    flatList = flatList.map(function (item, i) {
                        item.___flat_list_index = i;
                        return item
                    });

                    scope.evDataService.setFlatList(flatList);

                    projection = evDataHelper.calculateProjection(flatList, scope.evDataService);

                    scope.evDataService.setProjection(projection);

                    evDomManager.calculateScroll(elements, scope.evDataService);

                    // console.log('projection', projection);

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

                    var subtotalRows = rows.filter(function(row) {
                        return row.dataset.type === 'subtotal';
                    });
                    // console.log("cell overflow subtotalRows", subtotalRows);
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

                            if (cellContentWrap.textContent !== undefined && cellContentWrap.textContent !== '' && groupFoldingBtn) {

                                var cellContentHolder = cellContentWrap.querySelector('.g-cell-content');
                                var cellSpaceForText = cellContentWrap.clientWidth - groupFoldingBtn.clientWidth;

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
                    contentElem.style.opacity = '0.7';

                });

                scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    progressBar.style.display = 'none';
                    contentElem.style.opacity = '1';

                    updateTableContent();

                });

                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    updateTableContent();

                });

                if (isReport) {

                    rvDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                    rvDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);

                    scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS, function () {
                        clearOverflowingCells();
                    });

                    scope.evEventService.addEventListener(evEvents.START_CELLS_OVERFLOW, function () {
                        cellContentOverflow();
                    });

                } else {

                    evDomManager.initEventDelegation(contentElem, scope.evDataService, scope.evEventService);
                    evDomManager.initContextMenuEventDelegation(contentElem, scope.evDataService, scope.evEventService);

                    evDomManager.addScrollListener(elements, scope.evDataService, scope.evEventService);
                }

                window.addEventListener('resize', function () {

                    console.log('projection', projection);

                    if (projection) {

                        if (isReport) {
                            rvDomManager.calculateScroll(elements, scope.evDataService);
                            rvRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        } else {
                            evDomManager.calculateScroll(elements, scope.evDataService);
                            evRenderer.render(contentElem, projection, scope.evDataService, scope.evEventService);
                        }

                    }

                })

            }
        }
    }


}());