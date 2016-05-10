/**
 * Created by szhitenev on 05.05.2016.
 */
(function(){

    'use strict';

    module.exports = function(){
        return {
            scope: {
                section: '='
            },
            templateUrl: 'views/directives/menu-link-view.html',
            link: function(scope, elem){
                var controller = elem.parent().controller();

                scope.focusSection = function(){
                    controller.autoFocusContent = true;
                }
            }
        }
    }


}());