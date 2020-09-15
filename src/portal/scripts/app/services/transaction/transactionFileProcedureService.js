/**
 * Created by szhitenev on 25.08.2016.
 */
(function () {
  "use strict";

  //   var pricingProcedureRepository = require("../../repositories/pricing/pricingProcedureRepository");
  var pricingProcedureRepository = require("../../repositories/transaction/transactionFileRepository");
  var getList = function (options) {
    return pricingProcedureRepository.getList(options);
  };

  var getByKey = function (id) {
    return pricingProcedureRepository.getByKey(id);
  };

  var create = function (account) {
    return pricingProcedureRepository.create(account);
  };

  var update = function (id, account) {
    return pricingProcedureRepository.update(id, account);
  };

  var deleteByKey = function (id) {
    return pricingProcedureRepository.deleteByKey(id);
  };

  var runProcedure = function (id, data) {
    return pricingProcedureRepository.runProcedure(id, data);
  };

  module.exports = {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey,

    runProcedure: runProcedure,
  };
})();
