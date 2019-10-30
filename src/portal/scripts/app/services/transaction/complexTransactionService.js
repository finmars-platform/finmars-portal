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

    var updateProperties = function (id, transaction) {
        return complexTransactionRepository.updateProperties(id, transaction)
    };

    var updatePropertiesBulk = function (transactions) {
        return complexTransactionRepository.updatePropertiesBulk(transactions)
    };

    var deleteByKey = function (id) {
        return complexTransactionRepository.deleteByKey(id);
    };

    var initRebookComplexTransaction = function (id) {
        return complexTransactionRepository.initRebookComplexTransaction(id);
    };

    var rebookComplexTransaction = function (id, transaction) {
        return complexTransactionRepository.rebookComplexTransaction(id, transaction);
    };

    var initRebookPendingComplexTransaction = function (id) {
        return complexTransactionRepository.initRebookPendingComplexTransaction(id);
    };

    var rebookPendingComplexTransaction = function (id, transaction) {
        return complexTransactionRepository.rebookPendingComplexTransaction(id, transaction);
    };

    var deleteBulk = function (data) {
        return complexTransactionRepository.deleteBulk(data);
    };

    var recalculatePermissions = function (data) {
        return complexTransactionRepository.recalculatePermissions(data)
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateProperties: updateProperties,
        updatePropertiesBulk: updatePropertiesBulk,

        initRebookComplexTransaction: initRebookComplexTransaction,
        rebookComplexTransaction: rebookComplexTransaction,

        initRebookPendingComplexTransaction: initRebookPendingComplexTransaction,
        rebookPendingComplexTransaction: rebookPendingComplexTransaction,

        deleteBulk: deleteBulk,

        recalculatePermissions: recalculatePermissions
    }


}());