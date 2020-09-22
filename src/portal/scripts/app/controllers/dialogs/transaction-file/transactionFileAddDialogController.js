/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {
  "use strict";

  var transactionFileProcedureService = require("../../../services/transaction/transactionFileProcedureService");
  var transactionTypeService = require("../../../services/transactionTypeService");
  var transactionService = require("../../../services/transactionService");
  var transactionFileSchemeService = require("../../../services/transaction/transactionFileSchemeService"); // тут

  module.exports = function ($scope, $mdDialog, data) {
    var vm = this;
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

    vm.toggleStatus = {
      price_date_from: "datepicker",
      price_date_to: "datepicker",
    };

    vm.toggle = function (key) {
      if (vm.toggleStatus[key] === "datepicker") {
        vm.toggleStatus[key] = "expr";
      } else {
        vm.toggleStatus[key] = "datepicker";
      }

      vm.item[key] = null;
      vm.item[key + "_expr"] = null;
    };

    vm.cancel = function () {
      $mdDialog.hide({ status: "disagree" });
    };

    vm.agree = function () {
      transactionFileProcedureService.create(vm.item).then(function (data) {
        $mdDialog.hide({ status: "agree", data: { item: data } });
      });
    };
    vm.getProvider = function (event) {
      vm.provider = 1;
    };
    vm.getInstrumentPricingSchemes = function () {
      transactionFileSchemeService
        .getList({
          pageSize: 1000,
        })
        .then(function (data) {
          vm.instrumentPricingSchemes = data.results.map(function (item) {
            return {
              id: item.user_code,
              name: item.user_code,
            };
          });

          console.log(
            "vm.instrumentPricingSchemesЗ",
            vm.instrumentPricingSchemes
          );

          $scope.$apply();
        });
    };

    vm.getInstrumentTypes = function () {
      transactionTypeService
        .getList({
          pageSize: 1000,
        })
        .then(function (data) {
          vm.instrumentTypes = data.results.map(function (item) {
            return {
              id: item.user_code,
              name: item.user_code,
            };
          });

          console.log("vm.instrumentTypes", vm.instrumentTypes);

          $scope.$apply();
        });
    };

    vm.getPricingPolicies = function () {
      transactionService
        .getList({
          pageSize: 1000,
        })
        .then(function (data) {
          vm.pricingPolicies = data.results.map(function (item) {
            return {
              id: item.user_code,
              name: item.user_code,
            };
          });

          $scope.$apply();
        });
    };

    vm.init = function () {
      vm.getInstrumentTypes();
      vm.getPricingPolicies();

      vm.getInstrumentPricingSchemes();
    };

    vm.init();
  };
})();
