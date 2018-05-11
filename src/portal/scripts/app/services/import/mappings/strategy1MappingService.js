/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var strategy1MappingRepository = require('../../../repositories/import/mappings/strategy1MappingRepository');

    var getList = function () {
        return strategy1MappingRepository.getList();
    };

    var getByKey = function (id) {
        return strategy1MappingRepository.getByKey(id);
    };

    var create = function (map) {
        return strategy1MappingRepository.create(map);
    };

    var update = function (id, map) {
        return strategy1MappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return strategy1MappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());