/**
 * Created by szhitenev on 20.07.2021.
 */
(function () {

    var portfolioRegisterRepository = require('../repositories/portfolioRegisterRepository');


    var getList = function (options) {
        return portfolioRegisterRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioRegisterRepository.getByKey(id);
    };

    var create = function (portfolio) {
        return portfolioRegisterRepository.create(portfolio);
    };

    var update = function (id, portfolio) {
        return portfolioRegisterRepository.update(id, portfolio);
    };

    var deleteByKey = function (id) {
        return portfolioRegisterRepository.deleteByKey(id);
    };

    var updateBulk = function (portfolios) {
        return portfolioRegisterRepository.updateBulk(portfolios);
    };

    var deleteBulk = function (data) {
        return portfolioRegisterRepository.deleteBulk(data);
    };

    var restoreBulk = function (data) {
        return portfolioRegisterRepository.restoreBulk(data);
    };

    var calculateRecords = function (data) {
        return portfolioRegisterRepository.calculateRecords(data);
    }

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk,
        restoreBulk: restoreBulk,


        calculateRecords: calculateRecords
    }


}());