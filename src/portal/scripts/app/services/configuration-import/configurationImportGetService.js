/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var transactionTypeService = require('../../services/transactionTypeService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var customFieldService = require('../../services/reports/customFieldService');

    var getEntityByUserCode = function (user_code, entity, cacheContainer) {

        if (!cacheContainer) {
            cacheContainer = {}; // no cache then
        }

        return new Promise(function (resolve, reject) {

            if (!cacheContainer[entity]) {
                cacheContainer[entity] = {};
            }

            // console.log(JSON.parse(JSON.stringify(cacheContainer[entity])));

            if (cacheContainer[entity][user_code]) {

                // console.log('From cache: ', cacheContainer[entity][user_code]);

                resolve(cacheContainer[entity][user_code]);

            } else {


                new Promise(function (resolve, reject) {

                    if (entity === 'transaction-type') {

                        transactionTypeService.getListLightWithInputs({
                            filters: {
                                "user_code": user_code
                            }
                        }).then(function (data) {
                            resolve(data)
                        })

                    } else {
                        entityResolverService.getList(entity, {
                            filters: {
                                "user_code": user_code
                            }
                        }).then(function (data) {
                            resolve(data)
                        })
                    }

                }).then(function (data) {

                    if (data.results.length) {

                        var exist = false;

                        data.results.forEach(function (item) {

                            if (item.user_code === user_code) {
                                cacheContainer[entity][user_code] = item;
                                exist = true;
                                resolve(item)
                            }

                        });

                        if (exist) {
                            return;
                        }

                        console.log('entity: ' + entity + 'user_code: ' + user_code);

                        if (!exist) {
                            if (user_code !== '-') {

                                resolve(getEntityByUserCode('-', entity))

                            } else {
                                reject(new Error("Entity with user code '-' does not exist"))
                            }

                        }

                    } else {

                        if (user_code !== '-') {

                            resolve(getEntityByUserCode('-', entity))

                        } else {
                            reject(new Error("Entity with user code '-' does not exist"))
                        }

                    }

                })
            }

        })

    };

    var getEntityBySystemCode = function (system_code, entity, cacheContainer) {

        if (!cacheContainer) {
            cacheContainer = {}; // no cache then
        }

        return new Promise(function (resolve, reject) {

            if (!cacheContainer[entity]) {
                cacheContainer[entity] = {};
            }

            if (cacheContainer[entity][system_code]) {

                resolve(cacheContainer[entity][system_code]);

            } else {

                // console.log('entity', entity);
                // console.log('system_code', system_code);

                try {

                    entityResolverService.getList(entity, {
                        filters: {
                            "system_code": system_code
                        }
                    }).then(function (data) {

                        if (data.length) {
                            cacheContainer[entity][system_code] = data[0];
                            resolve(data[0])

                        } else {

                            reject(new Error("Entity does not exist"))

                        }

                    })

                } catch (error) {

                    console.error(error);

                    reject(error)
                }

            }

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

                    reject(new Error("Attribute Type with user code " + user_code + " does not exist"))

                }

            })

        })

    };

    var getCustomFieldByUserCode = function (user_code, entity) {

        return new Promise(function (resolve, reject) {

            customFieldService.getList(entity, {
                filters: {
                    "user_code": user_code
                }
            }).then(function (data) {

                if (data.results.length) {

                    resolve(data.results[0])

                } else {

                    reject(new Error("Custom Field with user code " + user_code + " does not exist"))

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

                    var result;

                    data.results.forEach(function (item) {

                        if (item.scheme_name === scheme_name) {

                            result = item
                        }

                    });

                    resolve(result)

                } else {

                    if (scheme_name !== '-') {

                        resolve(getSchemeBySchemeName('-', entity))

                    } else {
                        reject(new Error("Scheme with name'-' does not exist"))
                    }

                }

            })

        })

    };

    var getInstrumentsTypesWithIds = function (items) {

        return new Promise(function (resolve, reject) {

            var result = [];

            entityResolverService.getList('instrument-type', {pageSize: 10000}).then(function (data) {

                var serverItems = data.results;

                serverItems.forEach(function (serverItem) {

                    items.forEach(function (item) {

                        if (item.user_code === serverItem.user_code) {

                            var resultItem = Object.assign({}, item);

                            resultItem.id = serverItem.id;

                            result.push(resultItem)

                        }


                    })

                });

                resolve(result)

            });

        })

    };

    module.exports = {
        getEntityByUserCode: getEntityByUserCode,
        getEntityBySystemCode: getEntityBySystemCode,
        getAttributeTypeByUserCode: getAttributeTypeByUserCode,
        getCustomFieldByUserCode: getCustomFieldByUserCode,
        getSchemeBySchemeName: getSchemeBySchemeName,
        getInstrumentsTypesWithIds: getInstrumentsTypesWithIds
    }

}());