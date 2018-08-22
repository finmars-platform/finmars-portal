/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var entitySchemeService = require('../../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var entityResolverService = require('../../services/entityResolverService');
    var uiRepository = require('../../repositories/uiRepository');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'ui.editlayout':
                    return "Edit Layouts";
                case 'ui.listlayout':
                    return "List Layouts";
                case 'csv_import.scheme':
                    return "CSV Import Schemes";
                case 'integrations.instrumentdownloadscheme':
                    return "Instrument Download Schemes";
                case 'integrations.pricedownloadscheme':
                    return "Price Download Schemes";
                default:
                    return "Unknown"
            }

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                return item.user_code
            }

            if (item.hasOwnProperty('name')) {
                return item.name
            }

        };

        vm.toggleActiveForChilds = function (item) {

            item.content.forEach(function (child) {
                child.active = item.active;
            })

        };

        vm.updateActiveForParent = function (parent) {

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;


        };

        function handleTransactionType(item) {
            return new Promise(function (resolve, reject) {
                resolve(entityResolverService.create('transaction-type', item))
            })

        }

        function handleListLayout(item) {
            return new Promise(function (resolve) {
                resolve(uiRepository.createListLayout(item))
            })
        }

        function handleEditLayout(item) {
            return new Promise(function (resolve) {
                resolve(uiRepository.createEditLayout(item))
            })
        }

        function handleCsvImportScheme(item) {
            return new Promise(function (resolve) {
                resolve(entitySchemeService.create(item))
            })
        }

        function handleInstrumentDownloadScheme(item) {
            return new Promise(function (resolve) {
                resolve(instrumentSchemeService.create(item))
            })
        }

        function handlePriceDownloadScheme(item) {
            return new Promise(function (resolve) {
                resolve(priceDownloadSchemeService.create(item))
            })
        }

        vm.agree = function () {

            var promises = [];

            vm.items.forEach(function (entityItem) {

                entityItem.content.forEach(function (item) {

                    if (item.active) {

                        switch (entityItem.entity) {

                            case 'transactions.transactiontype':
                                promises.push(handleTransactionType(item));
                                break;
                            case 'ui.editlayout':
                                promises.push(handleEditLayout(item));
                                break;
                            case 'ui.listlayout':
                                promises.push(handleListLayout(item));
                                break;
                            case 'csv_import.scheme':
                                promises.push(handleCsvImportScheme(item));
                                break;
                            case 'integrations.instrumentdownloadscheme':
                                promises.push(handleInstrumentDownloadScheme(item));
                                break;
                            case 'integrations.pricedownloadscheme':
                                promises.push(handlePriceDownloadScheme(item));
                                break;

                        }

                    }

                })

            });

            Promise.all(promises).then(function (data) {

                console.log("import success", data);

                $mdDialog.hide({status: 'agree', data: {}});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());