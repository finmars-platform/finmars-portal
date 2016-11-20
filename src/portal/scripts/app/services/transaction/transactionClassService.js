/**
 * Created by szhitenev on 29.09.2016.
 */
(function () {

    'use strict';

    var transactionClassRepository = require('../../repositories/transaction/transactionClassRepository');

    var getList = function () {
        return transactionClassRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());