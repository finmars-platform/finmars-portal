'use strict';

import accrualCalculationModelRepository from '../repositories/accrualCalculationModelRepository';

var getList = function (options) {
    return accrualCalculationModelRepository.getList(options);
};

export default {
    getList: getList
};