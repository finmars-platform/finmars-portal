/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                items: '='
            },
            link: function (scope, elem, attr) {

                logService.component('groupColumnResizer', 'initialized');

                var workAreaElem = elem.parents('.g-workarea');
                var filterSidebarWidth = 246;

                workAreaElem.width($(window).width() - filterSidebarWidth - $('md-sidenav').width());
                var wrapperWidth = $('.g-columns-component.g-thead').width() - $('.g-cell-select.all').width();
                $('.g-scroll-wrapper').width(wrapperWidth);
                $('.g-scrollable-area').width(wrapperWidth);

                function resizeScrollableArea() {
                    var columns;
                    var i;
                    var areaWidth = 0;
                    var columnMargins = 16;
                    var dropNewFieldWidth = 400;
                    columns = elem.find('.g-column');
                    for(i = 0; i < columns.length; i = i + 1) {
                        areaWidth = areaWidth + $(columns[i]).width() + columnMargins;
                    }
                    wrapperWidth = $('.g-columns-component.g-thead').width() - $('.g-cell-select.all').width();
                    if(wrapperWidth < areaWidth + dropNewFieldWidth) {
                        $('.g-scrollable-area').width(areaWidth + dropNewFieldWidth);
                        scope.$apply();
                    } else {
                    }
                };

                function resize() {
                    var tHead = $(elem).find('.g-thead');
                    var th = tHead.find('.g-cell');
                    var tr = $(elem).find('.g-row');
                    var thSliders = th.find('.resize-slider');
                    var td;

                    var setThMinWidths = function () {
                        var i;
                        for (i = 0; i < th.length; i = i + 1) {
                            if(!$(th[i]).attr('min-width')) {
                                $(th[i]).attr('min-width', $(th[i]).width());
                            }
                        }
                    };
                    setThMinWidths();

                    $(thSliders).bind('mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var parent = $(this).parent();
                        var width = parent.width();
                        var minWidth = parent.attr('min-width');
                        var newWidth;
                        var mouseDownLeft = e.clientX;

                        $(window).bind('mousemove', function (e) {
                            newWidth = e.clientX - mouseDownLeft;
                            resizeScrollableArea();
                            resizeCells();
                            resizeScrollableArea();
                            if (newWidth + width > minWidth) {
                                parent.width(width + newWidth);
                            }

                        });
                        $(window).bind('mouseup', function () {
                            $(window).unbind('mousemove')
                        });
                    });

                    function resizeCells() {
                        var tHead = $(elem).find('.g-thead');
                        var th = tHead.find('.g-cell');
                        var tr = $(elem).find('.g-row');

                        var i, x;
                        for (i = 0; i < tr.length; i = i + 1) {
                            td = $(tr[i]).find('.g-cell');
                            for (x = 0; x < th.length; x = x + 1) {
                                (function (x) {
                                    $(td[x]).css({width: $(th[x]).width() + 'px'});
                                }(x))
                            }
                        }
                    }

                    setTimeout(function () {
                        resizeCells();
                    }, 100);

                    //console.log('th', th);
                }

                scope.$watchCollection('items', function () {
                    resizeScrollableArea();
                    setTimeout(function () {
                        resize();
                    }, 100);
                    //resize();
                });
                setTimeout(function () {
                    resize();
                }, 100)

            }
        }
    }

}());