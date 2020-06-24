(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents');
    var dashboardComponentStatuses = require('../../services/dashboard/dashboardComponentStatuses');

    var transactionTypeService = require('../../services/transactionTypeService');
    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var transactionImportSchemeService = require('../../services/import/transactionImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');
    var pricingProcedureService = require('../../services/pricing/pricingProcedureService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    module.exports = function dashboardButtonSetDirective($mdDialog, $state) {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/dashboard/dashboard-button-set-view.html',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardDataService: '=',
                dashboardEventService: '='
            },
            link: function (scope, elem, attr) {


                scope.initEventListeners = function () {

                    scope.dashboardEventService.addEventListener(dashboardEvents.COMPONENT_STATUS_CHANGE, function () {

                        var status = scope.dashboardDataService.getComponentStatus(scope.item.data.id);

                        if (status === dashboardComponentStatuses.START) { // No actual calculation happens, so set to Active state
                            scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.ACTIVE);
                            scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);
                        }

                    });

                };

                scope.init = function () {

                    scope.componentData = scope.dashboardDataService.getComponentById(scope.item.data.id);

                    scope.rows = scope.componentData.settings.rows;
                    scope.columns = scope.componentData.settings.columns;
                    scope.grid = scope.componentData.settings.grid;

                    console.log('scope.grid', scope.grid);

                    scope.dashboardDataService.setComponentStatus(scope.item.data.id, dashboardComponentStatuses.INIT);
                    scope.dashboardEventService.dispatchEvent(dashboardEvents.COMPONENT_STATUS_CHANGE);

                    scope.initEventListeners();

                };

                scope.handleAction = function ($event, item) {

                    console.log('handleAction $event', $event);
                    console.log('handleAction item', item);

                    if (item.action === 'book_transaction') {

                        var contextData = {};

                        if (item.target) {

                            transactionTypeService.getListLight({
                                filters: {
                                    user_code: item.target
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var transactionType = data.results[0];

                                    $mdDialog.show({
                                        controller: 'ComplexTransactionAddDialogController as vm',
                                        templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                                        parent: angular.element(document.body),
                                        targetEvent: $event,
                                        locals: {
                                            entityType: 'complex-transaction',
                                            entity: {},
                                            data: {
                                                contextData: contextData,
                                                transaction_type: transactionType.id
                                            }
                                        }
                                    }).then(function (res) {


                                    })

                                } else {

                                    toastNotificationService.error('Transaction Type is not found');

                                    $mdDialog.show({
                                        controller: 'ComplexTransactionAddDialogController as vm',
                                        templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                                        parent: angular.element(document.body),
                                        targetEvent: $event,
                                        locals: {
                                            entityType: 'complex-transaction',
                                            entity: {},
                                            data: {}

                                        }
                                    })

                                }

                            })

                        } else {

                            $mdDialog.show({
                                controller: 'ComplexTransactionAddDialogController as vm',
                                templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: $event,
                                locals: {
                                    entityType: 'complex-transaction',
                                    entity: {},
                                    data: {}

                                }
                            })

                        }

                    }

                    if (item.action === 'create_new_record') {

                        $mdDialog.show({
                            controller: 'EntityViewerAddDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-add-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            locals: {
                                entityType: item.target,
                                entity: {}
                            }
                        }).then(function (res) {


                        })

                    }

                    if (item.action === 'run_valuation_procedure') {

                        pricingProcedureService.getList({
                            filters: {
                                user_code: item.target
                            }
                        }).then(function (data) {

                            if (data.results.length) {

                                var procedure = data.results[0];

                                pricingProcedureService.runProcedure(procedure.id, procedure).then(function (data) {

                                    $mdDialog.show({
                                        controller: 'InfoDialogController as vm',
                                        templateUrl: 'views/info-dialog-view.html',
                                        parent: angular.element(document.body),
                                        targetEvent: $event,
                                        clickOutsideToClose: false,
                                        preserveScope: true,
                                        autoWrap: true,
                                        skipHide: true,
                                        multiple: true,
                                        locals: {
                                            info: {
                                                title: 'Success',
                                                description: "Procedure is being processed"
                                            }
                                        }
                                    });

                                })

                            } else {
                                toastNotificationService.error('Pricing Procedure is not found');
                            }


                        })

                    }

                    if (item.action === 'import_data_from_file') {

                        if (item.target) {

                            csvImportSchemeService.getListLight({
                                filters: {
                                    scheme_name: item.target
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var scheme = data.results[0];

                                    $mdDialog.show({
                                        controller: 'SimpleEntityImportDialogController as vm',
                                        templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-dialog-view.html',
                                        targetEvent: $event,
                                        multiple: true,
                                        locals: {
                                            data: {
                                                scheme: scheme
                                            }
                                        }
                                    })


                                } else {

                                    toastNotificationService.error('Simple Import Scheme is not found');

                                    $mdDialog.show({
                                        controller: 'SimpleEntityImportDialogController as vm',
                                        templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-dialog-view.html',
                                        targetEvent: $event,
                                        multiple: true,
                                        locals: {
                                            data: {}
                                        }
                                    })
                                }
                            })

                        } else {

                            $mdDialog.show({
                                controller: 'SimpleEntityImportDialogController as vm',
                                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-dialog-view.html',
                                targetEvent: $event,
                                multiple: true,
                                locals: {
                                    data: {}
                                }
                            })

                        }


                    }

                    if (item.action === 'import_transactions_from_file') {

                        if (item.target) {

                            transactionImportSchemeService.getListLight({
                                filters: {
                                    scheme_name: item.target
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var scheme = data.results[0];

                                    $mdDialog.show({
                                        controller: 'TransactionImportDialogController as vm',
                                        templateUrl: 'views/dialogs/transaction-import/transaction-import-dialog-view.html',
                                        targetEvent: $event,
                                        locals: {
                                            data: {
                                                scheme: scheme
                                            }
                                        }
                                    })


                                } else {

                                    toastNotificationService.error('Transaction Import Scheme is not found');

                                    $mdDialog.show({
                                        controller: 'TransactionImportDialogController as vm',
                                        templateUrl: 'views/dialogs/transaction-import/transaction-import-dialog-view.html',
                                        targetEvent: $event,
                                        locals: {
                                            data: {}
                                        }
                                    })

                                }
                            })


                        } else {

                            $mdDialog.show({
                                controller: 'TransactionImportDialogController as vm',
                                templateUrl: 'views/dialogs/transaction-import/transaction-import-dialog-view.html',
                                targetEvent: $event,
                                locals: {
                                    data: {}
                                }
                            })

                        }
                    }

                    if (item.action === 'complex_import_from_file') {

                        if (item.target) {

                            complexImportSchemeService.getList({
                                filters: {
                                    scheme_name: item.target
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var scheme = data.results[0];

                                    $mdDialog.show({
                                        controller: 'ComplexImportDialogController as vm',
                                        templateUrl: 'views/dialogs/complex-import/complex-import-dialog-view.html',
                                        targetEvent: $event,
                                        multiple: true,
                                        locals: {
                                            data: {
                                                scheme: scheme
                                            }
                                        }
                                    })


                                } else {

                                    toastNotificationService.error('Complex Import Scheme is not found');

                                    $mdDialog.show({
                                        controller: 'ComplexImportDialogController as vm',
                                        templateUrl: 'views/dialogs/complex-import/complex-import-dialog-view.html',
                                        targetEvent: $event,
                                        multiple: true,
                                        locals: {
                                            data: {}
                                        }
                                    })

                                }
                            })


                        } else {

                            $mdDialog.show({
                                controller: 'ComplexImportDialogController as vm',
                                templateUrl: 'views/dialogs/complex-import/complex-import-dialog-view.html',
                                targetEvent: $event,
                                multiple: true,
                                locals: {
                                    data: {}
                                }
                            })

                        }

                    }

                    if (item.action === 'open_dashboard') {

                        if (item.target) {

                            $state.go('app.dashboard', {
                                layoutUserCode: item.target
                            }, { reload: 'app' })

                        } else {

                            toastNotificationService.error('Dashboard Layout is not set');

                        }

                    }

                };


                scope.init()


            }
        }
    }
}());