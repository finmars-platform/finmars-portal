/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var instrumentSchemeService = require('../../../services/instrumentSchemeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralInstrumentImportController', 'initialized');

        var vm = this;

        vm.readyStatus = {instrumentSchemes: false};
        vm.instrumentSchemes = [];

        vm.getList = function(){
            vm.readyStatus.instrumentSchemes = false;
            instrumentSchemeService.getList().then(function(data){
                vm.instrumentSchemes = data;
                vm.readyStatus.instrumentSchemes = true;
                $scope.$apply();
            });
        };

        vm.getList();

        vm.addScheme = function(event){
            $mdDialog.show({
                controller: 'InstrumentMappingDialogController as vm',
                templateUrl: 'views/dialogs/instrument-mapping-dialog-view.html',
                targetEvent: event,
                clickOutsideToClose: true
            }).then(function(res){
                if(res.status === 'agree') {

                }
            });
        }

    }

}());