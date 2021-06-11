/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                var scrollableArea;
                var evContent;
                var minWidth = 65;

                function findColumnById(columnId) {

                    var columns = scope.evDataService.getColumns();
                    var result;

                    columns.forEach(function (item) {

                        if (item.___column_id === columnId) {
                            result = item;
                        }

                    });

                    return result;

                }

                function findColumnIndexById(columnId) {

                    var columns = scope.evDataService.getColumns();

                    var result;

                    columns.forEach(function (item, index) {

                        if (item.___column_id === columnId) {
                            result = index;
                        }

                    });

                    return result;

                }

                function updateColumn(column) {

                    var columns = scope.evDataService.getColumns();

                    columns.forEach(function (item) {

                        if (item.___column_id === column.___column_id) {
                            item = column;
                        }

                    });

                    scope.evDataService.setColumns(columns);

                }

                function updateCellsWidth(column, index) {

                    if (!evContent) {
                        evContent = $(elem).parents('.g-table-section')[0].querySelector('.ev-content');
                    }

                    var columnNumber = index + 1;

                    var cells = evContent.querySelectorAll(".g-cell-wrap[data-column='" + columnNumber + "']");

                    for (var i = 0; i < cells.length; i = i + 1) {

                        cells[i].style.width = column.style.width;

                    }

                }

                function toggleColumnNameTooltip(column) {
                    if (column.width() <= minWidth && !column.hasClass('small-width')) {
                        column.addClass('small-width');
                    } else if (column.width() > minWidth && column.hasClass('small-width')) {
                        column.removeClass('small-width');
                    }
                }

                function resizeScrollableArea() {

                	var viewContext = scope.evDataService.getViewContext();
                    var columns = scope.evDataService.getColumns();

                    var i;
                    var areaWidth = 0;
                    var columnMargins = 16;
                    var dropNewFieldWidth = 400;
                    if (viewContext === 'dashboard') {
                        dropNewFieldWidth = 105;
                    }

                    var buttonSelectAllWidth = 24;

                    if (!scrollableArea) {
                        scrollableArea = $(elem).parents('.g-table-section')[0].querySelector('.g-scrollable-area');
                    }
                    if (!evContent) {
                        evContent = $(elem).parents('.g-table-section')[0].querySelector('.ev-content');
                    }

                    for (i = 0; i < columns.length; i = i + 1) {

                        var columnWidth = parseInt(columns[i].style.width.split('px')[0], 10);

                        areaWidth = areaWidth + columnWidth + columnMargins;
                    }

                    var resultWidth = areaWidth + dropNewFieldWidth;

                    var wrapperWidth = $('.ev-viewport').width();

                    if (resultWidth < wrapperWidth) {

                        resultWidth = wrapperWidth;
                        evContent.style.width = 'auto';

                    } else {
                        $(evContent).width(resultWidth + buttonSelectAllWidth);
                    }

                    $(scrollableArea).width(resultWidth);

                }

                function initColumnSliderListener() {

                    $(elem).bind('mousedown', function (e) {

                    	e.preventDefault();
                        e.stopPropagation();

                        scope.evEventService.dispatchEvent(evEvents.RESIZE_COLUMNS_START);

                        const isNewDesign = this.parentElement.classList.contains('g-table-header-cell-wrapper');

                        var gColumnElem;

                        if (isNewDesign) {

                            gColumnElem = $(this).parents('.g-table-header-cell-wrapper'); // Victor 2020.12.16 New report viewer design

                        } else {

                            gColumnElem = $(this).parents('md-card.g-cell.g-column');

                        }

                        var column = findColumnById(gColumnElem[0].dataset.columnId);
                        var columnIndex = findColumnIndexById(gColumnElem[0].dataset.columnId);

                        var mouseDownLeft = e.clientX;
                        var diff;
                        var result;
                        var currentWidth = gColumnElem.width();

                        $(window).bind('mousemove', function (e) {

                            diff = e.clientX - mouseDownLeft;

                            result = currentWidth + diff;

                            if (result > 32) {

                                gColumnElem.width(result);

                                resizeScrollableArea();

                                column.style.width = result + 'px';

                                updateColumn(column);

                                // utilsHelper.debounce(updateCellsWidth(column, columnIndex), 5);
                                updateCellsWidth(column, columnIndex);

                                toggleColumnNameTooltip(gColumnElem);

                            }

                        });

                        $(window).bind('mouseup', function () {
                            $(window).unbind('mousemove');
                            scope.evEventService.dispatchEvent(evEvents.RESIZE_COLUMNS_END);
                            // scope.evEventService.dispatchEvent(evEvents.START_CELLS_OVERFLOW);
                        });

                    });

                }

                var init = function () {

                    initColumnSliderListener();

                    resizeScrollableArea();

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        initColumnSliderListener();

                    });


                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE, function () {

                        initColumnSliderListener();

                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_COLUMNS_SIZE, function () {

                        initColumnSliderListener();

                    });


                };

                init();


            }
        }
    }

}());