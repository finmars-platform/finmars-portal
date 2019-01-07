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

                //baron($(elem));
                if (scope.scrollY === 'false') {

                    new PerfectScrollbar(elem[0], {
                        suppressScrollY: true
                    });

                    var scrollBar;
                    var scrollBarX;
                    var scrollBarLeft;

                    // $(elem).on('ps-scroll-x', function (e) {
                    elem[0].addEventListener('ps-scroll-x', function (e) {

                        console.log('$(elem).find(\'.g-table-body-component > .ps__rail-x\')', $(elem).find('.g-table-body-component > .ps__rail-x'));

                        if ($(elem).find('.g-table-body-component > .ps__rail-x').length) {

                            scrollBar = $('.ps__rail-y');
                            scrollBarX = $(elem).find('.g-table-body-component > .ps__rail-x');
                            scrollBarLeft = parseInt(scrollBarX.css('left').split('px')[0], 10);
                            if (scrollBarLeft > 0) {
                                $(scrollBar).css('left', ($('.g-table-section').width() + scrollBarLeft - 21) + 'px');
                            } else {
                                $(scrollBar).css('left', ($('.g-table-section').width() - 21) + 'px');
                            }

                        }

                    })
                } else {

                    new PerfectScrollbar(elem[0]);

                    // if (scope.scrollSticky && scope.scrollSticky == 'true') {
                    //     //setTimeout(function () {
                    //     $(elem).find('.ps-scrollbar-y-rail').addClass('sticky');
                    //     //}, 0)
                    // }

                }


            }

        }
    }

}());