/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var dataProvidersService = require('../../../services/import/dataProvidersService');

    module.exports = function ($scope) {

        logService.controller('SettingsGeneralDataProvidersController', 'initialized');

        var vm = this;

        vm.dataProviders = [];

        vm.readyStatus = {dataProviders: false};

        dataProvidersService.getList().then(function(data){
            vm.dataProviders = data;
            vm.readyStatus.dataProviders = true;
            $scope.$apply();
        });

        $mdDialog.show({
            controller: 'WarningDialogController as vm',
            templateUrl: 'views/warning-dialog-view.html',
            targetEvent: $event,
            clickOutsideToClose: false,
            locals: {
                warning: {
                    title: 'Bloomberg certificate import',
                    description: 'Error'
                }
            }
        });

        $mdDialog.show({
            controller: 'SuccessDialogController as vm',
            templateUrl: 'views/dialogs/success-dialog-view.html',
            targetEvent: $event,
            autoWrap: true,
            locals: {
                success: {
                    title: "Bloomberg certificate import",
                    description: "Success"
                }
            }

        });

    }

}());