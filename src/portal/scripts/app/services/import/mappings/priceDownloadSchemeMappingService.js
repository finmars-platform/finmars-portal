/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var priceDownloadSchemeMappingRepository = require('../../../repositories/import/mappings/priceDownloadSchemeMappingRepository');

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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());