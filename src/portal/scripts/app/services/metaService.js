/**
 * Created by szhitenev on 04.05.2016.
 */
(function(){

    var metaRepository = require('../repositories/metaRepository');

    var getMenu = function(){
        return metaRepository.getMenu();
    };

    var getBaseAttrs = function(){
        return metaRepository.getBaseAttrs();
    };

    var getValueTypes = function(){
        return metaRepository.getValueTypes();
    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getValueTypes: getValueTypes
    }

}());