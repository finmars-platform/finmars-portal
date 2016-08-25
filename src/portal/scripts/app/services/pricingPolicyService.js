/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {

    'use strict';

    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');

    var getList = function () {
        return pricingPolicyRepository.getList();
    };

    var getByKey = function (id) {
        return pricingPolicyRepository.getByKey();
    };

    var create = function (policy) {
        return pricingPolicyRepository.create();
    };

    var update = function (id, policy) {
        return pricingPolicyRepository.update();
    };

    var deleteByKey = function (id) {
        return pricingPolicyRepository.deleteByKey();
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());