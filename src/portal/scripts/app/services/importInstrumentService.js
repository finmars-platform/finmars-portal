/**
 * Created by szhitenev on 04.08.2016.
 */
(function(){

    'use strict';

    var importInstrumentRepository = require('../repositories/importInstrumentRepository');

    var getInstrumentMappingList = function(){
        return importInstrumentRepository.getInstrumentMappingList();
    };

    module.exports = {
        getInstrumentMappingList: getInstrumentMappingList
    }

}());