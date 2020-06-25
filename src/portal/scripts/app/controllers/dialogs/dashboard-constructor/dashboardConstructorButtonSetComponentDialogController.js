/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var transactionTypeService = require('../../../services/transactionTypeService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var complexImportSchemeService = require('../../../services/import/complexImportSchemeService');
    var pricingProcedureService = require('../../../services/pricing/pricingProcedureService');
    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService');
    var instrumentDownloadSchemeService = require('../../../services/import/instrumentDownloadSchemeService');

    var uiService = require('../../../services/uiService');

    module.exports = function dashboardConstructorButtonSetComponentDialogController($scope, $mdDialog, item, dataService, eventService) {

        var vm = this;

        vm.readyStatus = {
            transactionTypes: false,
            pricingProcedures: false,
            simpleImportSchemes: false,
            transactionImportSchemes: false,
            complexImportSchemes: false,
            dashboardLayouts: false,
            instrumentDownloadSchemes: false
        };

        if (item) {
            vm.item = item;
        } else {
            vm.item = {
                type: 'button_set',
                id: null, // should be generated before create
                name: '',
                settings: {
                    buttons: []
                }
            }
        }

        vm.componentsTypes = [];

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.addNewButton = function () {

            vm.item.settings.buttons.push(vm.newButton);
            vm.newButton = {}

        };

        vm.deleteButton = function ($event, button, $index) {

            vm.item.settings.buttons = vm.item.settings.buttons.filter(function (item, index) {

                return $index !== index;

            });

        };

        vm.applyGrid = function(){

            vm.item.settings.grid = {
                rows: []
            };

            for (var i = 0; i < vm.item.settings.rows; i = i + 1) {

                var row = {
                    items: []
                };

                for (var x = 0; x < vm.item.settings.columns; x = x + 1) {

                    var button = {};

                    row.items.push(button)

                }

                vm.item.settings.grid.rows.push(row)

            }

        };

        vm.actions = [

            {
                name: 'Book Transaction',
                value: 'book_transaction'
            },
            {
                name: 'Create New Record',
                value: 'create_new_record'
            },
            {
                name: 'Open Report',
                value: 'open_report'
            },
            {
                name: 'Open Data Viewer',
                value: 'open_data_viewer'
            },
            {
                name: 'Open Dashboard',
                value: 'open_dashboard'
            },
            {
                name: 'Run Valuation Procedure',
                value: 'run_valuation_procedure'
            },

            {
                name: 'Import Data From File',
                value: 'import_data_from_file'
            },
            {
                name: 'Import Transactions From File',
                value: 'import_transactions_from_file'
            },
            {
                name: 'Complex Import From File',
                value: 'complex_import_from_file'
            },
            {
                name: 'Download Instrument',
                value: 'download_instrument'
            },
            {
                name: 'Go To',
                value: 'go_to'
            }
        ];

        vm.targets = {
            'book_transaction': [],
            'create_new_record': [
                {
                    value: "portfolio",
                    name: "Portfolio"
                },
                {
                    value: "account",
                    name: "Account"
                },
                {
                    value: "instrument",
                    name: "Instrument"
                },
                {
                    value: "currency",
                    name: "Currency"
                },
                {
                    value: "currency-history",
                    name: "FX Rate"
                },
                {
                    value: "price-history",
                    name: "Price"
                },

                {
                    value: "responsible",
                    name: "Responsible"
                },
                {
                    value: "counterparty",
                    name: "Counterparty"
                },

                {
                    value: "strategy-1",
                    name: "Strategy 1"
                },

                {
                    value: "strategy-2",
                    name: "Strategy 2"
                },

                {
                    value: "strategy-3",
                    name: "Strategy 3"
                },

                {
                    value: "transaction-type",
                    name: "Transaction Type"
                },
                {
                    value: "account-type",
                    name: "Account Type"
                },
                {
                    value: "instrument-type",
                    name: "Instrument Type"
                },
                {
                    value: "pricing-policy",
                    name: "Pricing Policy"
                }

            ],
            'open_report': [],
            'open_data_viewer': [],
            'open_dashboard': [],
            'run_valuation_procedure': [],
            'import_data_from_file': [],
            'import_transactions_from_file': [],
            'complex_import_from_file': [],
            'download_instrument': [],
            'go_to': [
                {
                    value: '/',
                    name: 'Homepage'
                },
                {
                    value: '/dashboard',
                    name: 'Dashboard'
                },
                {
                    value: '/reports/balance',
                    name: 'Balance Report'
                },
                {
                    value: '/reports/profit-and-lost',
                    name: 'P&L Report'
                },
                {
                    value: '/reports/transaction',
                    name: 'Transaction Report'
                },
                {
                    value: '/reports/check-for-events',
                    name: 'Events'
                },
                {
                    value: '/data/portfolios',
                    name: 'Portfolios'
                },
                {
                    value: '/data/accounts',
                    name: 'Accounts'
                },
                {
                    value: '/data/instruments',
                    name: 'Instruments'
                },
                {
                    value: '/data/counterparties',
                    name: 'Counterparties'
                },
                {
                    value: '/data/responsibles',
                    name: 'Responsibles'
                },
                {
                    value: '/data/currency',
                    name: 'Currencies'
                },
                {
                    value: '/data/strategy/1',
                    name: 'Strategy 1'
                },
                {
                    value: '/data/strategy/2',
                    name: 'Strategy 2'
                },
                {
                    value: '/data/strategy/3',
                    name: 'Strategy 3'
                },
                {
                    value: '/data/complex-transactions',
                    name: 'Transactions'
                },
                {
                    value: '/data/transactions',
                    name: 'Base Transactions'
                },
                {
                    value: '/data/pricing',
                    name: 'Prices'
                },
                {
                    value: '/data/pricing-errors',
                    name: 'Prices Errors'
                },
                {
                    value: '/data/currencies',
                    name: 'FX Rates'
                },
                {
                    value: '/data/currencies-errors',
                    name: 'FX Rates Errors'
                },
                {
                    value: '/run-pricing-procedures',
                    name: 'Run Pricing'
                },
                {
                    value: '/import/simple-entity-import',
                    name: 'Import Data (From File)'
                },
                {
                    value: '/import/transaction-import',
                    name: 'Import Transactions (From File)'
                },
                {
                    value: '/import/complex-import',
                    name: 'Import Data and Transactions (From File)'
                },
                {
                    value: '/import/instrument-import',
                    name: 'Import Instrument (From Provider)'
                },
                {
                    value: '/import/prices-import',
                    name: 'Import Prices/FX (From Provider)'
                },
                {
                    value: '/import/mapping-tables-import',
                    name: 'Mapping Tables'
                },
                {
                    value: '/forum',
                    name: 'Forum'
                }

            ]
        };

        vm.agree = function () {

            if (vm.item.id) {

                /*vm.componentsTypes = vm.componentsTypes.map(function (item) {

                    if (item.id === vm.item.id) {
                        return vm.item
                    }

                    return item;
                })*/
                dataService.updateComponentById(vm.item);

            } else {

                var pattern = new Date().getTime() + '_' + vm.componentsTypes.length;

                vm.item.id = dataService.___generateId(pattern);

                vm.componentsTypes.push(vm.item);

            }

            dataService.setComponents(vm.componentsTypes);

            $mdDialog.hide({status: 'agree'});
        };

        vm.getTransactionTypes = function(){

            vm.readyStatus.transactionTypes = false;

            transactionTypeService.getListLight({pageSize: 1000}).then(function (data) {

                vm.targets['book_transaction'] = data.results.map(function (item) {

                    return {
                        value: item.user_code,
                        name: item.name
                    }

                });

                vm.readyStatus.transactionTypes = true;

                $scope.$apply();

            })

        };

        vm.getPricingProcedures = function(){

            vm.readyStatus.pricingProcedures = false;

            pricingProcedureService.getList().then(function (data) {

                vm.targets['run_valuation_procedure'] = data.results.map(function (item) {

                    return {
                        value: item.user_code,
                        name: item.name
                    }

                });

                vm.readyStatus.pricingProcedures = true;

                $scope.$apply();

            })

        };

        vm.getSimpleImportSchemes = function(){

            vm.readyStatus.simpleImportSchemes = false;

            csvImportSchemeService.getListLight().then(function (data) {

                vm.targets['import_data_from_file'] = data.results.map(function (item) {

                    return {
                        value: item.scheme_name,
                        name: item.scheme_name
                    }

                });

                vm.readyStatus.simpleImportSchemes = true;

                $scope.$apply();


            })

        };

        vm.getTransactionImportSchemes = function(){

            vm.readyStatus.transactionImportSchemes = false;

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.targets['import_transactions_from_file'] = data.results.map(function (item) {

                    return {
                        value: item.scheme_name,
                        name: item.scheme_name
                    }

                });

                vm.readyStatus.transactionImportSchemes = true;

                $scope.$apply();


            })

        };

        vm.getComplexImportSchemes = function(){

            vm.readyStatus.complexImportSchemes = false;

            complexImportSchemeService.getList().then(function (data) {

                vm.targets['complex_import_from_file'] = data.results.map(function (item) {

                    return {
                        value: item.scheme_name,
                        name: item.scheme_name
                    }

                });

                vm.readyStatus.complexImportSchemes = true;

                $scope.$apply();


            })

        };

        vm.getDashboardLayouts = function(){

            vm.readyStatus.dashboardLayouts = false;

            uiService.getDashboardLayoutList().then(function (data) {

                vm.targets['open_dashboard'] = data.results.map(function (item) {

                    return {
                        value: item.user_code,
                        name: item.name
                    }

                });

                vm.readyStatus.dashboardLayouts = true;

                $scope.$apply();

            })

        };

        vm.getInstrumentDownloadSchemes = function(){

            vm.readyStatus.instrumentDownloadSchemes = false;

            instrumentDownloadSchemeService.getList().then(function (data) {

                vm.targets['download_instrument'] = data.results.map(function (item) {

                    return {
                        value: item.scheme_name,
                        name: item.scheme_name
                    }

                });

                vm.readyStatus.instrumentDownloadSchemes = true;

                $scope.$apply();


            })

        };

        vm.checkReadyStatus = function(){

          var result = true;

          Object.keys(vm.readyStatus).forEach(function (key) {

              if (!vm.readyStatus[key]) {
                  result = false;
              }

          });

          return result

        };

        vm.init = function () {

            vm.getTransactionTypes();
            vm.getPricingProcedures();
            vm.getSimpleImportSchemes();
            vm.getTransactionImportSchemes();
            vm.getComplexImportSchemes();
            vm.getDashboardLayouts();
            vm.getInstrumentDownloadSchemes();

            console.log('dataService', dataService);

            vm.componentsTypes = dataService.getComponents()

        };

        vm.init()
    }

}());