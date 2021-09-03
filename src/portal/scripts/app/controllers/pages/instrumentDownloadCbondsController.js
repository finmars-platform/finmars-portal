/**
 * Created by szhitenev on 31.08.2021.
 */
(function () {

    'use strict';


    var importInstrumentCbondsService = require('../../services/import/importInstrumentCbondsService');


    module.exports = function instrumentDownloadCbondsController($scope, $mdDialog) {

        var vm = this;

        vm.readyStatus = {
            processing: false
        };
        vm.dataIsImported = false;

        vm.config = {
            instrument_code: "",
            mode: 1
        };

        vm.load = function ($event) {

            vm.readyStatus.processing = true;
            //vm.config.task = 81;
            importInstrumentCbondsService.download(vm.config).then(function (data) {

                vm.readyStatus.processing = false;

                $scope.$apply()


            }).catch(function (reason) {

                vm.readyStatus.processing = false;


                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: "An error occurred. Please try again later"
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

                $scope.$apply()

            })
        };


        vm.init = function () {

        };

        vm.init()

    };

}());