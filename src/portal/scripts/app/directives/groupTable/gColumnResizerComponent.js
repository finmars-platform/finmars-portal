/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var metaService = require('../../services/metaService');
    var utilsHelper = require('../../helpers/utils.helper');

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

                function resizeWorkarea() {
                    var workAreaElem = elem.parents('.g-workarea-wrap');
                    workAreaElem.width($(elem).parents('.entity-viewer-holder').width() - $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar').width());
                    var wrapperWidth = $(elem).find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    $(elem).find('.g-scroll-wrapper').width(wrapperWidth);
                    $(elem).find('.g-scrollable-area').width(wrapperWidth);
                }

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

                    var columnNumber = index + 2; // wtf?

                    var cells = evContent.querySelectorAll('.g-cell-wrap:nth-child(' + columnNumber + ')');

                    for (var i = 0; i < cells.length; i = i + 1) {

                        cells[i].style.width = column.style.width;

                    }

                }

                function toggleColumnNameTooltip(column) {
                    if (column.width() <= minWidth && !column.hasClass('small-width')) {
                        column.addClass('small-width');
                    }
                    else if (column.width() > minWidth && column.hasClass('small-width')) {
                        column.removeClass('small-width');
                    }
                }

                function resizeScrollableArea() {

                    var columns = scope.evDataService.getColumns();
                    var i;
                    var areaWidth = 0;
                    var columnMargins = 16;
                    var dropNewFieldWidth = 400;

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
                    }

                    $(scrollableArea).width(resultWidth);

                    $(evContent).width(resultWidth + buttonSelectAllWidth);

                }

                function initColumnSliderListener() {

                    $(elem).bind('mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var gColumnElem = $(this).parents('md-card.g-cell.g-column');
                        var column = findColumnById(gColumnElem[0].dataset.columnId);
                        var columnIndex = findColumnIndexById(gColumnElem[0].dataset.columnId);

                        var mouseDownLeft = e.clientX;
                        var diff;
                        var result;
                        var currentWidth = gColumnElem.width();

                        $(window).bind('mousemove', function (e) {

                            diff = e.clientX - mouseDownLeft;

                            result = currentWidth + diff;

                            if (result > 20) {

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
                            scope.evEventService.dispatchEvent(evEvents.START_CELLS_OVERFLOW);
                        });

                    });

                }

                var init = function () {

                    resizeWorkarea();

                    initColumnSliderListener();

                    resizeScrollableArea();

                    $(window).on('resize', function () {
                        resizeWorkarea();
                    });

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