/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var metaRepository = require('../repositories/metaRepository');

    var getMenu = function () {
        return metaRepository.getMenu();
    };

    var getBaseAttrs = function () {
        return metaRepository.getBaseAttrs();
    };

    var getEntityAttrs = function (entity) {
        return metaRepository.getEntityAttrs(entity);
    };

    var getValueTypes = function () {
        return metaRepository.getValueTypes();
    };

    var getEntitiesWithoutBaseAttrsList = function () {
        return metaRepository.getEntitiesWithoutBaseAttrsList();
    };

    var getRestrictedEntitiesWithTypeField = function(){
        return metaRepository.getRestrictedEntitiesWithTypeField();
    };


    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField
    }

}());