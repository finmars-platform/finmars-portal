/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentPricingConditionRepository = require('../../repositories/instrument/instrumentPricingConditionRepository');

    var getList = function (options) {
        return instrumentPricingConditionRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentPricingConditionRepository.getByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey
    }


}());