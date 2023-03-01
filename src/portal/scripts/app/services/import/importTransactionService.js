/**
 * Created by szhitenev on 22.08.2016.
 */
(function () {

    'use strict';

    var importTransactionRepository = require('../../repositories/import/importTransactionRepository');

    var startImport = function (config) {
        return importTransactionRepository.startImport(config);
    };

    var validateImport = function (config) {
        return importTransactionRepository.validateImport(config);
    };

    var preprocessFile = function (config) {
        return importTransactionRepository.preprocessFile(config);
    };

    var dryRun = function (config) {
        return importTransactionRepository.dryRun(config)
    }

    module.exports = {
        startImport: startImport,
        validateImport: validateImport,
        preprocessFile: preprocessFile,
        dryRun: dryRun
    }

}());