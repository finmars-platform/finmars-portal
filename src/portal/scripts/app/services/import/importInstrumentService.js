/**
 * Created by szhitenev on 22.08.2016.
 */
(function(){

    'use strict';

    var importInstrumentRepository = require('../../repositories/import/importInstrumentRepository');

    var startImport = function(config){
        return importInstrumentRepository.startImport(config);
    };

    module.exports = {
        startImport: startImport
    }

}());