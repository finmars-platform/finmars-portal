/**
 * Created by szhitenev on 30.01.2020.
 */
(function () {
  "use strict";

  var transactionFileProcedureService = require("../../../services/transaction/transactionFileProcedureService");

  var portfolioService = require("../../../services/portfolioService");
  //   var instrumentTypeService = require("../../../services/instrumentTypeService");
  var instrumentTypeService = require("../../../services/transactionTypeService");
  //
  //
  var pricingPolicyService = require("../../../services/transactionService");
  // var pricingPolicyService = require("../../../services/pricingPolicyService");
  //
  //   var instrumentPricingSchemeService = require("../../../services/transaction/transactionFileSchemeService"); // тут

  var transactionFileSchemeService = require("../../../services/transaction/transactionFileSchemeService"); // тут
  var currencyPricingSchemeService = require("../../../services/pricing/currencyPricingSchemeService");

  module.exports = function ($scope, $mdDialog, data) {
    var vm = this;

    vm.item = {
      instrument_pricing_condition_filters: [2, 3],
      currency_pricing_condition_filters: [2, 3],
    };

    vm.portfolios = [];
    vm.pricingPolicies = [];
    vm.instrumentTypes = [];
    vm.instrumentPricingSchemes = [];
    vm.currencyPricingSchemes = [];
    //
    vm.transactionFileSchemes = [];
    //

    vm.portfolio_filters = [];
    vm.pricing_policy_filters = [];
    vm.instrument_type_filters = [];
    vm.instrument_pricing_scheme_filters = [];
    vm.currency_pricing_scheme_filters = [];

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
      //   vm.item = {
      //     // id: 4,
      //     name: "test",

      //     notes: "21",
      //     provider: 4,
      //     scheme_name: "1",
      //     modified: "2020-09-17T18:21:58.310693Z",
      //   };
      vm.item.provider = 8;
      vm.item.scheme_name = "1";
      //   vm.item.modified = "2020-09-17T18:21:58.310693Z";

      //   if (vm.item.price_date_from_expr) {
      //     vm.item.price_date_from = null;
      //   }

      //   if (vm.item.price_date_to_expr) {
      //     vm.item.price_date_to = null;
      //   }

      //   if (vm.item.portfolio_filters) {
      //     vm.item.portfolio_filters = vm.item.portfolio_filters.join(",");
      //   }

      //   if (vm.item.pricing_policy_filters) {
      //     vm.item.pricing_policy_filters = vm.item.pricing_policy_filters.join(
      //       ","
      //     );
      //   }

      //   if (vm.item.instrument_type_filters) {
      //     vm.item.instrument_type_filters = vm.item.instrument_type_filters.join(
      //       ","
      //     );
      //   }

      //   if (vm.item.instrument_pricing_scheme_filters) {
      //     vm.item.instrument_pricing_scheme_filters = vm.item.instrument_pricing_scheme_filters.join(
      //       ","
      //     );
      //   }

      //   if (vm.item.instrument_pricing_condition_filters) {
      //     vm.item.instrument_pricing_condition_filters = vm.item.instrument_pricing_condition_filters.join(
      //       ","
      //     );
      //   }

      //   if (vm.item.currency_pricing_scheme_filters) {
      //     vm.item.currency_pricing_scheme_filters = vm.item.currency_pricing_scheme_filters.join(
      //       ","
      //     );
      //   }

      //   if (vm.item.currency_pricing_condition_filters) {
      //     vm.item.currency_pricing_condition_filters = vm.item.currency_pricing_condition_filters.join(
      //       ","
      //     );
      //   }
      console.log(vm.item, "panov vm.item");
      transactionFileProcedureService.create(vm.item).then(function (data) {
        $mdDialog.hide({ status: "agree", data: { item: data } });
      });
    };

    vm.getPortfolios = function () {
      portfolioService
        .getList({
          pageSize: 1000,
        })
        .then(function (data) {
          vm.portfolios = data.results.map(function (item) {
            return {
              id: item.user_code,
              name: item.user_code,
            };
          });

          console.log("vm.portfolios", vm.portfolios);

          $scope.$apply();
        });
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

    vm.getCurrencyPricingSchemes = function () {
      currencyPricingSchemeService
        .getList({
          pageSize: 1000,
        })
        .then(function (data) {
          vm.currencyPricingSchemes = data.results.map(function (item) {
            return {
              id: item.user_code,
              name: item.user_code,
            };
          });

          console.log("vm.transactionFileSchemes", vm.currencyPricingSchemes);

          $scope.$apply();
        });
    };

    vm.getInstrumentTypes = function () {
      instrumentTypeService
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
      pricingPolicyService
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
      vm.getPortfolios();

      vm.getInstrumentPricingSchemes();
      vm.getCurrencyPricingSchemes();
    };

    vm.init();
  };
})();
