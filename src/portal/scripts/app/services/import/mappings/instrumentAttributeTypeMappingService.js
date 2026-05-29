'use strict';

import instrumentAttributeTypeMappingRepository from '../../../repositories/import/mappings/instrumentAttributeTypeMappingRepository';

var getList = function (options) {
    return instrumentAttributeTypeMappingRepository.getList(options);
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

export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey
};