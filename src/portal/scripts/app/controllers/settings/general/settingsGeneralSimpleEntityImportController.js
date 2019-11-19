/**
 * Created by mevstratov on 02.05.2019.
 */
(function () {

    var logService = require('../../../../../../core/services/logService');

    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');

    module.exports = function ($scope, $mdDialog) {

        logService.controller('SettingsGeneralSimpleEntityImportController', 'initialized');

        var vm = this;

        vm.readyStatus = {entitySchemes: false};
        vm.entitySchemes = [];

        vm.getList = function () {
            vm.readyStatus.entitySchemes = false;
            csvImportSchemeService.getList().then(function (data) {
                console.log("simple entity data", data);
                vm.entitySchemes = data.results;
                vm.readyStatus.entitySchemes = true;
                $scope.$apply();
            });
        };

        vm.getList();

        vm.addScheme = function ($event) {
            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-create-dialog-view.html',
                targetEvent: $event,
                locals: {
                    data: {}
                }
            }).then(function (res) {
                if (res.res === 'agree') {
                    vm.getList();
                }
            });
        };

        vm.editScheme = function ($event, item) {
            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-edit-dialog-view.html',
                targetEvent: $event,
                locals: {
                    schemeId: item.id
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    /*csvImportSchemeService.update(item.id, res.data).then(function () {
                        vm.getList();
                        $scope.$apply();
                    })*/
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
                        description: 'Are you sure to delete ' + item['scheme_name']
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                    csvImportSchemeService.deleteByKey(item.id).then(function () {
                        /*setTimeout(function () {
                            vm.getList();
                        }, 100)*/
                        vm.getList();
                    });
                }
            });

        };

    }

}());