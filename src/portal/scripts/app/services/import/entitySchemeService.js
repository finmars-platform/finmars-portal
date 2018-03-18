/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var entitySchemeRepository = require('../../repositories/import/entitySchemeRepository');

    var getEntitiesSchemesList = function () {
        return entitySchemeRepository.getEntitiesSchemesList();
    };

    var getEntitySchemesByModel = function (entityModel) {
        return entitySchemeRepository.getEntitySchemesByModel(entityModel);
    };

    var create = function (scheme) {
        return entitySchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return entitySchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return entitySchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return entitySchemeRepository.deleteByKey(id)
    };

    module.exports = {
        getEntitiesSchemesList: getEntitiesSchemesList,
        getEntitySchemesByModel: getEntitySchemesByModel,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());