/**
 * Created by szhitenev on 02.02.2024.
 */
(function () {

    var portfolioClassRepository = require('../repositories/portfolioClassRepository');

    var getList = function (options) {
        return portfolioClassRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioClassRepository.getByKey(id);
    };

    var create = function(account) {
        return portfolioClassRepository.create(account);
    };

    var update = function(id, account) {
        return portfolioClassRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return portfolioClassRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());