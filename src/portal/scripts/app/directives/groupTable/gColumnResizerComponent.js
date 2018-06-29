/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var metaService = require('../../services/metaService');
    // var uiService = require('../../services/uiService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                var evContent = elem.find('.ev-content');
                var scrollableArea = $(elem).find('.g-scrollable-area');
                var scrollWrapper = $(elem).find('.g-scroll-wrapper');

                console.log('evContent', evContent);


                if (scope.options) {

                    scope.columnsWidth = scope.options.columnsWidth;

                    console.log('scope.columnsWidth', scope.columnsWidth);

                }

                var minWidth = 65;	// width value for showing tooltip
                var columnsWidthSet = false;

                function toggleColumnNameTooltip(column, columnWidth) {
                    if (columnWidth <= minWidth && !column.hasClass('small-width')) {
                        column.addClass('small-width');
                    }
                    else if (columnWidth > minWidth && column.hasClass('small-width')) {
                        column.removeClass('small-width');
                    }
                }

                function setColumnsWidthAndNameTooltip() {
                    if (!columnsWidthSet) {
                        var columns = elem.find('.g-column');
                        var savedWidths = scope.columnsWidth;
                        //console.log('setColumnsWidthAndNameTooltip changes');
                        if (columns.length > 0 && columns.length === savedWidths.length) {
                            for (var i = 0; i < columns.length; i = i + 1) {
                                if (savedWidths[i] && !isNaN(savedWidths[i])) {
                                    $(columns[i]).width(savedWidths[i]);
                                    // if width small enough, show tooltip
                                    if (savedWidths[i] <= minWidth) {
                                        $(columns[i]).addClass('small-width');
                                    }
                                }
                            }
                            columnsWidthSet = true;
                        }
                    }
                }

                setTimeout(function () {

                    var workAreaElem = elem.parents('.g-workarea-wrap');

                    workAreaElem.width($(elem).parents('.entity-viewer-holder').width() - $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar').width());

                    var wrapperWidth = $('.g-columns-component.g-thead').width() - $('.g-cell-select.all').width();

                    // if (wrapperWidth < $(elem).parents('.g-table-section').width()) {
                    //     wrapperWidth = $(elem).parents('.g-table-section').width();
                    //     $(elem).width(wrapperWidth);
                    // }

                    $(elem).find('.g-scroll-wrapper').width(wrapperWidth);
                    $(elem).find('.g-scrollable-area').width(wrapperWidth);

                }, 0);

                var resizeWorkarea = function () {
                    var workAreaElem = elem.parents('.g-workarea-wrap');
                    workAreaElem.width($(elem).parents('.entity-viewer-holder').width() - $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar').width());
                    var wrapperWidth = $(elem).find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    $(elem).find('.g-scroll-wrapper').width(wrapperWidth);
                    $(elem).find('.g-scrollable-area').width(wrapperWidth);

                    resizeScrollableArea();
                    resize();
                };

                scope.$parent.triggerResize = resize;

                $('.filter-area-size-btn').click(function () {
                    //console.log('filter toggle working');
                    var filterArea = $(elem).parents('.g-wrapper').find('.g-filter-sidebar.main-sidebar');
                    if (filterArea.hasClass('min-filter')) {
                        filterArea.attr({
                            'min-width': '20px',
                            'width': '20px'
                        });
                        resizeWorkarea();
                        filterArea.addClass('min-filter');
                    }
                    else {
                        filterArea.attr({
                            'min-width': '239px',
                            'width': '235px'
                        });
                        resizeWorkarea();
                        filterArea.removeClass('min-filter');
                    }
                });

                function resizeScrollableArea() {

                    var columns;
                    var i;
                    var areaWidth = 0;
                    var columnMargins = 16;
                    var dropNewFieldWidth = 400;
                    columns = elem.find('.g-column');

                    var buttonSelectAllWidth = 24;

                    for (i = 0; i < columns.length; i = i + 1) {
                        areaWidth = areaWidth + $(columns[i]).width() + columnMargins;
                    }

                    var resultWidth = areaWidth + dropNewFieldWidth;

                    console.log('resultWidth', resultWidth);
                    console.log('scrollableArea', scrollableArea);

                    // if (!scrollableArea) {
                        scrollableArea = $(elem).find('.g-scrollable-area');
                    // }

                    console.log($(scrollableArea).width());

                    $(scrollableArea).width(resultWidth);
                    $(evContent).width(resultWidth + buttonSelectAllWidth);

                }

                var i, x, a;
                var tHead;
                var th;
                var tr;
                var thSliders;
                var td;

                var setThMinWidths = function (th) {

                    for (i = 0; i < th.length; i = i + 1) {
                        if (!$(th[i]).attr('min-width')) {
                            $(th[i]).attr('min-width', '20');
                        }
                    }
                };

                function resizeCells() {

                    tHead = $(elem).find('.g-thead');
                    th = tHead.find('.g-cell');
                    tr = $(elem).find('.g-row');

                    for (i = 0; i < tr.length; i = i + 1) {
                        td = $(tr[i]).find('.g-cell-wrap');

                        for (x = 0; x < th.length; x = x + 1) {
                            (function (x) {

                                $(td[x]).width($(th[x]).width());

                            }(x))
                        }
                    }
                }

                function resize() {

                    tHead = $(elem).find('.g-thead');
                    th = tHead.find('.g-cell');
                    tr = $(elem).find('.g-row');
                    thSliders = th.find('.resize-slider');

                    setThMinWidths(th);

                    $(thSliders).bind('mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var parent = $(this).parents('md-card.g-cell.g-column');
                        var width = parent.width();
                        var minWidth = parent.attr('min-width');
                        var newWidth;
                        var mouseDownLeft = e.clientX;

                        $(window).bind('mousemove', function (e) {

                            newWidth = e.clientX - mouseDownLeft;

                            resizeScrollableArea();
                            resizeCells();

                            parent.width(width + newWidth);

                            if (newWidth + width > minWidth) {
                                parent.width(width + newWidth);
                            }

                            toggleColumnNameTooltip(parent, parent.width());


                        });
                        $(window).bind('mouseup', function () {
                            $(window).unbind('mousemove');
                        });
                    });

                    resizeCells();

                }


                $(window).on('resize', function () {
                    resizeWorkarea();
                });


                var init = function () {

                    setColumnsWidthAndNameTooltip();

                    scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                        resizeScrollableArea();

                        resize();


                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE, function () {

                        var columns = scope.evDataService.getColumns();

                        var groupsWidth = metaService.columnsWidthGroups();

                        if (groupsWidth['newColumnAdded']) {
                            var DOMcolumns = elem.find('.g-column');
                            var lastColumn = DOMcolumns.length - 1;
                            var newColumn = DOMcolumns[lastColumn];
                            var columnWidth;
                            switch (columns[lastColumn]["value_type"]) {
                                case 10:
                                    columnWidth = groupsWidth.groupThree;
                                    break;
                                case 20:
                                case 40:
                                    columnWidth = groupsWidth.groupFive;
                                    break;
                                case 30:
                                    columnWidth = groupsWidth.groupOne;
                                    break;
                            }

                            $(newColumn).width(columnWidth);
                        }

                        resizeScrollableArea();

                        resize();

                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_COLUMNS_SIZE, function () {

                        resizeScrollableArea();

                        resize();

                    });


                };

                init();


            }
        }
    }

}());