'use strict';

import instrumentPeriodicityRepository from '../repositories/instrumentPeriodicityRepository';

var getList = function (options) {
    return instrumentPeriodicityRepository.getList(options);
};

export default {
    getList: getList
};