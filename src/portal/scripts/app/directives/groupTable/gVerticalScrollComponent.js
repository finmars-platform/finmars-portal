/**
 * Created by szhitenev on 03.06.2016.
 */

(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attrs) {

                setTimeout(function () {
                    $(elem).mCustomScrollbar({axis: "y"});
                    var offsetLeft = $(elem).parents('.g-table-wrap').width() + $('md-sidenav').width() - 15;
                    var offsetTop = $(elem).offset().top;
                    console.log('VERTICAL SCROLL BAR TABLE', elem);
                    $('#mCSB_2_scrollbar_vertical').css({
                        height: $(elem).height() + 'px',
                        position: 'fixed',
                        top: offsetTop + 'px',
                        left: offsetLeft + 'px'
                    });
                }, 100);

            }
        }
    }

}());