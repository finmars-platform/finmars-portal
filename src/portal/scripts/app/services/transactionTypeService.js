/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var transactionTypeRepository = require('../repositories/transactionTypeRepository');

    var getList = function (options) {
        return transactionTypeRepository.getList(options);
    };

    var getByKey = function (id) {
        return transactionTypeRepository.getByKey(id);
    };

    var create = function (transaction) {
        return transactionTypeRepository.create(transaction);
    };

    var update = function (id, transaction) {
        return transactionTypeRepository.update(id, transaction);
    };

    var deleteByKey = function (id) {
        return transactionTypeRepository.deleteByKey(id);
    };

    var getBookTransaction = function (id) {
        return transactionTypeRepository.getBookTransaction(id);
    };

    var bookTransaction = function (id, transaction) {
        return transactionTypeRepository.bookTransaction(id, transaction);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        getBookTransaction: getBookTransaction,
        bookTransaction: bookTransaction
    }


}());