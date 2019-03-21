/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var accountTypeMappingRepository = require('../../../repositories/import/mappings/accountTypeMappingRepository');

    var getList = function (options) {
        return accountTypeMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return accountTypeMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return accountTypeMappingRepository.create(map);
    };

    var update = function (id, map) {
        return accountTypeMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return accountTypeMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());