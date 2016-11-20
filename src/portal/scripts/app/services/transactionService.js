/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var transactionRepository = require('../repositories/transactionRepository');

    var getList = function (options) {
        return transactionRepository.getList(options);
    };

    var getByKey = function (id) {
        return transactionRepository.getByKey(id);
    };

    var create = function(transaction) {
        return transactionRepository.create(transaction);
    };

    var update = function(id, transaction) {
        return transactionRepository.update(id, transaction);
    };

    var deleteByKey = function (id) {
        return transactionRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());