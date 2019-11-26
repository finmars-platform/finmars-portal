/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var transactionTypeRepository = require('../repositories/transactionTypeRepository');

    var getList = function (options) {
        return transactionTypeRepository.getList(options);
    };

    var getListLight = function (options) {
        return transactionTypeRepository.getListLight(options)
    };

    var getListLightWithInputs = function (options) {
        return transactionTypeRepository.getListLightWithInputs(options)
    };

    var getByKey = function (id) {
        return transactionTypeRepository.getByKey(id);
    };

    var getByKeyLight = function (id) {
        return transactionTypeRepository.getByKeyLight(id);
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

    var updateBulkLight = function(entities){
        return transactionTypeRepository.updateBulkLight(entities);
    };

    var updateBulk = function(entities){
        return transactionTypeRepository.updateBulk(entities);
    };

    var initBookComplexTransaction = function (id, contextData) {
        return transactionTypeRepository.initBookComplexTransaction(id, contextData);
    };

    var bookComplexTransaction = function (id, transaction) {
        return transactionTypeRepository.bookComplexTransaction(id, transaction);
    };

    var initBookPendingComplexTransaction = function (id) {
        return transactionTypeRepository.initBookPendingComplexTransaction(id);
    };

    var bookPendingComplexTransaction = function (id, transaction) {
        return transactionTypeRepository.bookPendingComplexTransaction(id, transaction);
    };

    var deleteBulk = function(data){
        return transactionTypeRepository.deleteBulk(data);
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getListLightWithInputs: getListLightWithInputs,
        getByKey: getByKey,
        getByKeyLight: getByKeyLight,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        initBookComplexTransaction: initBookComplexTransaction,
        bookComplexTransaction: bookComplexTransaction,

        initBookPendingComplexTransaction: initBookPendingComplexTransaction,
        bookPendingComplexTransaction: bookPendingComplexTransaction,

        updateBulkLight: updateBulkLight,
        updateBulk: updateBulk,
        deleteBulk: deleteBulk

    }


}());