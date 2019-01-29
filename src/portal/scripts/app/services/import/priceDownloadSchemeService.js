/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var priceDownloadSchemeRepository = require('../../repositories/import/priceDownloadSchemeRepository');

    var getList = function (options) {
        return priceDownloadSchemeRepository.getList(options);
    };

    var getByKey = function (id) {
        return priceDownloadSchemeRepository.getByKey(id);
    };

    var create = function (map) {
        return priceDownloadSchemeRepository.create(map);
    };

    var update = function (id, map) {
        return priceDownloadSchemeRepository.update(id, map);
    };

    var deleteByKey = function (id) {
        return priceDownloadSchemeRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());