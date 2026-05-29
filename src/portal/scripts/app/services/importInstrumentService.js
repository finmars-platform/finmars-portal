'use strict';

import importInstrumentRepository from '../repositories/importInstrumentRepository';

var getInstrumentMappingList = function(){
    return importInstrumentRepository.getInstrumentMappingList();
};

export default {
    getInstrumentMappingList: getInstrumentMappingList
};