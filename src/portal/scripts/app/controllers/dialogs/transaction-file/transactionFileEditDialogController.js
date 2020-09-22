/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {
  "use strict";

  var transactionFileProcedureService = require("../../../services/transaction/transactionFileProcedureService");
  //

  module.exports = function ($scope, $mdDialog, data) {
    var vm = this;

    vm.itemId = data.item.id;

    vm.item = {};

    vm.readyStatus = {
      policy: false,
    };
    vm.transactionFileProviderScheme = [
      { name: "CIM bank" },
      { name: "Julius Baer" },
      { name: "Lombard Odier" },
      { name: "Revolut" },
    ];
    vm.transactionFileSchemes = [
      { name: "Import HNWI balances" },
      { name: "BJB_scheme" },
      { name: "Reconciliation_scheme" },
      { name: "Client_scheme_1" },
      { name: "Universal_scheme_all_types" },
    ];

    vm.cancel = function () {
      $mdDialog.hide({ status: "disagree" });
    };
    vm.cool = function () {
      $mdDialog.hide({ status: "disagree" });
    };

    vm.agree = function () {
      transactionFileProcedureService
        .update(vm.item.id, vm.item)
        .then(function (data) {
          vm.item = data;

          $mdDialog.hide({ status: "agree", data: { item: vm.item } });
        });
    };

    vm.getItem = function () {
      transactionFileProcedureService.getByKey(vm.itemId).then(function (data) {
        vm.item = data;

        vm.readyStatus.policy = true;

        $scope.$apply();
      });
    };

    vm.init = function () {
      //   vm.getCurrencyPricingSchemesList();
      //   vm.getInstrumentPricingSchemesList();

      vm.getItem();
    };

    vm.init();
  };
})();
