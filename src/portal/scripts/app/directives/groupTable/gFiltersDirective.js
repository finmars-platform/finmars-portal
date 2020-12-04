/**
 * Created by vzubr on 04.12.2020.
 * */
(function (){

    'use strict'

    module.exports = function () {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/g-filters-directive-view.html',
            scope: {

            },
            link: function (scope) {
                console.log('#69 gFiltersDirective')

            }
        }
    }
}());