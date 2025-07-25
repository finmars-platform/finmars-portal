/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var counterpartyClassifierMappingRepository = require('../../../../repositories/import/mappings/classifiers/counterpartyClassifierMappingRepository');

    var getList = function (attribute_type_id) {
        return counterpartyClassifierMappingRepository.getList(attribute_type_id);
    };

    var getByKey = function (id) {
        return counterpartyClassifierMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return counterpartyClassifierMappingRepository.create(map);
    };

    var update = function (id, map) {
        return counterpartyClassifierMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return counterpartyClassifierMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());