/**
 * Created by szhitenev on 15.06.2016.
 */
(function () {

    'use strict';

    var entityClassifierService = require('./entityClassifierService');

    var entitiesByKey = {};

    var getList = function (entity) {
        return entityClassifierService.getList(entity);
    };

    var getByKey = function (entity, id) {
        return new Promise(function (resolve) {
            if (!entitiesByKey[entity]) {
                entityClassifierService.getByKey(entity, id).then(function (data) {
                    entitiesByKey[entity] = data;
                    resolve({key: entity, data: entitiesByKey[entity]});
                })
            }
        })
    };

    var create = function (entity, attributeType) {
        return entityClassifierService.create(entity, attributeType);
    };

    var update = function (entity, id, attributeType) {
        return entityClassifierService.update(entity, id, attributeType);
    };

    var deleteByKey = function (entity, id) {
        return entityClassifierService.deleteByKey(entity, id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());