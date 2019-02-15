/**
 * Created by szhitenev on 15.11.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                'fileRead': '=',
                'fileReadChange': '&'
            },
            link: function (scope, elem, attrs) {

                console.log('scope?13124', scope);

                elem.bind('change', function (changeEvent) {

                    scope.fileRead = changeEvent.target.files[0];

                    if (scope.fileReadChange) {
                        scope.fileReadChange()
                    }

                })
            }
        }
    }

}());