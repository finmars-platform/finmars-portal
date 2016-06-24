/**
 * Created by szhitenev on 03.06.2016.
 */

(function () {

    'use strict';

    var logService = require('../../services/logService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attrs) {

                logService.component('groupHorizontalScroll', 'initialized');

                $(elem).mCustomScrollbar({axis: "x", callbacks: {
                    onInit: function(){},
                    onOverflowX: function(){
                        //console.log("HORIZONTAL SCROLL");
                        //console.log('test');
                    },
                    whileScrolling: function(){

                    }

                }});

            }
        }
    }

}());