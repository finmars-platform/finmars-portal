/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var strategy3MappingRepository = require('../../repositories/import/strategy3MappingRepository');

    var getList = function () {
        return strategy3MappingRepository.getList();
    };

    var getByKey = function (id) {
        return strategy3MappingRepository.getByKey(id);
    };

    var create = function (map) {
        return strategy3MappingRepository.create(map);
    };

    var update = function (id, map) {
        return strategy3MappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return strategy3MappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());