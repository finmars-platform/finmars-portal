/**
 * Created by szhitenev on 15.11.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                'fileRead': '='
            },
            link: function (scope, elem, attrs) {

                console.log('scope?13124',scope);

                elem.bind('change', function (changeEvent) {
                    //
                    //console.log('change', changeEvent);
                    //var reader = new FileReader();
                    //
                    //reader.onload = function (loadEvent) {
                    //
                    //    scope.$apply(function () {
                    //        scope.fileRead = loadEvent.target.result;
                    //    })
                    //
                    //};
                    //
                    //reader.readAsDataURL(changeEvent.target.files[0]);

                    scope.fileRead = changeEvent.target.files[0];

                })
            }
        }
    }

}());