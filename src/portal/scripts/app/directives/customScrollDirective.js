/**
 * Created by szhitenev on 11.08.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                scrollY: '@'
            },
            link: function (scope, elem) {

                console.log('custom scroll!!!', elem);
                console.log('custom scroll!!!', scope.scrollY);

                //baron($(elem));
                if (scope.scrollY && scope.scrollY == 'false') {
                    $(elem).perfectScrollbar({
                        suppressScrollY: true
                    });
                } else {
                    $(elem).perfectScrollbar();
                }


            }

        }
    }

}());