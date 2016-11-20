/**
 * Created by szhitenev on 15.06.2016.
 */
(function(){

    'use strict';

    var attributeTypeRepository = require('../repositories/attributeTypeRepository');

    var getList = function (entity) {
        return attributeTypeRepository.getList(entity);
    };

    var getByKey = function (entity, id) {
        return attributeTypeRepository.getByKey(entity, id);
    };

    var create = function (entity, attributeType) {
        return attributeTypeRepository.create(entity, attributeType);
    };

    var update = function (entity, id, attributeType) {
        return attributeTypeRepository.update(entity, id, attributeType);
    };

    var deleteByKey = function (entity, id) {
        return attributeTypeRepository.deleteByKey(entity, id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());