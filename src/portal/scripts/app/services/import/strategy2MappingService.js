/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var strategy2MappingRepository = require('../../repositories/import/strategy2MappingRepository');

    var getList = function () {
        return strategy2MappingRepository.getList();
    };

    var getByKey = function (id) {
        return strategy2MappingRepository.getByKey(id);
    };

    var create = function (map) {
        return strategy2MappingRepository.create(map);
    };

    var update = function (id, map) {
        return strategy2MappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return strategy2MappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());