/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var responsibleClassifierMappingRepository = require('../../../../repositories/import/mappings/classifiers/responsibleClassifierMappingRepository');

    var getList = function (attribute_type_id) {
        return responsibleClassifierMappingRepository.getList(attribute_type_id);
    };

    var getByKey = function (id) {
        return responsibleClassifierMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return responsibleClassifierMappingRepository.create(map);
    };

    var update = function (id, map) {
        return responsibleClassifierMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return responsibleClassifierMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());