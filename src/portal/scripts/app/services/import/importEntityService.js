/**
 * Created by szhitenev on 18.03.2018.
 */
(function () {

    'use strict';

    var importEntityRepository = require('../../repositories/import/importEntityRepository');

    var startImport = function (config) {
        return importEntityRepository.startImport(config);
    };

    var validateImport = function (config) {
        return importEntityRepository.validateImport(config);
    };

    module.exports = {
        startImport: startImport,
        validateImport: validateImport
    }

}());