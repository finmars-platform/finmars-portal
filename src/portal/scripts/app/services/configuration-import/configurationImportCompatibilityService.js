/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var accountTypeModel = require('../../models/accountTypePropsModel');
    var instrumentType = require('../../models/instrumentTypePropsModel');
    var currencyModel = require('../../models/currencyPropsModel');
    var metaContentTypesService = require('../metaContentTypesService');

    var entityResolverService = require('../entityResolverService');

    var modelContainer = {
        'accounts.accounttype': accountTypeModel.getAttributes(),
        'instruments.instrumenttype': instrumentType.getAttributes(),
        'currencies.currency': currencyModel.getAttributes()
    };

    var setDefaultRelation = function (item, propertyItem, cacheContainer) {

        return new Promise(function (resolve, reject) {

            if (cacheContainer[propertyItem.entity] && cacheContainer[propertyItem.entity]['-']) {

                item[propertyItem.key] = cacheContainer[propertyItem.entity]['-'];

                resolve(item)

            } else {

                cacheContainer[propertyItem.entity] = {};

                if (propertyItem.code === 'user_code') {

                    entityResolverService.getList(propertyItem.entity, {
                        filters: {
                            "user_code": '-'
                        }
                    }).then(function (data) {

                        if (data.results.length) {

                            data.results.forEach(function (resultItem) {

                                if (resultItem.user_code === '-') {

                                    item[propertyItem.key] = resultItem.id;

                                    cacheContainer[propertyItem.entity]['-'] = resultItem.id;

                                    resolve(item)

                                }

                            })
                        } else {
                            reject(new Error("Default value (-) is not exists"));
                        }

                    });

                } else {

                    entityResolverService.getList(propertyItem.entity, {
                        filters: {
                            "system_code": '-'
                        }
                    }).then(function (data) {

                        if (data.length) {

                            data.forEach(function (resultItem) {

                                if (resultItem.system_code === '-') {

                                    item[propertyItem.key] = resultItem.id;

                                    cacheContainer[propertyItem.entity]['-'] = resultItem.id;

                                    resolve(item)

                                }
                            })

                        } else {

                            reject(new Error("Default value (-) is not exists"));
                        }

                    })

                }

            }

        })

    };

    var simpleRepair = function (item, contentType, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            modelContainer[contentType].forEach(function (propertyItem) {

                if (!item.hasOwnProperty(propertyItem.key)) {
                    item[propertyItem.key] = null;
                }

                if (propertyItem.key === 'tags') {
                    if (!item[propertyItem.key]) {
                        item[propertyItem.key] = [];
                    }
                }

                if (!item[propertyItem.key] && propertyItem.allow_null === false) {

                    if (propertyItem.value_type === 'field') {

                        promises.push(setDefaultRelation(item, propertyItem, cacheContainer))

                    }


                }

            });

            Promise.all(promises).then(function (data) {

                resolve(item)

            })

        })

    };

    var handleItem = function (item, contentType, cacheContainer) {

        return new Promise(function (resolve, reject) {

            switch (contentType) {

                case 'accounts.accounttype':
                    resolve(simpleRepair(item, contentType, cacheContainer));
                    break;
                case 'instruments.instrumenttype':
                    resolve(simpleRepair(item, contentType, cacheContainer));
                    break;
                case 'currencies.currency':
                    resolve(simpleRepair(item, contentType, cacheContainer));
                    break;
                default:
                    resolve(item);

            }

        })

    };

    var loadDefaultRelations = function (cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            promises.push(setDefaultRelation({}, {entity: 'transaction-type', code: 'user_code', key: 'transaction_type'}, cacheContainer));
            promises.push(setDefaultRelation({}, {entity: 'transaction-class', code: 'system_code', key: 'transaction_class'}, cacheContainer));

            Promise.all(promises).then(function (data) {

                console.log('default relation values', data);

                resolve(data)
            })

        })

    };

    var repairItems = function (entities) {

        return new Promise(function (resolve, reject) {

            var cacheContainer = {};

            loadDefaultRelations(cacheContainer).then(function () {

                var promises = [];

                entities.forEach(function (entityItem) {

                    entityItem.content.forEach(function (item) {

                        if (item.active) {

                            promises.push(handleItem(item, entityItem.entity, cacheContainer))

                        }

                    })

                });

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        })

    };

    module.exports = {
        repairItems: repairItems,
    }

}());