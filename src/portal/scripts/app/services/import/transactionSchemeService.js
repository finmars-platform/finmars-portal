/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var transactionSchemeRepository = require('../../repositories/import/transactionSchemeRepository');

    var getList = function () {
        return transactionSchemeRepository.getList();
    };

    var getListLight = function () {
        return transactionSchemeRepository.getListLight();
    };

    var create = function (scheme) {
        return transactionSchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return transactionSchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return transactionSchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return transactionSchemeRepository.deleteByKey(id)
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