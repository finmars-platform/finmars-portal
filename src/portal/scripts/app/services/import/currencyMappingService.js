/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var currencyMappingRepository = require('../../repositories/import/currencyMappingRepository');

    var getList = function () {
        return currencyMappingRepository.getList();
    };

    var getByKey = function (id) {
        return currencyMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return currencyMappingRepository.create(map);
    };

    var update = function (id, map) {
        return currencyMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return currencyMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());