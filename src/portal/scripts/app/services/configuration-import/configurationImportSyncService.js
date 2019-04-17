/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var configurationImportGetService = require('./configurationImportGetService');
    var configurationImportMapService = require('./configurationImportMapService');

    var syncTransactionType = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            if (item.hasOwnProperty('___group__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___group__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type-group', cacheContainer).then(function (data) {

                        item.group = data.id;

                        // console.log('___group__user_code', user_code);

                        resolveRelation(item)

                    });

                }));

            }

            promises.push(configurationImportMapService.mapTransactionTypeInputsRelations(item, cacheContainer));

            promises.push(configurationImportMapService.mapTransactionTypeActionsRelations(item, cacheContainer));

            Promise.all(promises).then(function (data) {

                resolve(item);

            })

        })


    };

    var syncInstrumentType = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            configurationImportMapService.mapFieldsInInstrumentType(item).then(function (updatedItem) {

                console.log('syncInstrumentType.updatedItem', updatedItem);

                resolve(updatedItem)

            });

        })

    };

    var syncCurrency = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            var code;
            var code_type;
            var entity;
            var item_key;

            if (item.hasOwnProperty('___price_download_scheme__scheme_name')) {

                code = item['___price_download_scheme__scheme_name'];
                code_type = 'scheme_name';
                entity = 'price-download-scheme';
                item_key = 'price_download_scheme';

                promises.push(configurationImportMapService.mapRelation(item, item_key, entity, code_type, code, cacheContainer))

            }

            if (item.hasOwnProperty('___daily_pricing_model__system_code')) {

                code = item['___daily_pricing_model__system_code'];
                code_type = 'system_code';
                entity = 'daily-pricing-model';
                item_key = 'daily_pricing_model';

                promises.push(configurationImportMapService.mapRelation(item, item_key, entity, code_type, code, cacheContainer))

            }


            Promise.all(promises).then(function (data) {

                resolve(item)
            });


        })

    };

    var syncEditLayout = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            resolve(configurationImportMapService.mapEditLayout(item));

        })

    };

    var syncListLayout = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {
            resolve(configurationImportMapService.mapListLayout(item, cacheContainer));
        })

    };

    var syncReportLayout = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {
            resolve(configurationImportMapService.mapListLayout(item, cacheContainer));
        })

    };

    var syncInstrumentDownloadScheme = function (item, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            if (item.hasOwnProperty('___price_download_scheme__scheme_name')) {

                var code = item['___price_download_scheme__scheme_name'];
                var code_type = 'scheme_name';
                var entity = 'price-download-scheme';
                var item_key = 'price_download_scheme';

                promises.push(configurationImportMapService.mapRelation(item, item_key, entity, code_type, code, cacheContainer))

            }

            Promise.all(promises).then(function (data) {

                resolve(data)
            });


        })

    };

    var syncComplexImportScheme = function (item, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            item.actions.forEach(function (actionItem) {

                if (actionItem.csv_import_scheme) {

                    if (actionItem.csv_import_scheme.hasOwnProperty('___csv_import_scheme__scheme_name')) {

                        var code = actionItem.csv_import_scheme['___csv_import_scheme__scheme_name'];
                        var code_type = 'scheme_name';
                        var entity = 'csv-import-scheme';
                        var item_key = 'csv_import_scheme';

                        promises.push(configurationImportMapService.mapRelation(actionItem.csv_import_scheme, item_key, entity, code_type, code, cacheContainer))

                    }

                }

                if (actionItem.complex_transaction_import_scheme) {

                    if (actionItem.complex_transaction_import_scheme.hasOwnProperty('___complex_transaction_import_scheme__scheme_name')) {

                        var code = actionItem.complex_transaction_import_scheme['___complex_transaction_import_scheme__scheme_name'];
                        var code_type = 'scheme_name';
                        var entity = 'complex-transaction-import-scheme';
                        var item_key = 'complex_transaction_import_scheme';

                        promises.push(configurationImportMapService.mapRelation(actionItem.complex_transaction_import_scheme, item_key, entity, code_type, code, cacheContainer))

                    }

                }

            });

            Promise.all(promises).then(function (data) {

                resolve(data)
            });


        })

    };

    var syncComplexTransactionImportScheme = function (item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            item.rules.forEach(function (rule) {

                if (rule.hasOwnProperty('___transaction_type__user_code')) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var user_code = rule.___transaction_type__user_code;

                        configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type', cacheContainer).then(function (data) {

                            rule.transaction_type = data.id;

                            rule.fields = rule.fields.map(function (field) {

                                data.inputs.forEach(function (input) {

                                    if (field.___input__name === input.name) {
                                        field.transaction_type_input = input.id;
                                    }

                                });

                                return field;

                            });


                            resolveRelation(item)

                        }).catch(function (reason) {
                            reject(reason);
                        })

                    }));

                }

            });

            Promise.all(promises).then(function (data) {

                resolve(item);

            })

        })

    };

    var syncItem = function (item, entity, cacheContainer) {

        return new Promise(function (resolve, reject) {

            // console.log('syncItem', entity);

            try {

                switch (entity) {

                    case 'transactions.transactiontype':
                        resolve(syncTransactionType(item, cacheContainer));
                        break;
                    case 'currencies.currency':
                        resolve(syncCurrency(item, cacheContainer));
                        break;
                    case 'instruments.instrumenttype':
                        resolve(syncInstrumentType(item, cacheContainer));
                        break;
                    case 'ui.editlayout':
                        resolve(syncEditLayout(item, cacheContainer));
                        break;
                    case 'ui.listlayout':
                        resolve(syncListLayout(item, cacheContainer));
                        break;
                    case 'ui.reportlayout':
                        resolve(syncReportLayout(item, cacheContainer));
                        break;
                    case 'integrations.instrumentdownloadscheme':
                        resolve(syncInstrumentDownloadScheme(item, cacheContainer));
                        break;
                    case 'complex_import.compleximportscheme':
                        resolve(syncComplexImportScheme(item, cacheContainer));
                        break;
                    case 'integrations.complextransactionimportscheme':
                        resolve(syncComplexTransactionImportScheme(item, cacheContainer));
                        break;
                    default:
                        resolve(item);
                        break;
                }

            } catch (error) {

                console.log('importItem.error', error)

            }

        })

    };


    module.exports = {
        syncItem: syncItem
    }

}());