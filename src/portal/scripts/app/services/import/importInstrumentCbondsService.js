'use strict';

import importInstrumentCbondsRepository from '../../repositories/import/importInstrumentCbondsRepository';

var download = function(config){
    return importInstrumentCbondsRepository.download(config);
};

export default {
    download: download
};