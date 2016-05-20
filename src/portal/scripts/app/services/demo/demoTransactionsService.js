/**
 * Created by sergey on 14.05.16.
 */
(function(){

    'use strict';

    var demoTransactionsRepository = require('../../repositories/demo/demoTransactionsRepository');

    var getList = function(portfolioId){
        return demoTransactionsRepository.getList(portfolioId);
    };

    module.exports = {
        getList: getList
    }

}());