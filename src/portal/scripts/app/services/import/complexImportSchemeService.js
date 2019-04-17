/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var complexImportSchemeRepository = require('../../repositories/import/complexImportSchemeRepository');

    var getList = function (options) {
        return complexImportSchemeRepository.getList(options);
    };

    var create = function (scheme) {
        return complexImportSchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return complexImportSchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return complexImportSchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return complexImportSchemeRepository.deleteByKey(id)
    };

    module.exports = {
        getList: getList,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());