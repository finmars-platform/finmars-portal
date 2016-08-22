/**
 * Created by szhitenev on 22.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    module.exports = function ($scope, $mdDialog) {
        logService.controller('ActionsController', 'initialized');

        var vm = this;

        vm.importInstrument = function ($event) {
            $mdDialog.show({
                controller: 'ImportInstrumentDialogController as vm',
                templateUrl: 'views/dialogs/import-instrument-dialog-view.html',
                targetEvent: $event
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);

                }
            });
        };

        vm.fillPriceHistory = function ($event) {
            $mdDialog.show({
                controller: 'FillPriceHistoryDialogController as vm',
                templateUrl: 'views/dialogs/fill-price-history-dialog-view.html',
                targetEvent: $event
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);

                }
            });
        };

        vm.automatedUploads = function ($event) {
            $mdDialog.show({
                controller: 'AutomatedUploadsHistoryDialogController as vm',
                templateUrl: 'views/dialogs/automated-uploads-history-dialog-view.html',
                targetEvent: $event
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);

                }
            });
        };

    }

}());