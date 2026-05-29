import instrumentDailyPricingModelRepository from '../../repositories/instrument/instrumentDailyPricingModelRepository';

var getList = function (options) {
    return instrumentDailyPricingModelRepository.getList(options);
};

var getByKey = function (id) {
    return instrumentDailyPricingModelRepository.getByKey(id);
};


export default {
    getList: getList,
    getByKey: getByKey
};