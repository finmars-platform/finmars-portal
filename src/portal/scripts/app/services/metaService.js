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

    var getTypeCaptions = function() {
        var filteredValueTypes = getValueTypes().filter(function (item) {
            return item.value !== 'field' && item.value !== 'decoration';
        });
        var typeCaptions = filteredValueTypes.map(function (item) {
            switch (item['display_name']) {
                case 'Number':
                    // item['caption_name'] = 'Integer';
                    item['caption_name'] = 'Whole number';
                    break;
                case 'Float':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Field':
                    item['caption_name'] = 'Reference';
                    break;
                case 'Classifier':
                    item['caption_name'] = 'Classification';
                    break;
                case 'String':
                    item['caption_name'] = 'Text';
                    break;
                case 'Boolean':
                    item['caption_name'] = 'True/False';
                    break;
                default:
                    item['caption_name'] = item['display_name'];
                    break;
            }

            return item;
        });
        console.log(typeCaptions);
        return typeCaptions;
    };
 
    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getTypeCaptions: getTypeCaptions
    }

}());