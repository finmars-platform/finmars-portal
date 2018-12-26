/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../services/entityResolverService');
    var attributeTypeService = require('../services/attributeTypeService');

    var entitySchemeService = require('../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../services/import/instrumentSchemeService');
    var transactionSchemeService = require('../services/import/transactionSchemeService');
    var pricingAutomatedScheduleService = require('../services/import/pricingAutomatedScheduleService');
    var metaContentTypesService = require('../services/metaContentTypesService');

    var uiRepository = require('../repositories/uiRepository');

    var getEntityByUserCode = function (user_code, entity) {

        return new Promise(function (resolve, reject) {

            entityResolverService.getList(entity, {
                filters: {
                    "user_code": user_code
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    if (user_code !== '-') {

                        resolve(getEntityByUserCode('-', entity))

                    } else {
                        reject("Entity with user code '-' does not exist")
                    }

                }

            })

        })

    };

    var getEntityBySystemCode = function (system_code, entity) {

        return new Promise(function (resolve, reject) {

            entityResolverService.getList(entity, {
                filters: {
                    "system_code": system_code
                }
            }).then(function (data) {

                if (data.length) {

                    resolve(data[0])

                } else {

                    reject("Entity does not exist")

                }

            })

        })

    };

    var getAttributeTypeByUserCode = function (user_code, entity) {

        return new Promise(function (resolve, reject) {

            attributeTypeService.getList(entity, {
                filters: {
                    "user_code": user_code
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    reject("Attribute Type with user code " + user_code + " does not exist")

                }

            })

        })

    };

    var getSchemeBySchemeName = function (scheme_name, entity) {

        return new Promise(function (resolve, reject) {

            entityResolverService.getList(entity, {
                filters: {
                    "scheme_name": scheme_name
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    if (scheme_name !== '-') {

                        resolve(getSchemeBySchemeName('-', entity))

                    } else {
                        reject("Scheme with name'-' does not exist")
                    }

                }

            })

        })

    };

    var importConfiguration = function (items) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            items.forEach(function (entityItem) {


                entityItem.content.forEach(function (item) {

                    if (item.active) {

                        switch (entityItem.entity) {

                            case 'transactions.transactiontype':
                                promises.push(entityResolverService.create('transaction-type', item));
                                break;
                            case 'accounts.accounttype':
                                promises.push(entityResolverService.create('account-type', item));
                                break;
                            case 'instruments.instrumenttype':
                                promises.push(entityResolverService.create('instrument-type', item));
                                break;
                            case 'import.pricingautomatedschedule':
                                promises.push(pricingAutomatedScheduleService.updateSchedule(item));
                                break;
                            case 'ui.editlayout':

                                var entityType = metaContentTypesService.findEntityByContentType(item.content_type, 'ui');

                                var promise = new Promise(function (resolve, reject) {

                                    uiRepository.getEditLayout(entityType).then(function (data) {

                                        if (data.results.length) {
                                            uiRepository.updateEditLayout(data.results[0].id, item).then(function (item) {
                                                resolve({})
                                            })
                                        } else {
                                            uiRepository.createEditLayout(item).then(function (item) {
                                                resolve({})
                                            })
                                        }

                                    });

                                });

                                promises.push(promise);

                                break;
                            case 'ui.listlayout':
                                promises.push(uiRepository.createListLayout(item));
                                break;
                            case 'ui.reportlayout':
                                promises.push(uiRepository.createListLayout(item));
                                break;
                            case 'csv_import.scheme':
                                promises.push(entitySchemeService.create(item));
                                break;
                            case 'integrations.instrumentdownloadscheme':
                                promises.push(instrumentSchemeService.create(item));
                                break;
                            case 'integrations.pricedownloadscheme':
                                promises.push(priceDownloadSchemeService.create(item));
                                break;
                            case 'integrations.complextransactionimportscheme':
                                promises.push(transactionSchemeService.create(item));
                                break;
                            case 'obj_attrs.portfolioattributetype':
                                promises.push(attributeTypeService.create('portfolio', item));
                                break;
                            case 'obj_attrs.accountattributetype':
                                promises.push(attributeTypeService.create('account', item));
                                break;
                            case 'obj_attrs.accounttypeattributetype':
                                promises.push(attributeTypeService.create('account-type', item));
                                break;
                            case 'obj_attrs.responsibleattributetype':
                                promises.push(attributeTypeService.create('responsible', item));
                                break;
                            case 'obj_attrs.counterpartyattributetype':
                                promises.push(attributeTypeService.create('counterparty', item));
                                break;
                            case 'obj_attrs.instrumentattributetype':
                                promises.push(attributeTypeService.create('instrument', item));
                                break;
                            case 'obj_attrs.instrumenttypeattributetype':
                                promises.push(attributeTypeService.create('instrument-type', item));
                                break;


                        }

                    }

                })

            });

            Promise.all(promises).then(function (data) {

                console.log("import success", data);

                resolve(data);


            }).catch(function (reason) {

            })

        })

    };

    module.exports = {
        getEntityByUserCode: getEntityByUserCode,
        getEntityBySystemCode: getEntityBySystemCode,
        getAttributeTypeByUserCode: getAttributeTypeByUserCode,
        getSchemeBySchemeName: getSchemeBySchemeName,
        importConfiguration: importConfiguration
    }

}());