/**
 * Created by szhitenev on 31.03.2017.
 */
(function () {
    'use strict';

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                item: '='
            },
            templateUrl: 'views/directives/bind-forum-quote-view.html',
            link: function (scope, elem, attr) {

            }
        }
    }
}());