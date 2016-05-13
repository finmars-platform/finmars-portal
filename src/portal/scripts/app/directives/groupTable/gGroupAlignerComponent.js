/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                items: '='
            },
            link: function (scope, elem, attr) {
                console.log('Aligner component initialized...', elem);
                function resize() {
                    var tHead = $(elem).find('.g-thead');
                    var th = tHead.find('.g-cell');
                    var tr = $(elem).find('.g-row');
                    var thSliders = th.find('.resize-slider');
                    var td;

                    var setThMinWidths = function () {
                        var i;
                        for (i = 0; i < th.length; i = i + 1) {
                            $(th[i]).attr('min-width', $(th[i]).width());
                        }
                    };
                    setThMinWidths();

                    $(thSliders).bind('mousedown', function (e) {
                        var parent = $(this).parent();
                        var width = parent.width();
                        var minWidth = parent.attr('min-width');
                        var mouseDownLeft = e.clientX;
                        $(window).bind('mousemove', function (e) {
                            var newWidth = e.clientX - mouseDownLeft;
                            resizeCells();
                            if (newWidth + width > minWidth) {
                                parent.width(width + newWidth);
                            }

                        });
                        $(window).bind('mouseup', function () {
                            console.log('unbind');
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
                    resize();
                });
                setTimeout(function () {
                    resize();
                }, 100)

            }
        }
    }

}());