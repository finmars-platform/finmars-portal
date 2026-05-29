'use strict';

import importCurrencyCbondsRepository from '../../repositories/import/importCurrencyCbondsRepository';

var download = function(config){
    return importCurrencyCbondsRepository.download(config);
};

export default {
    download: download
};