/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var accountMappingRepository = require('../../../repositories/import/mappings/accountMappingRepository');

    var getList = function (options) {
        return accountMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return accountMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return accountMappingRepository.create(map);
    };

    var update = function (id, map) {
        return accountMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return accountMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());