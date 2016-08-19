/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var currencyRepository = require('../repositories/currencyRepository');

    var getList = function (options) {
        return currencyRepository.getList(options);
    };

    var getByKey = function (id) {
        return currencyRepository.getByKey(id);
    };

    var create = function(account) {
        return currencyRepository.create(account);
    };

    var update = function(id, account) {
        return currencyRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return currencyRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());