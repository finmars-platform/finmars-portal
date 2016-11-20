/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaRestrictionsRepository = require('../repositories/metaRestrictionsRepository');

    var getEntitiesWithoutDynamicAttrsList = function () {
        return metaRestrictionsRepository.getEntitiesWithoutDynamicAttrsList();
    };

    var getEntitiesWithoutBaseAttrsList = function () {
        return metaRestrictionsRepository.getEntitiesWithoutBaseAttrsList();
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return metaRestrictionsRepository.getEntitiesWithoutBaseAttrsList();
    };

    module.exports = {
        getEntitiesWithoutDynamicAttrsList: getEntitiesWithoutDynamicAttrsList,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField
    }

}());