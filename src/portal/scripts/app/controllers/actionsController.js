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

        vm.importEntity = function ($event) {
            $mdDialog.show({
                controller: 'SimpleEntityImportDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import-dialog-view.html',
                targetEvent: $event,
                multiple: true
            }).then(function (res) {
                if (res.status === 'agree') {
                    console.log('res', res.data);
                }
            });
        };

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

        vm.checkForEvents = function ($event) {

            $mdDialog.show({
                controller: 'CheckEventsDialogController as vm',
                templateUrl: 'views/dialogs/events/check-events-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            })

        };

        vm.defaultPricingConfig = function ($event) {

            $mdDialog.show({
                controller: 'DefaultPricingConfigDialogController as vm',
                templateUrl: 'views/dialogs/default-pricing-config-dialog-view.html',
                targetEvent: $event,
                autoWrap: true
            })

        };

        vm.notificationsSettings = function ($event) {
          $mdDialog.show({
              controller: 'ActionsNotificationsSettingsDialogController as vm',
              templateUrl: 'views/dialogs/actions-notifications-settings-dialog-view.html',
              targetEvent: $event,
              autoWrap: true
          }).then(function (data) {
              if (data.status === 'success') {

                  $mdDialog.show({
                      controller: 'SuccessDialogController as vm',
                      templateUrl: 'views/dialogs/success-dialog-view.html',
                      targetEvent: $event,
                      autoWrap: true,
                      locals: {
                          success: {
                              title: "",
                              description: "Changes saved"
                          }
                      }

                  });

              } else {

                  $mdDialog.show({
                      controller: 'WarningDialogController as vm',
                      templateUrl: 'views/warning-dialog-view.html',
                      targetEvent: $event,
                      clickOutsideToClose: false,
                      locals: {
                          warning: {
                              title: 'Error',
                              description: 'Failed to save changes'
                          }
                      }
                  });

              }
          });

        };
    }

}());