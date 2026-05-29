'use strict';

import importInstrumentRepository from '../../repositories/import/importInstrumentRepository';

var startImport = function(config){
    return importInstrumentRepository.startImport(config);
};

export default {
    startImport: startImport
};