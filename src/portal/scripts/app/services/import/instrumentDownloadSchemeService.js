/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var instrumentDownloadSchemeRepository = require('../../repositories/import/instrumentDownloadSchemeRepository');

    var getList = function (providerId) {
        return instrumentDownloadSchemeRepository.getList(providerId);
    };

    var getListLight = function (providerId) {
        return instrumentDownloadSchemeRepository.getListLight(providerId);
    };

    var create = function (scheme) {
        return instrumentDownloadSchemeRepository.create(scheme);
    };

    var getByKey = function(id) {
        return instrumentDownloadSchemeRepository.getByKey(id);
    };

    var update = function(id, scheme) {
        return instrumentDownloadSchemeRepository.update(id, scheme);
    };

    var deleteByKey = function(id) {
        return instrumentDownloadSchemeRepository.deleteByKey(id)
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