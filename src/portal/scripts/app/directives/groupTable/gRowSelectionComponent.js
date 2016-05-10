/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    module.exports = function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/row-selection-view.html',
            link: function(scope, elem, attrs) {
                console.log('Row selection component');
            }
        }
    }


}());