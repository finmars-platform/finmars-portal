/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var instrumentSchemeService = require('../../../services/import/instrumentSchemeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralInstrumentImportController', 'initialized');

        var vm = this;

        vm.readyStatus = {instrumentSchemes: false};
        vm.instrumentSchemes = [];

        vm.getList = function () {
            vm.readyStatus.instrumentSchemes = false;
            instrumentSchemeService.getList().then(function (data) {
                vm.instrumentSchemes = data.results;
                vm.readyStatus.instrumentSchemes = true;
                $scope.$apply();
            });
        };

        vm.getList();

        vm.addScheme = function ($event) {
            $mdDialog.show({
                controller: 'InstrumentMappingAddDialogController as vm',
                templateUrl: 'views/dialogs/instrument-mapping-dialog-view.html',
                targetEvent: $event
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    instrumentSchemeService.create(res.data).then(function () {
                        vm.getList();
                    })
                }
            });
        };

        vm.editScheme = function ($event, item) {
            console.log('what?');

            $mdDialog.show({
                controller: 'InstrumentMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/instrument-mapping-dialog-view.html',
                targetEvent: $event,
                locals: {
                    schemeId: item.id
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
                    instrumentSchemeService.deleteByKey(item.id);
                    setTimeout(function () {
                        vm.getList();
                    }, 100)
                }
            });

        };

    }

}());