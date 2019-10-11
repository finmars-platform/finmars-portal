/**
 * Created by szhitenev on 11.10.2019.
 */
(function(){

    'use strict';

    module.exports = function(){
        return {
            scope: {
                diameter: '@',
                frontLineColor: '@',
                backLineColor: '@'
            },
            template: '<div class="progress progress-circular progress-size-{{diameter}} front-line-{{frontLineColor}} back-line-{{backLineColor}}"></div>',
            link: function(scope, elem){

                if(!scope.frontLineColor) {
                    scope.frontLineColor = 'default'
                }

                if(!scope.backLineColor) {
                    scope.backLineColor = 'default';
                }

                if(!scope.diameter){
                    scope.diameter = 10
                }

            }
        }
    }


}());