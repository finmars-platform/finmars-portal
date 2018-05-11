/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var instrumentAttributeTypeMappingRepository = require('../../../repositories/import/mappings/instrumentAttributeTypeMappingRepository');

    var getList = function () {
        return instrumentAttributeTypeMappingRepository.getList();
    };

    var getByKey = function (id) {
        return instrumentAttributeTypeMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return instrumentAttributeTypeMappingRepository.create(map);
    };

    var update = function (id, map) {
        return instrumentAttributeTypeMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return instrumentAttributeTypeMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());