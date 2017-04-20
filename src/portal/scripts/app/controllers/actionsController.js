/**
 * Created by szhitenev on 22.08.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../core/services/logService');

    var instrumentSchemeService = require('../services/import/instrumentSchemeService');
    var eventsService = require('../services/eventsService');

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

        vm.importTransaction = function ($event) {
            $mdDialog.show({
                controller: 'ImportTransactionDialogController as vm',
                templateUrl: 'views/dialogs/import-transaction-dialog-view.html',
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

        vm.eventScheduleConfig = function ($event) {
            $mdDialog.show({
                controller: 'EventScheduleConfigDialogController as vm',
                templateUrl: 'views/dialogs/event-schedule-config-dialog-view.html',
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

        vm.openMapping = function ($event, mapItem) {
            $mdDialog.show({
                controller: 'EntityTypeMappingDialogController as vm',
                templateUrl: 'views/dialogs/entity-type-mapping-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    mapItem: mapItem
                }
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log("res", res.data);
                }
            });
        };

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

        vm.addPriceDownloadScheme = function ($event) {
            $mdDialog.show({
                controller: 'PriceDownloadSchemeAddDialogController as vm',
                templateUrl: 'views/dialogs/price-download-scheme-dialog-view.html',
                targetEvent: $event
            })
        };

        vm.checkForEvents = function (target) {
            eventsService.getList().then(function (data) {
                vm.eventsList = data.results;
                $scope.$apply();
                data.results.map(function (event) {
                    if (event.is_need_reaction == true) {
                        var eventActions = event.event_schedule_object['actions']; // button in event dialog
                        vm.openEventWindow(target, event.id, eventActions);
                    }
                });
            });
        };

        vm.openEventWindow = function ($event, eventId, eventActions) {
            $mdDialog.show({
                controller: 'EventDialogController as vm',
                templateUrl: 'views/dialogs/event-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        eventId: eventId,
                        eventActions: eventActions
                    }
                }
            })
        };

    }

}());