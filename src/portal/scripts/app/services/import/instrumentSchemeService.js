/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var instrumentSchemeRepository = require('../../repositories/import/instrumentSchemeRepository');

    var getList = function (providerId) {
        return instrumentSchemeRepository.getList(providerId);
    };

    var create = function (scheme) {
        return instrumentSchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return instrumentSchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return instrumentSchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return instrumentSchemeRepository.deleteByKey(id)
    };

    module.exports = {
        getList: getList,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());