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

        logService.controller('InstrumentMappingDialogController', 'initialized');

        var vm = this;

        vm.readyStatus = {mapping: false, processing: false};
        vm.dataIsImported = false;

        vm.config = {
            instrument_code: "USP16394AG62 Corp",
            mode: 1,
            provider: 1,
            scheme: 19 // remove that
        };

        var providerId = 1; //TODO HARD REFACTOR CODE BLOOMBERG PROVIDER

        instrumentSchemeService.getList(providerId).then(function (data) {
            vm.instrumentSchemes = data.results;
            vm.readyStatus.mapping = true;
            $scope.$apply();
        });

        vm.load = function () {
            vm.readyStatus.processing = true;
            importInstrumentService.startImport(vm.config).then(function (data) {
                console.log('data', data);
                vm.config = data;
                if (data.mode == 1 && data.instrument !== null) {
                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    vm.mappedFields = [];

                    var keys = Object.keys(vm.config["task_object"]["result_object"]);
                    var i;
                    for (i = 0; i < keys.length; i = i + 1) {
                        vm.mappedFields.push({
                            key: keys[i],
                            value: vm.config["task_object"]["result_object"][keys[i]]
                        })
                    }
                    $scope.$apply();

                } else {
                    setTimeout(function () {
                        vm.load();
                    }, 1000)

                }

            })
        };

        vm.openEditMapping = function ($event) {
            $mdDialog.show({
                controller: 'InstrumentMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/instrument-mapping-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    instrumentSchemeService.update(item.id, res.data).then(function () {
                        vm.getList();
                        $scope.$apply();
                    })
                }
            });
        };

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