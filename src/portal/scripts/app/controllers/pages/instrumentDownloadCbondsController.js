/**
 * Created by szhitenev on 31.08.2021.
 */
(function () {

    'use strict';


    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService').default;
    var toastNotificationService = require('../../../../../core/services/toastNotificationService').default;

    module.exports = function instrumentDownloadCbondsController($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            processing: false
        };
        vm.dataIsImported = false;
        vm.resultData = {}

        vm.config = {
            user_code: "",
            instrument_type_user_code: "bond",
            mode: 1
        };

        vm.load = function ($event) {

            vm.readyStatus.processing = true;

            vm.resultData = {};

            vm.config.name = vm.config.user_code; // TODO need refactor on backend side
            //vm.config.task = 81;
            importInstrumentCbondsService.download(vm.config).then(function (data) {

                console.log('importInstrumentCbondsService.data', data);

                vm.resultData = data;

                vm.readyStatus.processing = false;

                toastNotificationService.success('Instrument ' + vm.config.user_code + ' was imported')

                $scope.$apply()


            }).catch(function (reason) {

                console.log('reason %s', reason);

                $mdDialog.show({
                    controller: 'WarningDialogController as vm',
                    templateUrl: 'views/dialogs/warning-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    locals: {
                        warning: {
                            title: 'Unhandle Exception',
                            description: JSON.stringify(reason, null, 4)
                        }
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true,
                    multiple: true
                })

                vm.readyStatus.processing = false;


                $scope.$apply()

            })
        };


        vm.init = function () {

        };

        vm.init()

    };

}());