/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var pricingPolicyMappingRepository = require('../../../repositories/import/mappings/pricingPolicyMappingRepository');

    var getList = function (options) {
        return pricingPolicyMappingRepository.getList(options);
    };

    var getByKey = function (id) {
        return pricingPolicyMappingRepository.getByKey(id);
    };

    var create = function (map) {
        return pricingPolicyMappingRepository.create(map);
    };

    var update = function (id, map) {
        return pricingPolicyMappingRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return pricingPolicyMappingRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());