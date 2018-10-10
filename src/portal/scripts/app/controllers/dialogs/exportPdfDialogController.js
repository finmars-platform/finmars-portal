(function () {

    'use strict';

    var exportPdfService = require('../../services/exportPdfService')

    module.exports = function ($scope, $mdDialog, evDataService) {

        var vm = this;

        vm.settings = {};

        vm.settings.layout = 'landscape';

        vm.settings.columns = evDataService.getColumns();
        vm.settings.content = evDataService.getFlatList();

        vm.layouts = [
            {

                value: 'portrait',
                name: 'Portrait'

            },
            {
                value: 'landscape',
                name: ' Landscape'
            }
        ];

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.agree = function () {

            console.log('vm.settings', vm.settings);

            vm.settings.reportOptions = JSON.parse(JSON.stringify(scope.evDataService.getReportOptions()));

            delete vm.settings.reportOptions.items;
            delete vm.settings.reportOptions.item_complex_transactions;
            delete vm.settings.reportOptions.item_counterparties;
            delete vm.settings.reportOptions.item_responsibles;
            delete vm.settings.reportOptions.item_strategies3;
            delete vm.settings.reportOptions.item_strategies2;
            delete vm.settings.reportOptions.item_strategies1;
            delete vm.settings.reportOptions.item_portfolios;
            delete vm.settings.reportOptions.item_instruments;
            delete vm.settings.reportOptions.item_instrument_pricings;
            delete vm.settings.reportOptions.item_instrument_accruals;
            delete vm.settings.reportOptions.item_currency_fx_rates;
            delete vm.settings.reportOptions.item_currencies;
            delete vm.settings.reportOptions.item_accounts;

            exportPdfService.generatePdf(vm.settings).then(function () {
                $mdDialog.cancel();
            })

        }

    }

}());