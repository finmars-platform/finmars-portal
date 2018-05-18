/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var instrumentTypeMappingRepository = require('../../../repositories/import/mappings/instrumentTypeMappingRepository');

    var getList = function (options) {
        return instrumentTypeMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentTypeMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return instrumentTypeMappingRepository.create(map);
    };

    var update = function (id, map) {
        return instrumentTypeMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return instrumentTypeMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());