/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var transactionImportSchemeRepository = require('../../repositories/import/transactionImportSchemeRepository');

    var getList = function (options) {
        return transactionImportSchemeRepository.getList(options);
    };

    var getListLight = function (options) {
        return transactionImportSchemeRepository.getListLight(options);
    };

    var create = function (data) {
        return transactionImportSchemeRepository.create(data);
    };

    var getByKey = function(id) {
        return transactionImportSchemeRepository.getByKey(id);
    };

    var update = function(id, data) {
        return transactionImportSchemeRepository.update(id, data);
    };

    var deleteByKey = function(id) {
        return transactionImportSchemeRepository.deleteByKey(id)
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());