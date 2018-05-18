/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var portfolioMappingRepository = require('../../../repositories/import/mappings/portfolioMappingRepository');

    var getList = function (options) {
        return portfolioMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return portfolioMappingRepository.create(map);
    };

    var update = function (id, map) {
        return portfolioMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return portfolioMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());