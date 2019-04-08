/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var entitySchemesRepository = require('../../repositories/import/entitySchemesRepository');

    var getEntitiesSchemesList = function (contentType) {
        return entitySchemesRepository.getEntitiesSchemesList(contentType);
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

    var getList = function (options) {
        return entitySchemesRepository.getList(options);
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
        getList: getList,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());