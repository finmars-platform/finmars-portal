/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var dataProvidersService = require('../../../services/import/dataProvidersService');

    module.exports = function ($scope, $stateParams) {

        logService.controller('SettingsGeneralDataProvidersConfigController', 'initialized');

        var vm = this;

        vm.providerId = $stateParams.dataProviderId;

        vm.provider = [];

        vm.readyStatus = {provider: false};

        dataProvidersService.getConfig(vm.providerId).then(function(data){
            vm.provider = data;
            vm.readyStatus.provider = true;
            $scope.$apply();
        })


    }

}());