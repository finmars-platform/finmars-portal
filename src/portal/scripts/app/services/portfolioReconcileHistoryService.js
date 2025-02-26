/**
 * Created by szhitenev on 03.02.2024.
 */
(function () {

    var portfolioReconcileHistoryRepository = require('../repositories/portfolioReconcileHistoryRepository');


    var getList = function (options) {
        return portfolioReconcileHistoryRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioReconcileHistoryRepository.getByKey(id);
    };

    var create = function (portfolio) {
        return portfolioReconcileHistoryRepository.create(portfolio);
    };

    var update = function (id, portfolio) {
        return portfolioReconcileHistoryRepository.update(id, portfolio);
    };

    var check = function (options) {
        return portfolioReconcileHistoryRepository.check(options);
    };

    var deleteByKey = function (id) {
        return portfolioReconcileHistoryRepository.deleteByKey(id);
    };
    var deleteBulk = function (data) {
        return portfolioReconcileHistoryRepository.deleteBulk(data);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        check: check,
        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk

    }


}());