/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService');

    module.exports = function settingsGeneralTransactionImportController($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {schemes: false};
        vm.schemes = [];

        vm.getList = function () {

            vm.readyStatus.schemes = false;

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.schemes = data.results;
                vm.readyStatus.schemes = true;
                $scope.$apply();

            });

        };

        vm.addScheme = function ($event) {
            $mdDialog.show({
                controller: 'TransactionImportSchemeAddDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {

                    }
                }
            }).then(function (res) {

                if (res.status === 'agree') {
                    console.log('res', res.data);
                    vm.getList();
                }
            });
        };

        vm.editScheme = function ($event, item) {

            $mdDialog.show({
                controller: 'TransactionImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-dialog-view.html',
                targetEvent: $event,
                locals: {
                    schemeId: item.id
                }
            }).then(function (res) {

                if (res && res.status === 'agree') {

                    vm.getList();

                }

            });

        };

        vm.deleteScheme = function ($event, item) {

            $mdDialog.show({
                controller: 'WarningDialogController as vm',
                templateUrl: 'views/warning-dialog-view.html',
                targetEvent: $event,
                locals: {
                    warning: {
                        title: 'Warning!',
                        description: 'Are you sure to delete ' + item.scheme_name
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {

                if (res.status === 'agree') {

                    transactionImportSchemeService.deleteByKey(item.id).then(function () {

                        vm.getList();

                    })

                }

            });

        };

        vm.init = function () {

            vm.getList();

        };

        vm.init();

    }

}());