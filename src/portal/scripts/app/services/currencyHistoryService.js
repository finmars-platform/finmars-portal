/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var currencyHistoryRepository = require('../repositories/currencyHistoryRepository');

    var getList = function(options) {
        return currencyHistoryRepository.getList(options);
    };

    var getByKey = function (id) {
        return currencyHistoryRepository.getByKey(id);
    };

    var create = function(account) {
        return currencyHistoryRepository.create(account);
    };

    var update = function(id, account) {
        return currencyHistoryRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return currencyHistoryRepository.deleteByKey(id);
    };

    var deleteBulk = function(data) {
        return currencyHistoryRepository.deleteBulk(data)
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk
    }


}());