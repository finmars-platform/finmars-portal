/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';


    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                postNgRepeatCallback: '&'
            },
            link: function (scope, elem, attr) {

                if (scope.$last) {

                    console.log('here?', scope);

                    scope.postNgRepeatCallback();
                }

            }
        }
    }

}());