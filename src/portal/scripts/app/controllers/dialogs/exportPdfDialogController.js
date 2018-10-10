(function () {

    'use strict';

    var exportPdfService = require('../../services/exportPdfService')

    module.exports = function ($scope, $mdDialog, evDataService) {

        var vm = this;

        vm.settings = {
            data: {}
        };

        vm.settings.layout = 'landscape';

        vm.settings.data.groups = evDataService.getGroups();
        vm.settings.data.columns = evDataService.getColumns();
        vm.settings.data.content = evDataService.getFlatList();

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

        function showFile(blob) {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([blob], {type: "application/pdf"})

            console.log(newBlob)

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
            var link = document.createElement('a');
            link.href = data;
            link.download = "report.pdf";
            link.click();

        }

        vm.agree = function () {

            console.log('vm.settings', vm.settings);

            vm.settings.data.reportOptions = JSON.parse(JSON.stringify(evDataService.getReportOptions()));

            delete vm.settings.data.reportOptions.items;
            delete vm.settings.data.reportOptions.item_complex_transactions;
            delete vm.settings.data.reportOptions.item_counterparties;
            delete vm.settings.data.reportOptions.item_responsibles;
            delete vm.settings.data.reportOptions.item_strategies3;
            delete vm.settings.data.reportOptions.item_strategies2;
            delete vm.settings.data.reportOptions.item_strategies1;
            delete vm.settings.data.reportOptions.item_portfolios;
            delete vm.settings.data.reportOptions.item_instruments;
            delete vm.settings.data.reportOptions.item_instrument_pricings;
            delete vm.settings.data.reportOptions.item_instrument_accruals;
            delete vm.settings.data.reportOptions.item_currency_fx_rates;
            delete vm.settings.data.reportOptions.item_currencies;
            delete vm.settings.data.reportOptions.item_accounts;

            exportPdfService.generatePdf(vm.settings).then(function (blob) {

                showFile(blob);


                $mdDialog.cancel();
            })

        }

    }

}());