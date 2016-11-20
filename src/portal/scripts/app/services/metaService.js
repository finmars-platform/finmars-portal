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

    var getEntitiesWithoutDynAttrsList = function () {
        return metaRepository.getEntitiesWithoutDynAttrsList();
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return metaRepository.getRestrictedEntitiesWithTypeField();
    };

    var getTypeCaptions = function () {
        var filteredValueTypes = getValueTypes();
        //var filteredValueTypes = getValueTypes().filter(function (item) {
        //	// return item.value !== 'field' && item.value !== 'decoration';
        //	return item.value !== 'field';
        //});
        var typeCaptions = filteredValueTypes.map(function (item) {
            switch (item['display_name']) {
                case 'Number':
                    // item['caption_name'] = 'Integer';
                    item['caption_name'] = 'Whole number';
                    break;
                case 'Float':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Classifier':
                    item['caption_name'] = 'Classification';
                    break;
                case 'Field':
                    item['caption_name'] = 'Reference';
                    break;
                case 'String':
                    item['caption_name'] = 'Text';
                    break;
                case 'Boolean':
                    item['caption_name'] = 'True/False';
                    break;
                case 'Decoration':
                    item['caption_name'] = 'Decoration';
                    break;
                default:
                    item['caption_name'] = item['display_name'];
                    break;
            }
            return item;
        });
        //console.log(typeCaptions);
        return typeCaptions;
    };

    var groups = {
        "groupOne": "400px",
        "groupTwo": "600px",
        "groupThree": "300px",
        "groupFour": "450px",
        "groupFive": "200px",
        "newColumnAdded": false
    };

    var getDynamicAttrsValueTypes = function () {
        return metaRepository.getDynamicAttrsValueTypes();
    };

    var getDynamicAttrsValueTypesCaptions = function () {
        var filteredValueTypes = getDynamicAttrsValueTypes();
        //var filteredValueTypes = getValueTypes().filter(function (item) {
        //	// return item.value !== 'field' && item.value !== 'decoration';
        //	return item.value !== 'field';
        //});
        var typeCaptions = filteredValueTypes.map(function (item) {
            switch (item['display_name']) {
                case 'Number':
                    item['caption_name'] = 'Number with decimals';
                    break;
                case 'Classifier':
                    item['caption_name'] = 'Classification';
                    break;
                case 'Date':
                    item['caption_name'] = 'Date';
                    break;
                case 'String':
                    item['caption_name'] = 'Text';
                    break;
            }
            return item;
        });
        //console.log(typeCaptions);
        return typeCaptions;
    };

    var columnsWidthGroups = function (newColumn) {

        if (typeof newColumn === "boolean") {
            groups["newColumnAdded"] = newColumn;
        }
        else {
            return groups;
        }
    };

    var checkRestrictedEntityTypesForAM = function (entityType) {
        switch (entityType) {
            case "portfolio":
            case "account":
            case "counterparty":
            case "responsible":
            case "instrument":
            case "transaction":
            case "strategies":
                return true;
                break;
            default:
                return false;
        }
    };

    var getEntityTabs = function (entityType) {
        return metaRepository.getEntityTabs(entityType);
    };

    var getEntitiesWithSimpleFields = function () {
        return metaRepository.getEntitiesWithSimpleFields();
    };

    var getFieldsWithTagGrouping = function(){
        return metaRepository.getFieldsWithTagGrouping();
    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
        getDynamicAttrsValueTypesCaptions: getDynamicAttrsValueTypesCaptions,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getTypeCaptions: getTypeCaptions,
        columnsWidthGroups: columnsWidthGroups,
        getEntityTabs: getEntityTabs,
        getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
        checkRestrictedEntityTypesForAM: checkRestrictedEntityTypesForAM,
        getFieldsWithTagGrouping: getFieldsWithTagGrouping
    }

}());