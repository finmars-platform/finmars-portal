/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    module.exports = function() {
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function(scope, elem, attrs) {
                console.log('Sidebar filter component');
            }
        }
    }


}());