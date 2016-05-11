/**
 * Created by sergey on 11.05.16.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                console.log('elem resizeble');


                elem.on('mousedown', function(e){
                    var posY = e.clientY,
                        posX = e.clientX;
                    elem.on('mousemove', function(e){
                        console.log(e.pageX, e.pageY);

                        var elemLeft = elem.offset().left;
                        var elemTop = elem.offset().top;

                        elem.css({
                            'left': elemLeft + e.clientX - posX + 'px',
                            'top': elemTop + e.clientY - posY + 'px'
                        })
                    });

                    $(window).on('mouseup', function (e) {
                        elem.unbind('mousemove');
                    })

                    elem.on('mouseleave', function(e){
                        elem.unbind('mousemove');
                    })

                })
            }
        }
    }

}());