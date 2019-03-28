/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var entityResolverService = require('../../services/entityResolverService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var entitySchemeService = require('../../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var pricingAutomatedScheduleService = require('../../services/import/pricingAutomatedScheduleService');
    var metaContentTypesService = require('../../services/metaContentTypesService');

    var uiRepository = require('../../repositories/uiRepository');
    var bookmarkRepository = require('../../repositories/bookmarkRepository');

    var configurationImportCompatibilityService = require('./configurationImportCompatibilityService');

    var configurationImportGetService = require('./configurationImportGetService');
    var configurationImportMapService = require('./configurationImportMapService');
    var configurationImportSyncService = require('./configurationImportSyncService');

    // Overwrite handler start

    var recursiveOverwriteItem = function (resolve, index, entityItem, cacheContainer) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            overwriteItem(item, entityItem.entity, cacheContainer).then(function () {

                if (index === entityItem.content.length) {
                    resolve(item);
                } else {
                    recursiveOverwriteItem(resolve, index, entityItem, cacheContainer)
                }

            })
        } else {

            if (index === entityItem.content.length) {
                resolve(item);
            } else {
                recursiveOverwriteItem(resolve, index, entityItem, cacheContainer)
            }

        }

    };

    var getAndUpdate = function (contentType, item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var entityType = metaContentTypesService.findEntityByContentType(contentType);

            var options = {
                filters: {
                    user_code: item.user_code
                }
            };

            entityResolverService.getList(entityType, options).then(function (data) {

                var result;

                if (data.results.length) {

                    data.results.forEach(function (resultItem) {

                        if (resultItem.user_code === item.user_code) {
                            result = resultItem;
                        }

                    });

                    item.id = result.id;

                    resolve(entityResolverService.update(entityType, item.id, item))


                } else {

                    console.warn('Cant overwrite item ' + item.user_code + ' contentType: ' + contentType);

                    resolve(item);
                }

            })

        })

    };

    var createIfNotExists = function (contentType, item, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            if (cacheContainer[contentType] && cacheContainer[contentType][item.user_code]) {

                resolve(cacheContainer[entity][item.user_code])

            } else {

                // console.log('contentType', contentType);

                var entityType = metaContentTypesService.findEntityByContentType(contentType);

                var options = {
                    filters: {
                        user_code: item.user_code
                    }
                };


                entityResolverService.getList(entityType, options).then(function (data) {

                    var result;

                    if (data.results.length) {

                        data.results.forEach(function (resultItem) {

                            if (resultItem.user_code === item.user_code) {
                                result = resultItem;
                            }

                        });

                        if (!result) {

                            entityResolverService.create(entityType, item).then(function (data) {

                                if (!cacheContainer[contentType]) {
                                    cacheContainer[contentType] = {};
                                }

                                cacheContainer[contentType][item.user_code] = data;

                                resolve(data)

                            }).catch(function (reason) {

                                errors.push(reason);

                                resolve()

                            })

                        }

                        console.warn('Item already exists: user_code ' + item.user_code + ' contentType ' + contentType);

                        resolve()


                    } else {

                        entityResolverService.create(entityType, item).then(function (data) {

                            if (!cacheContainer[contentType]) {
                                cacheContainer[contentType] = {};
                            }

                            cacheContainer[contentType][item.user_code] = data;

                            resolve(data)

                        }).catch(function (reason) {

                            errors.push(reason);

                            resolve()

                        })
                    }

                })

            }

        })

    };

    var overwriteItem = function (item, contentType, cacheContainer) {

        return new Promise(function (resolve, reject) {

            configurationImportSyncService.syncItem(item, contentType, cacheContainer).then(function (value) {

                try {

                    switch (contentType) {

                        case 'transactions.transactiontype':
                            resolve(getAndUpdate(contentType, item, cacheContainer));
                            break;
                        case 'accounts.accounttype':
                            resolve(getAndUpdate(contentType, item, cacheContainer));
                            break;
                        case 'currencies.currency':
                            resolve(getAndUpdate(contentType, item, cacheContainer));
                            break;
                        case 'instruments.pricingpolicy':
                            resolve(getAndUpdate(contentType, item, cacheContainer));
                            break;
                        case 'instruments.instrumenttype':
                            resolve(getAndUpdate(contentType, item, cacheContainer));
                            break;
                        case 'import.pricingautomatedschedule':
                            resolve(pricingAutomatedScheduleService.updateSchedule(item));
                            break;
                        case 'csv_import.scheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                entitySchemeService.getList(entityType, options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.user_code === item.user_code) {
                                                result = resultItem;
                                            }

                                        });

                                        item.id = result.id;

                                        resolveLocal(entitySchemeService.update(entityType, item.id, item))


                                    } else {

                                        console.warn("Cant overwrite item " + item.scheme_name + ' entityType: ' + entityType);

                                        resolveLocal(item);
                                    }

                                })


                            }));
                            break;
                        case 'integrations.instrumentdownloadscheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                instrumentSchemeService.getList(entityType, options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.user_code === item.user_code) {
                                                result = resultItem;
                                            }

                                        });

                                        item.id = result.id;

                                        resolveLocal(instrumentSchemeService.update(entityType, item.id, item))


                                    } else {

                                        console.warn("Cant overwrite item " + item.scheme_name + ' entityType: ' + entityType);

                                        resolveLocal(item);
                                    }

                                })


                            }));
                            break;
                        case 'integrations.pricedownloadscheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                priceDownloadSchemeService.getList(entityType, options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.user_code === item.user_code) {
                                                result = resultItem;
                                            }

                                        });

                                        item.id = result.id;

                                        resolveLocal(priceDownloadSchemeService.update(entityType, item.id, item))


                                    } else {

                                        console.warn("Cant overwrite item " + item.scheme_name + ' entityType: ' + entityType);

                                        resolveLocal(item);
                                    }

                                })


                            }));
                            break;
                        case 'integrations.complextransactionimportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                transactionSchemeService.getList(entityType, options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.user_code === item.user_code) {
                                                result = resultItem;
                                            }

                                        });

                                        item.id = result.id;

                                        resolveLocal(transactionSchemeService.update(entityType, item.id, item))


                                    } else {

                                        console.warn("Cant overwrite item " + item.scheme_name + ' entityType: ' + entityType);

                                        resolveLocal(item);
                                    }

                                })


                            }));
                            break;
                    }

                } catch (error) {

                    console.log('createItem.error', error)

                }

            })

        })

    };

    var overwriteEntityItems = function (entities, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolveItem, reject) {

                    var startIndex = 0;

                    recursiveOverwriteItem(resolveItem, startIndex, entityItem, cacheContainer)
                }))

            });

            console.log('promises', promises);

            Promise.all(promises).then(function (data) {

                console.log("overwriteEntityItems?", data);

                resolve(data)


            })

        })

    };

    var overwriteEntities = function (items, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var overwriteEntities = items.filter(function (item) {
                return ['instruments.instrumenttype', 'transactions.transactiontype',
                    'accounts.accounttype', 'currencies.currency', 'instruments.pricingpolicy',
                    'csv_import.scheme', 'integrations.instrumentdownloadscheme', 'integrations.pricedownloadscheme',
                    'integrations.complextransactionimportscheme'].indexOf(item.entity) !== -1;
            });

            overwriteEntityItems(overwriteEntities, cacheContainer).then(function (data) {

                console.log("Overwrite success", data);

                resolve(data);

            }).catch(function (reason) {

                console.log('Overwrite importConfiguration.reason', reason);

                reject(reason);
            })


        })

    };

    // Overwrite handler end

    // Create handler start

    var recursiveCreateItem = function (resolve, index, entityItem, cacheContainer, errors) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            createItem(item, entityItem.entity, cacheContainer, errors).then(function () {

                window.importConfigurationCounter = window.importConfigurationCounter + 1;

                if (index === entityItem.content.length) {
                    resolve(item);
                } else {
                    recursiveCreateItem(resolve, index, entityItem, cacheContainer, errors)
                }

            })
        } else {

            if (index === entityItem.content.length) {
                resolve(item);
            } else {
                recursiveCreateItem(resolve, index, entityItem, cacheContainer, errors)
            }

        }

    };

    var catchError = function (promise, item, errors) {

        return new Promise(function (resolve, reject) {

            promise.then(function (data) {
                resolve(data)
            }).catch(function (reason) {

                console.log('catch?');

                errors.push({
                    item: item,
                    error: reason
                });
                resolve();

            })

        })

    };

    var createItem = function (item, entity, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            configurationImportSyncService.syncItem(item, entity, cacheContainer).then(function (value) {

                try {

                    switch (entity) {

                        case 'transactions.transactiontype':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'transactions.transactiontypegroup':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'accounts.accounttype':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'currencies.currency':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'instruments.pricingpolicy':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'instruments.instrumenttype':
                            resolve(createIfNotExists(entity, item, cacheContainer, errors));
                            break;
                        case 'import.pricingautomatedschedule':
                            resolve(catchError(pricingAutomatedScheduleService.updateSchedule(item), item, errors));
                            break;
                        case 'ui.editlayout':
                            resolve(new Promise(function (resolve, reject) {

                                var entityType = metaContentTypesService.findEntityByContentType(item.content_type, 'ui');

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

                            }));
                            break;
                        case 'ui.listlayout':
                            resolve(new Promise(function (resolve, reject) {

                                uiRepository.getListLayoutDefault({
                                    filters: {
                                        name: item.name,
                                        content_type: item.content_type
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.name === item.name) {
                                                result = resultItem
                                            }

                                        });

                                        item.id = result.id;

                                        resolve(uiRepository.updateListLayout(item.id, item));

                                    } else {

                                        resolve(uiRepository.createListLayout(item));

                                    }

                                });

                            }));
                            break;
                        case 'ui.reportlayout':
                            resolve(new Promise(function (resolve, reject) {

                                uiRepository.getListLayoutDefault({
                                    filters: {
                                        name: item.name,
                                        content_type: item.content_type
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.name === item.name) {
                                                result = resultItem
                                            }

                                        });

                                        item.id = result.id;

                                        resolve(uiRepository.updateListLayout(item.id, item));

                                    } else {

                                        resolve(uiRepository.createListLayout(item));

                                    }

                                });

                            }));
                            break;
                        case 'ui.bookmark':
                            resolve(new Promise(function (resolve, reject) {

                                uiRepository.getListLayoutDefault({
                                    filters: {
                                        name: item.___layout_name,
                                        content_type: item.___content_type
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        item.list_layout = data.results[0].id;

                                    }

                                    var promises = [];

                                    if (item.children && item.children.length) {

                                        item.children.forEach(function (child) {

                                            promises.push(new Promise(function (localResolve) {

                                                uiRepository.getListLayoutDefault({
                                                    filters: {
                                                        name: child.___layout_name,
                                                        content_type: child.___content_type
                                                    }
                                                }).then(function (data) {

                                                    if (data.results.length) {

                                                        child.list_layout = data.results[0].id;

                                                    }

                                                    console.log('bookmark child', child);

                                                    localResolve(child)

                                                })

                                            }))

                                        })

                                    }

                                    Promise.all(promises).then(function (value) {
                                        resolve(bookmarkRepository.create(item));
                                    });

                                })

                            }));
                            break;
                        case 'csv_import.scheme':
                            resolve(catchError(entitySchemeService.create(item), item, errors));
                            break;
                        case 'integrations.instrumentdownloadscheme':
                            resolve(catchError(instrumentSchemeService.create(item), item, errors));
                            break;
                        case 'integrations.pricedownloadscheme':
                            resolve(catchError(priceDownloadSchemeService.create(item), item, errors));
                            break;
                        case 'integrations.complextransactionimportscheme':
                            resolve(catchError(transactionSchemeService.create(item)), item, errors);
                            break;
                        case 'obj_attrs.portfolioattributetype':
                            resolve(catchError(attributeTypeService.create('portfolio', item), item, errors));
                            break;
                        case 'obj_attrs.accountattributetype':
                            resolve(catchError(attributeTypeService.create('account', item), item, errors));
                            break;
                        case 'obj_attrs.accounttypeattributetype':
                            resolve(catchError(attributeTypeService.create('account-type', item), item, errors));
                            break;
                        case 'obj_attrs.responsibleattributetype':
                            resolve(catchError(attributeTypeService.create('responsible', item), item, errors));
                            break;
                        case 'obj_attrs.counterpartyattributetype':
                            resolve(catchError(attributeTypeService.create('counterparty', item), item, errors));
                            break;
                        case 'obj_attrs.instrumentattributetype':
                            resolve(catchError(attributeTypeService.create('instrument', item), item, errors));
                            break;
                        case 'obj_attrs.instrumenttypeattributetype':
                            resolve(catchError(attributeTypeService.create('instrument-type', item), item, errors));
                            break;
                    }

                } catch (error) {

                    console.log('createItem.error', error);

                    errors.push(error);

                }

            })

        })

    };

    var specialOverwriteInstrumentTypes = function (entity) {

        return new Promise(function (resolve, reject) {

            if (entity) {

                var instrumentTypes = entity.content.filter(function (item) {
                    return item.active;
                });

                configurationImportGetService.getInstrumentsTypesWithIds(instrumentTypes).then(function (items) {

                    var promises = [];

                    items.forEach(function (item) {

                        configurationImportMapService.mapFieldsInInstrumentType(item).then(function (updatedItem) {

                            promises.push(entityResolverService.update('instrument-type', updatedItem.id, updatedItem));

                        })

                    });

                    Promise.all(promises).then(function (data) {

                        resolve(data);

                    })

                });

            } else {
                resolve();
            }


        })

    };

    var createEntityItems = function (entities, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolveItem, reject) {

                    var startIndex = 0;

                    recursiveCreateItem(resolveItem, startIndex, entityItem, cacheContainer, errors)
                }))

            });

            Promise.all(promises).then(function (data) {

                resolve(data)

            })

        })

    };

    var createEntities = function (items, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            var instrumentTypes = items.filter(function (item) {
                return item.entity === 'instruments.instrumenttype';
            });

            var transactionTypeGroups = items.filter(function (item) {
                return item.entity === 'transactions.transactiontypegroup';
            });

            var transactionTypes = items.filter(function (item) {
                return item.entity === 'transactions.transactiontype';
            });

            var otherEntities = items.filter(function (item) {
                return item.entity !== 'transactions.transactiontype' &&
                    item.entity !== 'instruments.instrumenttype' &&
                    item.entity !== 'transactions.transactiontypegroup' &&
                    item.entity !== 'ui.editlayout' &&
                    item.entity !== 'ui.listlayout' &&
                    item.entity !== 'ui.reportlayout' &&
                    item.entity !== 'ui.bookmark'
            });

            var layoutEntities = items.filter(function (item) {
                return item.entity === 'ui.editlayout' ||
                    item.entity === 'ui.listlayout' ||
                    item.entity === 'ui.reportlayout'
            });

            var bookmarks = items.filter(function (item) {
                return item.entity === 'ui.bookmark'
            });


            createEntityItems(instrumentTypes, cacheContainer, errors).then(function () {

                console.log("Instrument type import success");

                createEntityItems(transactionTypeGroups, cacheContainer, errors).then(function (value) {

                    console.log("Transaction type groups import success");

                    createEntityItems(transactionTypes, cacheContainer, errors).then(function () {

                        console.log("Transaction type import success");

                        specialOverwriteInstrumentTypes(instrumentTypes[0]).then(function () {

                            console.log("Instrument type overwrite success");

                            createEntityItems(otherEntities, cacheContainer, errors).then(function (data) {

                                console.log("Entities import success", data);

                                createEntityItems(layoutEntities, cacheContainer, errors).then(function (data) {

                                    console.log("Layout import success", data);

                                    createEntityItems(bookmarks, cacheContainer, errors).then(function (data) {

                                        console.log("Bookmark import success", data);

                                        resolve(data);

                                    }).catch(function (reason) {

                                        console.log('importConfiguration.reason', reason);

                                        reject(reason);
                                    })

                                })


                            }).catch(function (reason) {

                                console.log('importConfiguration.reason', reason);

                                reject(reason);
                            })


                        })

                    })

                })

            });

        })

    };

    // Create handler end

    var importConfiguration = function (items, settings) {

        return new Promise(function (resolve, reject) {

            configurationImportCompatibilityService.repairItems(items).then(function () {

                console.log('Repair items success');

                var errors = [];
                var cacheContainer = {};

                createEntities(items, cacheContainer, errors).then(function () {

                    console.log('Create items success');

                    if (settings && settings.mode === 'overwrite') {

                        overwriteEntities(items, cacheContainer, errors).then(function () {

                            console.log('Overwrite items success');

                            console.log('Finish import success');

                            resolve({
                                errors: errors
                            })
                        })

                    } else {

                        console.log('Finish import success');

                        resolve({
                            errors: errors
                        })
                    }


                })

            })

        })

    };


    module.exports = {
        importConfiguration: importConfiguration
    }

}());