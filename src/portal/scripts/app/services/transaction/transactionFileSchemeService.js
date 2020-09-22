/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {
  var transactionFileRepository = require("../../repositories/transaction/transactionFileRepository");

  var getTypes = function (options) {
    return transactionFileRepository.getTypes(options);
  };

  var getList = function (options) {
    return transactionFileRepository.getList(options);
  };

  var getByKey = function (id) {
    return transactionFileRepository.getByKey(id);
  };

  var create = function (account) {
    return transactionFileRepository.create(account);
  };

  var update = function (id, account) {
    return transactionFileRepository.update(id, account);
  };

  var deleteByKey = function (id) {
    return transactionFileRepository.deleteByKey(id);
  };

  module.exports = {
    getTypes: getTypes,

    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey,
  };
})();
