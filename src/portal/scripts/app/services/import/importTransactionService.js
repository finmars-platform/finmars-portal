/**
 * Created by szhitenev on 22.08.2016.
 */
(function(){

    'use strict';

    var importTransactionRepository = require('../../repositories/import/importTransactionRepository');

    var startImport = function(config){
        return importTransactionRepository.startImport(config);
    };

    module.exports = {
        startImport: startImport
    }

}());