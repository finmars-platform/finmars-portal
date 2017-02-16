/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');

    var getList = function (options) {
        return pricingPolicyRepository.getList(options);
    };

    var getByKey = function (id) {
        return pricingPolicyRepository.getByKey(id);
    };

    var create = function (policy) {
        return pricingPolicyRepository.create(policy);
    };

    var update = function (id, policy) {
        return pricingPolicyRepository.update(id, policy);
    };

    var deleteByKey = function (id) {
        return pricingPolicyRepository.deleteByKey(id);
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());