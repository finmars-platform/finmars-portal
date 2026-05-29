'use strict';

// DEPRECATED???

import unifiedEntityImportRepository from '../../repositories/import/unifiedEntityImportRepository';

var startImport = function (config) {
    return unifiedEntityImportRepository.startImport(config);
};

export default {
    startImport: startImport
};