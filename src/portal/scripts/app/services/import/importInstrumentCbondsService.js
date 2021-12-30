/**
 * Created by szhitenev on 22.08.2016.
 */
(function(){

    'use strict';

    var importInstrumentCbondsRepository = require('../../repositories/import/importInstrumentCbondsRepository');

    var download = function(config){
        return importInstrumentCbondsRepository.download(config);
    };

    module.exports = {
        download: download
    }

}());