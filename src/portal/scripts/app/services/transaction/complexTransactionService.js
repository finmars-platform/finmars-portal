/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var complexTransactionRepository = require('../../repositories/transaction/complexTransactionRepository');

    var getList = function (options) {
        return complexTransactionRepository.getList(options);
    };

    var getByKey = function (id) {
        return complexTransactionRepository.getByKey(id);
    };

    var create = function (transaction) {
        return complexTransactionRepository.create(transaction);
    };

    var update = function (id, transaction) {
        return complexTransactionRepository.update(id, transaction);
    };

    var deleteByKey = function (id) {
        return complexTransactionRepository.deleteByKey(id);
    };

    var getBookComplexTransaction = function (id) {
        return complexTransactionRepository.getBookComplexTransaction(id);
    };

    var bookComplexTransaction = function (id, transaction) {
        return complexTransactionRepository.bookComplexTransaction(id, transaction);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        getBookComplexTransaction: getBookComplexTransaction,
        bookComplexTransaction: bookComplexTransaction
    }


}());