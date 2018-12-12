/**
 * Created by szhitenev on 29.09.2016.
 */
(function () {

    'use strict';

    var transactionClassRepository = require('../../repositories/transaction/transactionClassRepository');

    var getList = function (options) {
        return transactionClassRepository.getList(options);
    };

    var getListSync = function(){
        return transactionClassRepository.getListSync();
    };

    module.exports = {
        getList: getList,
        getListSync: getListSync
    }

}());