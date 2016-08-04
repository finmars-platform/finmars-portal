/**
 * Created by szhitenev on 04.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var importInstrumentService = require('../../services/importInstrumentService');

    module.exports = function ($scope) {

        logService.controller('SettingsBloomberImportInstrumentController', 'initialized');

        var vm = this;

        vm.readyStatus = {content: false};

        importInstrumentService.getInstrumentMappingList().then(function (data) {
            vm.mapping = data.results;
            vm.readyStatus.content = true;
            $scope.$apply()
        });


    };

}());