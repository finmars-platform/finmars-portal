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

                function setVerticalScrolFixed() {
                    var offsetLeft = $(elem).parents('.g-table-section').width() + $('md-sidenav').width() - 15;
                    var offsetTop = $(elem).offset().top;
                    //console.log('VERTICAL SCROLL BAR TABLE', elem);
                    $(elem).find('.mCSB_scrollTools_vertical').css({
                        height: $(elem).height() + 'px',
                        position: 'fixed',
                        top: offsetTop + 'px',
                        left: offsetLeft + 'px'
                    });
                }

                $(elem).mCustomScrollbar({
                    axis: "y", callbacks: {
                        onInit: setVerticalScrolFixed,
                        onBeforeUpdate: setVerticalScrolFixed
                    }
                });


            }
        }
    }

}());