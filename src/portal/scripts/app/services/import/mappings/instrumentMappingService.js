'use strict';

import instrumentMappingRepository from '../../../repositories/import/mappings/instrumentMappingRepository';

var getList = function (options) {
    return instrumentMappingRepository.getList(options);
};

var getByKey = function (id) {
    return instrumentMappingRepository.getByKey(id);
};

var create = function (map) {
    return instrumentMappingRepository.create(map);
};

var update = function (id, map) {
    return instrumentMappingRepository.update(id, map);
};

var deleteByKey = function (id) {
    return instrumentMappingRepository.deleteByKey(id);
};

export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey
};