/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var dataProvidersService = require('../../services/import/dataProvidersService');
    var scheduleService = require('../../services/import/scheduleService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var instrumentService = require('../../services/instrumentService');

    var importInstrumentService = require('../../services/import/importInstrumentService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('AutomatedUploadsHistoryDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {timetable: false};
        vm.readyStatus.timetable = true;



        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {
            instrumentService.create(vm.config.instrument).then(function () {
                $mdDialog.hide({status: 'agree'});
            });

        };

    };

}());