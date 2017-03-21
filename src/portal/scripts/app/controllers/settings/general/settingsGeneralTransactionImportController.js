/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var transactionSchemeService = require('../../../services/import/transactionSchemeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralTransactionImportController', 'initialized');

        var vm = this;

        vm.readyStatus = {instrumentSchemes: false};
        vm.instrumentSchemes = [];

        vm.getList = function () {
            vm.readyStatus.instrumentSchemes = false;
            transactionSchemeService.getList().then(function (data) {
                vm.instrumentSchemes = data.results;
                vm.readyStatus.instrumentSchemes = true;
                $scope.$apply();
            });
        };

        vm.getList();

        vm.addScheme = function ($event) {
            $mdDialog.show({
                controller: 'TransactionMappingAddDialogController as vm',
                templateUrl: 'views/dialogs/transaction-mapping-dialog-view.html',
                targetEvent: $event
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    vm.getList();
                }
            });
        };

        vm.editScheme = function ($event, item) {
            console.log('what?');

            $mdDialog.show({
                controller: 'TransactionMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/transaction-mapping-dialog-view.html',
                targetEvent: $event,
                locals: {
                    schemeId: item.id
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    transactionSchemeService.update(item.id, res.data).then(function () {
                        vm.getList();
                        $scope.$apply();
                    })
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
                        description: 'Are you sure to delete ' + item['scheme_name']
                    }
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    transactionSchemeService.deleteByKey(item.id);
                    setTimeout(function () {
                        vm.getList();
                    }, 100)
                }
            });

        };

    }

}());