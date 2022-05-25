/**
 * Created by szhitenev on 16.05.2022.
 */
(function(){

    'use strict';

    var importCurrencyCbondsRepository = require('../../repositories/import/importCurrencyCbondsRepository');

    var download = function(config){
        return importCurrencyCbondsRepository.download(config);
    };

    module.exports = {
        download: download
    }

}());