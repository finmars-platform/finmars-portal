/**
 * Created by szhitenev on 31.01.2020.
 */
(function () {
  "use strict";

  // var transactionFileProcedureService = require("../../services/pricing/transactionFileProcedureService");
  var transactionFileProcedureService = require("../../services/transaction/transactionFileProcedureService");
  var transactionFileRepository = require("../../repositories/transaction/transactionFileRepository");

  module.exports = function ($scope, $mdDialog) {
    var vm = this;

    vm.procedures = [];

    vm.readyStatus = { procedures: false };

    vm.getList = function () {
      transactionFileProcedureService.getList().then(function (data) {
        console.log(data, "panov");
        vm.procedures = data.results;

        vm.readyStatus.procedures = true;

        $scope.$apply();
      });
    };

    vm.editProcedure = function ($event, item) {
      $mdDialog
        .show({
          controller: "TransactionFileEditDialogController as vm",
          templateUrl:
            "views/dialogs/transaction/transaction-file-edit-dialog-view.html",
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: false,
          preserveScope: true,
          autoWrap: true,
          skipHide: true,
          multiple: true,
          locals: {
            data: {
              item: item,
            },
          },
        })
        .then(function (res) {
          if (res.status === "agree") {
            vm.getList();
          }
        });
    };

    vm.deleteProcedure = function ($event, item) {
      $mdDialog
        .show({
          controller: "WarningDialogController as vm",
          templateUrl: "views/warning-dialog-view.html",
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: false,
          locals: {
            warning: {
              title: "Warning",
              description:
                "Are you sure you want to delete Transaction File procedure <b>" +
                item.name +
                "</b>?",
            },
          },
          preserveScope: true,
          autoWrap: true,
          skipHide: true,
          multiple: true,
        })
        .then(function (res) {
          if (res.status === "agree") {
            transactionFileProcedureService
              .deleteByKey(item.id)
              .then(function (data) {
                vm.getList();
              });
          }
        });
    };

    vm.addProcedure = function ($event) {
      $mdDialog
        .show({
          controller: "TransactionFileAddDialogController as vm",
          templateUrl:
            "views/dialogs/transaction/transaction-file-add-dialog-view.html",
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: false,
          preserveScope: true,
          autoWrap: true,
          skipHide: true,
          multiple: true,
          locals: {
            data: {},
          },
        })
        .then(function (res) {
          if (res.status === "agree") {
            vm.getList();
          }
        });
    };

    vm.init = function () {
      vm.getList();
    };

    vm.init();
  };
})();
