import instrumentPricingConditionRepository from '../../repositories/instrument/instrumentPricingConditionRepository';

var getList = function (options) {
    return instrumentPricingConditionRepository.getList(options);
};

var getByKey = function (id) {
    return instrumentPricingConditionRepository.getByKey(id);
};

export default {
    getList: getList,
    getByKey: getByKey
};