/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var priceHistoryRepository = require('../repositories/priceHistoryRepository');

    var getList = function() {
        return priceHistoryRepository.getList();
    };

    var getByKey = function (id) {
        return priceHistoryRepository.getByKey(id);
    };

    var create = function(account) {
        return priceHistoryRepository.create(account);
    };

    var update = function(id, account) {
        return priceHistoryRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return priceHistoryRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());