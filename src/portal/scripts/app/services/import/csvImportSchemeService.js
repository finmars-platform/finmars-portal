/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var csvImportSchemeRepository = require('../../repositories/import/csvImportSchemeRepository');

    var getList = function (options) {
        return csvImportSchemeRepository.getList(options);
    };

    var create = function (scheme) {
        return csvImportSchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return csvImportSchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return csvImportSchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return csvImportSchemeRepository.deleteByKey(id)
    };

    module.exports = {
        getList: getList,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());