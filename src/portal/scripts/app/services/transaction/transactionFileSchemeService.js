/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {
  //   var instrumentPricingSchemeRepository = require("../../repositories/pricing/instrumentPricingSchemeRepository");
  var instrumentPricingSchemeRepository = require("../../repositories/transaction/transactionFileRepository");

  var getTypes = function (options) {
    return instrumentPricingSchemeRepository.getTypes(options);
  };

  var getList = function (options) {
    return instrumentPricingSchemeRepository.getList(options);
  };

  var getByKey = function (id) {
    return instrumentPricingSchemeRepository.getByKey(id);
  };

  var create = function (account) {
    return instrumentPricingSchemeRepository.create(account);
  };

  var update = function (id, account) {
    return instrumentPricingSchemeRepository.update(id, account);
  };

  var deleteByKey = function (id) {
    return instrumentPricingSchemeRepository.deleteByKey(id);
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
