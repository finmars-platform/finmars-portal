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
        })

    }

}());