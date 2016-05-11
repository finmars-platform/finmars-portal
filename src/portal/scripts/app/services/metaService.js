/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    var metaRepository = require('../repositories/metaRepository');

    var getMenu = function(){
        return metaRepository.getMenu();
    };

    var getGeneralAttrs = function(){
        return metaRepository.getGeneralAttrs();
    };

    module.exports = {
        getMenu: getMenu,
        getGeneralAttrs: getGeneralAttrs
    }

}());