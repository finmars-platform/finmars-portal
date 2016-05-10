/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    module.exports = function() {
        return {
            restrict: 'AE',
            scope: {
              items: '='
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function(scope, elem, attrs) {
                console.log('Grouping component');
            }
        }
    }


}());