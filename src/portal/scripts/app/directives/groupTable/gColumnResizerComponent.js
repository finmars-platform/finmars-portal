/**
 * Created by sergey on 11.05.16.
 */

const evEvents = require('../../services/entityViewerEvents').default;

export default function (evRvDomManagerService) {
    return {
        restrict: 'A',
        scope: {
            evDataService: '=',
            evEventService: '=',
            contentWrapElement: '=',
        },
        link: function (scope, elem, attr) {
            // var tableSectionElem = elem[0].closest(".g-table-section");
            var scrollableArea;
            var viewportElem;
            var contentElem; // .ev-content
            var minWidth = 65;
            var gColumnElem = elem[0].closest(".gColumnElem");

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

                if (!contentElem) {
                    contentElem = $(elem).parents('.g-table-section')[0].querySelector('.ev-content');
                }

                var columnNumber = index + 1;

                var cells = contentElem.querySelectorAll(".g-cell-wrap[data-column='" + columnNumber + "']");

                for (var i = 0; i < cells.length; i = i + 1) {

                    cells[i].style.width = column.style.width;

                }

            }


            function toggleColumnNameTooltip() {
                /*
                   This function and class `.small-width` May be deprecated.
                   Look into it if you have time.
                */
                if (gColumnElem.clientWidth <= minWidth) {
                    gColumnElem.classList.add('small-width');

                } else {
                    gColumnElem.classList.remove('small-width');
                }

            }

            function resizeScrollableArea() {

                /*var viewContext = scope.evDataService.getViewContext();
                var columns = scope.evDataService.getColumns();

                var i;
                var areaWidth = 0;

                var dropNewFieldWidth = 400;
                if (viewContext === 'dashboard') {
                    dropNewFieldWidth = 105;
                }

                var buttonSelectAllWidth = 50;

                if (!scrollableArea) {
                    scrollableArea = $(elem).parents('.g-table-section')[0].querySelector('.g-scrollable-area');
                }
                if (!contentElem) {
                    contentElem = $(elem).parents('.g-table-section')[0].querySelector('.ev-content');
                }

                for (i = 0; i < columns.length; i = i + 1) {

                    var columnWidth = parseInt(columns[i].style.width.split('px')[0], 10);

                    areaWidth = areaWidth + columnWidth
                }

                var resultWidth = areaWidth + dropNewFieldWidth;

                var viewportWidth = $('.ev-viewport').width();

                if (resultWidth < viewportWidth) {

                    resultWidth = viewportWidth;
                    contentElem.style.width = 'auto';

                } else {
                    $(contentElem).width(resultWidth + buttonSelectAllWidth);
                }

                $(scrollableArea).width(resultWidth);*/

                if (!scrollableArea) {
                    scrollableArea = scope.contentWrapElement.querySelector('.g-scrollable-area');
                }

                if (!viewportElem) {
                    viewportElem = scope.contentWrapElement.querySelector('.ev-viewport');
                }

                if (!contentElem) {
                    contentElem = scope.contentWrapElement.querySelector('.ev-content');
                }

                evRvDomManagerService.calculateScrollableElementsWidth(contentElem, viewportElem.clientWidth, scrollableArea, scope.evDataService);


            }

            function onColSliderMouseup (e) {
                $(window).unbind('mousemove');

                scope.evEventService.dispatchEvent(evEvents.RESIZE_COLUMNS_END);
                // scope.evEventService.dispatchEvent(evEvents.START_CELLS_OVERFLOW);
            }

            function onColSliderMousedown(e) {

                e.preventDefault();
                e.stopPropagation();

                scope.evEventService.dispatchEvent(evEvents.RESIZE_COLUMNS_START);

                /* const isNewDesign = this.parentElement.classList.contains('g-table-header-cell-wrapper');

                var gColumnElem;

                if (isNewDesign) {

                    gColumnElem = $(this).parents('.g-table-header-cell-wrapper'); // Victor 2020.12.16 New report viewer design

                } else {

                    gColumnElem = $(this).parents('md-card.g-cell.g-column');

                }*/
                var column = findColumnById(gColumnElem.dataset.columnId);
                var columnIndex = findColumnIndexById(gColumnElem.dataset.columnId);

                var mouseDownLeft = e.clientX;
                var diff;
                var result;
                var currentWidth = gColumnElem.clientWidth;

                $(window).bind('mousemove', function (e) {

                    diff = e.clientX - mouseDownLeft;

                    result = currentWidth + diff;

                    if (result > 32) {

                        gColumnElem.style.width = result + 'px';

                        resizeScrollableArea();

                        column.style.width = result + 'px';

                        updateColumn(column);

                        // utilsHelper.debounce(updateCellsWidth(column, columnIndex), 5);
                        updateCellsWidth(column, columnIndex);

                        toggleColumnNameTooltip();

                    }

                });

                // $(window).bind('mouseup', onColSliderMouseup);
                window.addEventListener('mouseup', onColSliderMouseup);

            }

            function removeColSliderEventListeners () {
                elem[0].removeEventListener('mousedown', onColSliderMousedown);
                window.removeEventListener('mouseup', onColSliderMouseup);
            }

            /*function initColumnSliderListener() {

                $(elem).bind('mousedown', onColSliderMousedown);

            }*/

            var rtIndex, uthcsIndex, ucsIndex;

            var init = function () {

                // initColumnSliderListener();
                elem[0].addEventListener('mousedown', onColSliderMousedown);

                // resizeScrollableArea();

                rtIndex = scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    removeColSliderEventListeners();
                    elem[0].addEventListener('mousedown', onColSliderMousedown);
                    // initColumnSliderListener();

                });


                uthcsIndex = scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE, function () {

                    removeColSliderEventListeners();
                    elem[0].addEventListener('mousedown', onColSliderMousedown);
                    // initColumnSliderListener();

                });

                ucsIndex = scope.evEventService.addEventListener(evEvents.UPDATE_COLUMNS_SIZE, function () {

                    removeColSliderEventListeners();
                    elem[0].addEventListener('mousedown', onColSliderMousedown);
                    // initColumnSliderListener();

                });


            };

            init();

            scope.$on('$destroy', function () {

                removeColSliderEventListeners();

                scope.evEventService.removeEventListener(evEvents.REDRAW_TABLE, rtIndex);
                scope.evEventService.removeEventListener(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE, uthcsIndex);
                scope.evEventService.removeEventListener(evEvents.UPDATE_COLUMNS_SIZE, ucsIndex);

            });

        }
    }
}