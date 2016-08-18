/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var instrumentSchemeRepository = require('../repositories/instrumentSchemeRepository');

    var getList = function () {
        return instrumentSchemeRepository.getList();
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