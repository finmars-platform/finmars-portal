import instrumentCostMethodRepository from '../../repositories/instrument/instrumentCostMethodRepository';

var getList = function (options) {
    return instrumentCostMethodRepository.getList(options);
};

export default {
    getList: getList
};