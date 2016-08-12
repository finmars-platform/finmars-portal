/**
 * Created by szhitenev on 11.08.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                scrollY: '@',
                scrollSticky: '@'
            },
            link: function (scope, elem) {

                console.log('custom scroll!!!', elem);
                console.log('custom scroll!!!', scope.scrollY);

                //baron($(elem));
                if (scope.scrollY && scope.scrollY == 'false') {
                    $(elem).perfectScrollbar({
                        suppressScrollY: true
                    });

                    var scrollBar;
                    var scrollBarX;
                    var scrollBarLeft;

                    $(elem).on('ps-scroll-x', function (e) {
                        //console.log('check x', e);
                        if ($('.ps-scrollbar-y-rail.sticky')) {
                            scrollBar = $('.ps-scrollbar-y-rail.sticky');
                            scrollBarX = $(elem).find('> .ps-scrollbar-x-rail');
                            scrollBarLeft = parseInt(scrollBarX.css('left').split('px')[0], 10);
                            if (scrollBarLeft > 0) {
                                $(scrollBar).css('left', ($('.g-table-section').width() + scrollBarLeft - 21) + 'px');
                            } else {
                                $(scrollBar).css('left', ($('.g-table-section').width() - 21) + 'px');
                            }
                        }
                    })
                } else {
                    $(elem).perfectScrollbar();

                    if (scope.scrollSticky && scope.scrollSticky == 'true') {
                        //setTimeout(function () {
                        $(elem).find('.ps-scrollbar-y-rail').addClass('sticky');
                        //}, 0)
                    }

                }


            }

        }
    }

}());