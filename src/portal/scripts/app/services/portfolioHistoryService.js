/**
 * Created by szhitenev on 19.11.2023.
 */
(function () {

    var portfolioHistoryRepository = require('../repositories/portfolioHistoryRepository');


    var getList = function (options) {
        return portfolioHistoryRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioHistoryRepository.getByKey(id);
    };

    var create = function (portfolio) {
        return portfolioHistoryRepository.create(portfolio);
    };

    var update = function (id, portfolio) {
        return portfolioHistoryRepository.update(id, portfolio);
    };

    var deleteByKey = function (id) {
        return portfolioHistoryRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

    }


}());