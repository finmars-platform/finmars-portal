/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var accountClassifierMappingRepository = require('../../../../repositories/import/mappings/classifiers/accountClassifierMappingRepository');

    var getList = function (attribute_type_id) {
        return accountClassifierMappingRepository.getList(attribute_type_id);
    };

    var getByKey = function (id) {
        return accountClassifierMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return accountClassifierMappingRepository.create(map);
    };

    var update = function (id, map) {
        return accountClassifierMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return accountClassifierMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());