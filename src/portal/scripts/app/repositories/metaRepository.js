/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    'use strict';

    var getMenu = function(){
        return window.fetch('portal/content/json/menu.json').then(function(data){
           return data.json();
        });
    };

    module.exports = {
        getMenu: getMenu
    }


}());