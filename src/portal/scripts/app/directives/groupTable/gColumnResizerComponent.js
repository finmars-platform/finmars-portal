/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    // var uiService = require('../../services/uiService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                items: '=',
                options: '='
            },
            link: function (scope, elem, attr) {

                scope.columnsWidth = scope.options.columnsWidth;

                logService.component('groupColumnResizer', 'initialized');

                var minWidth = 65;	// width value for showing tooltip
                function toggleColumnNameTooltip(column, columnWidth) {
                    if (columnWidth <= minWidth && !column.hasClass('small-width')) {
                        column.addClass('small-width');
                    }
                    else if (columnWidth > minWidth && column.hasClass('small-width')) {
                        column.removeClass('small-width');
                    }
                }

                var columnsWidthSet = false;

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

                    //console.log('--------------------', wrapperWidth);
                    //console.log('--------------------', $(elem).parents('.g-table-section').width());

                    if (wrapperWidth < $(elem).parents('.g-table-section').width()) {
                        wrapperWidth = $(elem).parents('.g-table-section').width();
                        $(elem).width(wrapperWidth);
                    }

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

                $(window).on('resize', function () {
                    resizeWorkarea();
                });

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

                    for (i = 0; i < columns.length; i = i + 1) {
                        areaWidth = areaWidth + $(columns[i]).width() + columnMargins;
                    }
                    var wrapperWidth = $(elem).find('.g-columns-component.g-thead').width() - $(elem).find('.g-cell-select.all').width();
                    if (wrapperWidth < areaWidth + dropNewFieldWidth) {
                        $(elem).find('.g-scrollable-area').width(areaWidth + dropNewFieldWidth);
                        $(elem).width(areaWidth + dropNewFieldWidth + 24);
                    } else {
                        //$(elem).width(wrapperWidth);
                    }
                }

                function resize() {

                    //console.log('resize!!');

                    var tHead = $(elem).find('.g-thead');
                    var th = tHead.find('.g-cell');
                    var tr = $(elem).find('.g-row');
                    var thSliders = th.find('.resize-slider');
                    var td;

                    var setThMinWidths = function () {
                        var i, a;
                        // var lastColumn = th.length - 1;
                        // console.log('min width seted ', th.length, 'resizer columns ', [scope.columns]);
                        for (i = 0; i < th.length; i = i + 1) {
                            if (!$(th[i]).attr('min-width')) {
                                $(th[i]).attr('min-width', '20');
                            }
                        }
                    };
                    setThMinWidths();

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
                            //resizeScrollableArea();
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

                    function resizeCells() {
                        var tHead = $(elem).find('.g-thead');
                        var th = tHead.find('.g-cell');
                        var tr = $(elem).find('.g-row');

                        var i, x;
                        for (i = 0; i < tr.length; i = i + 1) {
                            td = $(tr[i]).find('.g-cell-wrap');
                            for (x = 0; x < th.length; x = x + 1) {
                                (function (x) {
                                    $(td[x]).css({width: $(th[x]).width() + 'px'});
                                    //console.log('cell widths is ', $(td[x]).width(), $(th[x]).width());
                                }(x))
                            }
                        }
                    }

                    setTimeout(function () {
                        resizeCells();
                    }, 100);

                    //console.log('th', th);
                }

                //console.log('options', scope.options);

                scope.$watch('options.lastUpdate', function () {

                    //console.log('OPTIONS LAST UPDATE', scope.options.lastUpdate);

                    resizeScrollableArea();

                    resize();

                    setColumnsWidthAndNameTooltip();
                });

                resize();


            }
        }
    }

}());