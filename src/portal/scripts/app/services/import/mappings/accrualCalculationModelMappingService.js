/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var accrualCalculationModelMappingRepository = require('../../../repositories/import/mappings/accrualCalculationModelMappingRepository');

    var getList = function (options) {
        return accrualCalculationModelMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return accrualCalculationModelMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return accrualCalculationModelMappingRepository.create(map);
    };

    var update = function (id, map) {
        return accrualCalculationModelMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return accrualCalculationModelMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());