/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var instrumentClassifierMappingRepository = require('../../../../repositories/import/mappings/classifiers/instrumentClassifierMappingRepository');

    var getList = function (attribute_type_id) {
        return instrumentClassifierMappingRepository.getList(attribute_type_id);
    };

    var getByKey = function (id) {
        return instrumentClassifierMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return instrumentClassifierMappingRepository.create(map);
    };

    var update = function (id, map) {
        return instrumentClassifierMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return instrumentClassifierMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());