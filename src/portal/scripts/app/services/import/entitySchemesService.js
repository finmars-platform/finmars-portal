/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var entitySchemesRepository = require('../../repositories/import/entitySchemesRepository');

    var getEntitiesSchemesList = function () {
        return entitySchemesRepository.getEntitiesSchemesList();
    };

    var getEntitySchemesByModel = function (entityModel) {
        return entitySchemesRepository.getEntitySchemesByModel(entityModel);
    };

    var getSchemeFields = function (schemeId) {
        return entitySchemesRepository.getSchemeFields(schemeId);
    };

    var getSchemeAttributes = function (schemeId) {
        return entitySchemesRepository.getSchemeAttributes(schemeId);
    };

    var updateEntitySchemeMapping = function (schemeMapping) {
        return entitySchemesRepository.updateEntitySchemeMapping(schemeMapping);
    };

    var create = function (scheme) {
        return entitySchemesRepository.create(scheme);
    };

    var getByKey = function(id) {
        return entitySchemesRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return entitySchemesRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return entitySchemesRepository.deleteByKey(id)
    };

    module.exports = {
        getEntitiesSchemesList: getEntitiesSchemesList,
        getEntitySchemesByModel: getEntitySchemesByModel,
        getSchemeFields: getSchemeFields,
        getSchemeAttributes: getSchemeAttributes,
        updateEntitySchemeMapping: updateEntitySchemeMapping,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());