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

    var createIfNotExists = function (contentType, item, cacheContainer) {

        return new Promise(function (resolve, reject) {

            if (cacheContainer[contentType] && cacheContainer[contentType][item.user_code]) {

                resolve(cacheContainer[entity][item.user_code])

            } else {


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

                                cacheContainer[contentType][item.user_code] = data;

                                resolve(data)

                            });

                        }

                        console.warn('Item already exists: user_code ' + item.user_code + ' contentType ' + contentType);

                        resolve()


                    } else {

                        entityResolverService.create(entityType, item).then(function (data) {

                            cacheContainer[contentType][item.user_code] = data;

                            resolve(data)

                        });
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

    var recursiveCreateItem = function (resolve, index, entityItem, cacheContainer) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            createItem(item, entityItem.entity, cacheContainer).then(function () {

                window.importConfigurationCounter = window.importConfigurationCounter + 1;

                if (index === entityItem.content.length) {
                    resolve(item);
                } else {
                    recursiveCreateItem(resolve, index, entityItem, cacheContainer)
                }

            })
        } else {

            if (index === entityItem.content.length) {
                resolve(item);
            } else {
                recursiveCreateItem(resolve, index, entityItem, cacheContainer)
            }

        }

    };
    var createItem = function (item, entity, cacheContainer) {

        return new Promise(function (resolve, reject) {

            configurationImportSyncService.syncItem(item, entity, cacheContainer).then(function (value) {

                try {

                    switch (entity) {

                        case 'transactions.transactiontype':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'transactions.transactiontypegroup':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'accounts.accounttype':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'currencies.currency':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'instruments.pricingpolicy':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'instruments.instrumenttype':
                            resolve(createIfNotExists(entity, item, cacheContainer));
                            break;
                        case 'import.pricingautomatedschedule':
                            resolve(pricingAutomatedScheduleService.updateSchedule(item));
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
                            resolve(entitySchemeService.create(item));
                            break;
                        case 'integrations.instrumentdownloadscheme':
                            resolve(instrumentSchemeService.create(item));
                            break;
                        case 'integrations.pricedownloadscheme':
                            resolve(priceDownloadSchemeService.create(item));
                            break;
                        case 'integrations.complextransactionimportscheme':
                            resolve(transactionSchemeService.create(item));
                            break;
                        case 'obj_attrs.portfolioattributetype':
                            resolve(attributeTypeService.create('portfolio', item));
                            break;
                        case 'obj_attrs.accountattributetype':
                            resolve(attributeTypeService.create('account', item));
                            break;
                        case 'obj_attrs.accounttypeattributetype':
                            resolve(attributeTypeService.create('account-type', item));
                            break;
                        case 'obj_attrs.responsibleattributetype':
                            resolve(attributeTypeService.create('responsible', item));
                            break;
                        case 'obj_attrs.counterpartyattributetype':
                            resolve(attributeTypeService.create('counterparty', item));
                            break;
                        case 'obj_attrs.instrumentattributetype':
                            resolve(attributeTypeService.create('instrument', item));
                            break;
                        case 'obj_attrs.instrumenttypeattributetype':
                            resolve(attributeTypeService.create('instrument-type', item));
                            break;
                    }

                } catch (error) {

                    console.log('createItem.error', error)

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

                console.log('instrumentTypes', instrumentTypes);

                configurationImportGetService.getInstrumentsTypesWithIds(instrumentTypes).then(function (items) {

                    console.log('instrumentTypes with ids', items);

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
    var createEntityItems = function (entities, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolveItem, reject) {

                    var startIndex = 0;

                    recursiveCreateItem(resolveItem, startIndex, entityItem, cacheContainer)
                }))

            });

            console.log('promises', promises);

            Promise.all(promises).then(function (data) {

                console.log("createEntityItems?", data);

                resolve(data)


            })

        })

    };

    var createEntities = function (items, cacheContainer) {

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


            createEntityItems(instrumentTypes, cacheContainer).then(function () {

                console.log("Instrument type import success");

                createEntityItems(transactionTypeGroups, cacheContainer).then(function (value) {

                    console.log("Transaction type groups import success");

                    createEntityItems(transactionTypes, cacheContainer).then(function () {

                        console.log("Transaction type import success");

                        specialOverwriteInstrumentTypes(instrumentTypes[0]).then(function () {

                            console.log("Instrument type overwrite success");

                            createEntityItems(otherEntities, cacheContainer).then(function (data) {

                                console.log("Entities import success", data);

                                createEntityItems(layoutEntities, cacheContainer).then(function (data) {

                                    console.log("Layout import success", data);

                                    createEntityItems(bookmarks, cacheContainer).then(function (data) {

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

                var cacheContainer = {};

                createEntities(items, cacheContainer).then(function () {

                    console.log('Create items success');

                    if (settings && settings.mode === 'overwrite') {

                        overwriteEntities(items, cacheContainer).then(function () {

                            console.log('Overwrite items success');

                            console.log('Finish import success');

                            resolve()
                        })

                    } else {

                        console.log('Finish import success');

                        resolve()
                    }


                })

            })

        })

    };


    module.exports = {
        importConfiguration: importConfiguration
    }

}());