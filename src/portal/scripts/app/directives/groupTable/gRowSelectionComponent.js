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
            templateUrl: 'views/directives/groupTable/row-selection-view.html',
            link: function(scope, elem, attrs) {
                console.log('Row selection component');
                scope.rowItems = [];

                scope.items.map(function(item){
                    console.log('2132132', item);
                    scope.rowItems.push({type: 'group'});
                    item.items.map(function(subitem){
                        scope.rowItems.push({type: 'row'})
                    })
                })

            }
        }
    }


}());