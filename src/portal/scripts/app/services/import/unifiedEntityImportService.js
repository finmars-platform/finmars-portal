/**
 * Created by szhitenev on 11.08.2021.
 */
(function () {

    'use strict';

    // DEPRECATED???

    var unifiedEntityImportRepository = require('../../repositories/import/unifiedEntityImportRepository');

    var startImport = function (config) {
        return unifiedEntityImportRepository.startImport(config);
    };

    module.exports = {
        startImport: startImport
    }

}());