/**
 * Created by szhitenev on 03.03.2020.
 */
(function () {

    var currencyHistoryErrorRepository = require('../../repositories/pricing/currencyHistoryErrorRepository');

    var getList = function (options) {
        return currencyHistoryErrorRepository.getList(options);
    };

    var getByKey = function (id) {
        return currencyHistoryErrorRepository.getByKey(id);
    };

    var update = function(id, account) {
        return currencyHistoryErrorRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return currencyHistoryErrorRepository.deleteByKey(id);
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());