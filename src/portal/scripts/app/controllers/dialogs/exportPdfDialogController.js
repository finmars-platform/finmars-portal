(function () {

    'use strict';

    var exportPdfService = require('../../services/exportPdfService')
    var rvRenderer = require('../../services/rv-renderer/rv.renderer');
    var uiService = require('../../services/uiService');

    var reportCopyHelper = require('../../helpers/reportCopyHelper');

    module.exports = function ($scope, $mdDialog, evDataService, evEventService, data) {

        var vm = this;

        vm.settings = {
            data: {}
        };

        vm.entityType = data.entityType;

        vm.zoomPercent = 100;

        vm.settings.layout = 'landscape';
        vm.settings.zoom = 1;
        vm.settings.margin = 4;

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

        vm.zoomOptions = [
            {
                value: 1,
                name: '100%'
            },
            {
                value: 0.75,
                name: '75%'
            },
            {
                value: 0.5,
                name: '50%'
            },
            {
                value: 0.25,
                name: '25%'
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

        vm.copyReport = function ($event) {
            console.log('copy report');
            reportCopyHelper.copy($event);
        };

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

            var elem = {};

            rvRenderer.render(elem, vm.settings.data.content, evDataService, evEventService);

            vm.settings.data.content = evDataService.getFlatList();

            vm.settings.zoom = parseInt(vm.zoomPercent, 10) / 100;

            console.log('export pdf content', vm.settings.data.content);
            console.log('vm.settings.zoom', vm.settings.zoom);

            uiService.getActiveListLayout(vm.entityType).then(function (res) {

                if (res.results.length) {

                    vm.settings.data.layoutName = res.results[0].name;

                } else {

                    vm.settings.data.layoutName = 'Default'

                }

                exportPdfService.generatePdf(vm.settings).then(function (blob) {

                    showFile(blob);

                    $mdDialog.cancel();

                })

            });

        }

    }

}());