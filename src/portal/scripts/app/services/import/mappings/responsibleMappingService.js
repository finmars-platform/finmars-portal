/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var responsibleMappingRepository = require('../../../repositories/import/mappings/responsibleMappingRepository');

    var getList = function () {
        return responsibleMappingRepository.getList();
    };

    var getByKey = function (id) {
        return responsibleMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return responsibleMappingRepository.create(map);
    };

    var update = function (id, map) {
        return responsibleMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return responsibleMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());