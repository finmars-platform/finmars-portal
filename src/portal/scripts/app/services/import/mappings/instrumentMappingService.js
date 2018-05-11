/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var instrumentMappingRepository = require('../../../repositories/import/mappings/instrumentMappingRepository');

    var getList = function () {
        return instrumentMappingRepository.getList();
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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());