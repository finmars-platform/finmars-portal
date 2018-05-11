/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var counterpartyMappingRepository = require('../../../repositories/import/mappings/counterpartyMappingRepository');

    var getList = function () {
        return counterpartyMappingRepository.getList();
    };

    var getByKey = function (id) {
        return counterpartyMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return counterpartyMappingRepository.create(map);
    };

    var update = function (id, map) {
        return counterpartyMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return counterpartyMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());