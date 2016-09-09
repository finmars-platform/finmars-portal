/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var importPriceDownloadSchemeRepository = require('../../repositories/import/importPriceDownloadSchemeRepository');

    var getList = function (options) {
        return importPriceDownloadSchemeRepository.getList(options);
    };

    var getByKey = function (id) {
        return importPriceDownloadSchemeRepository.getByKey(id);
    };

    var create = function(account) {
        return importPriceDownloadSchemeRepository.create(account);
    };

    var update = function(id, account) {
        return importPriceDownloadSchemeRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return importPriceDownloadSchemeRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());