/**
 * Created by szhitenev on 06.05.2016.
 */
(function(){

    'use strict';

    module.exports = function(){
        return {
            restrict: 'AE',
            templateUrl: 'views/directives/groupTable/group-table-shell-view.html',
            scope: {
                items: '=',
                filters: '=',
                columns: '=',
                grouping: '=',
                externalCallback: '&'
            },
            link: function(scope, elem, attrs) {
                console.log('Group table initialized...');
                console.log('directive', scope.items);
            }
        }
    }

}());