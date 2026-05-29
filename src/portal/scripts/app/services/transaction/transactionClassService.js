'use strict';

import transactionClassRepository from '../../repositories/transaction/transactionClassRepository';

var getList = function (options) {
    return transactionClassRepository.getList(options);
};

var getListSync = function(){
    return transactionClassRepository.getListSync();
};

export default {
    getList: getList,
    getListSync: getListSync
};