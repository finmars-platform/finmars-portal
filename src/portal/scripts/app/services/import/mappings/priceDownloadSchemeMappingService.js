'use strict';

import priceDownloadSchemeMappingRepository from '../../../repositories/import/mappings/priceDownloadSchemeMappingRepository';

var getList = function (options) {
    return priceDownloadSchemeMappingRepository.getList(options);
};

var getByKey = function (id) {
    return priceDownloadSchemeMappingRepository.getByKey(id);
};

var create = function (map) {
    return priceDownloadSchemeMappingRepository.create(map);
};

var update = function (id, map) {
    return priceDownloadSchemeMappingRepository.update(id, map);
};

var deleteByKey = function (id) {
    return priceDownloadSchemeMappingRepository.deleteByKey(id);
};

export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey
};