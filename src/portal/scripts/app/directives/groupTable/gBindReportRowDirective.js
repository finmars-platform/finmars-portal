/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'views/directives/groupTable/bind-report-row-view.html',
            link: function (scope, elem, attrs) {

                console.log('scope.item', scope.item);


            }
        }
    }

}());