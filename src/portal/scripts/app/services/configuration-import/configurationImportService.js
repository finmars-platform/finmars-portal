/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var configurationImportRepository = require('../../repositories/import/configurationImportRepository');

    var entityResolverService = require('../../services/entityResolverService');
    var attributeTypeService = require('../../services/attributeTypeService');

    var csvImportSchemeService = require('../../services/import/csvImportSchemeService');
    var complexImportSchemeService = require('../../services/import/complexImportSchemeService');
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

    var recursiveOverwriteItem = function (resolve, index, entityItem, cacheContainer, errors) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            overwriteItem(item, entityItem.entity, cacheContainer, errors).then(function () {

                window.importConfigurationCounter = window.importConfigurationCounter + 1;

                if (index === entityItem.content.length) {
                    resolve(item);
                } else {
                    recursiveOverwriteItem(resolve, index, entityItem, cacheContainer, errors)
                }

            })
        } else {

            if (index === entityItem.content.length) {
                resolve(item);
            } else {
                recursiveOverwriteItem(resolve, index, entityItem, cacheContainer, errors)
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

                    if (result) {

                        item.id = result.id;

                        resolve(entityResolverService.update(entityType, item.id, item))

                    } else {

                        resolve(entityResolverService.create(entityType, item))

                    }

                } else {

                    resolve(entityResolverService.create(entityType, item))

                }

            })

        })

    };

    var createIfNotExists = function (contentType, item, settings, cacheContainer, errors) {

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

                                errors.push({
                                    content_type: contentType,
                                    item: item,
                                    error: {
                                        message: 'Can\'t create item ' + item.user_code
                                    },
                                    mode: 'skip'
                                });

                                resolve()

                            })

                        }

                        if (settings.mode === 'overwrite') {

                            console.warn('Item already exists: user_code ' + item.user_code + ' contentType ' + contentType);

                        } else {
                            errors.push({
                                content_type: contentType,
                                item: item,
                                error: {
                                    message: 'Item already exists: user_code ' + item.user_code
                                },
                                mode: 'skip'
                            });
                        }

                        resolve()

                    } else {

                        entityResolverService.create(entityType, item).then(function (data) {

                            if (!cacheContainer[contentType]) {
                                cacheContainer[contentType] = {};
                            }

                            cacheContainer[contentType][item.user_code] = data;

                            resolve(data)

                        }).catch(function (reason) {

                            errors.push({
                                content_type: contentType,
                                item: item,
                                error: {
                                    message: 'Can\'t create item ' + item.user_code
                                },
                                mode: 'skip'
                            });

                            resolve()

                        })
                    }

                })

            }

        })

    };

    var createAttributeTypeIfNotExists = function (contentType, item, errors) {

        return new Promise(function (resolve, reject) {


            // console.log('contentType', contentType);

            var entityType = metaContentTypesService.findEntityByContentType(contentType);

            // console.log('entityType', entityType);

            var options = {
                filters: {
                    user_code: item.user_code
                }
            };

            attributeTypeService.getList(entityType, options).then(function (data) {

                var result;

                if (data.results.length) {

                    data.results.forEach(function (resultItem) {

                        if (resultItem.user_code === item.user_code) {
                            result = resultItem;
                        }

                    });

                    if (!result) {

                        attributeTypeService.create(entityType, item).then(function (data) {

                            resolve(data)

                        }).catch(function (reason) {

                            errors.push({
                                content_type: contentType,
                                item: item,
                                error: {
                                    message: 'Can\'t create Attribute Type: user_code ' + item.user_code
                                },
                                mode: 'skip'
                            });

                            resolve()

                        })

                    } else {

                        // console.warn('Attribute Type already exists: user_code ' + item.user_code + ' contentType ' + contentType);

                        // resolve()

                        errors.push({
                            content_type: contentType,
                            item: item,
                            error: {
                                message: 'Attribute Type already exists: user_code ' + item.user_code
                            },
                            mode: 'skip'
                        });

                        resolve()

                    }

                } else {

                    attributeTypeService.create(entityType, item).then(function (data) {

                        resolve(data)

                    }).catch(function (reason) {

                        errors.push({
                            content_type: contentType,
                            item: item,
                            error: {
                                message: 'Can\'t create Attribute Type: user_code ' + item.user_code
                            },
                            mode: 'skip'
                        });

                        resolve()

                    })
                }

            })


        })

    };

    var overwriteItem = function (item, contentType, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            configurationImportSyncService.syncItem(item, contentType, cacheContainer).then(function (value) {

                console.log('Overwrite item', item);

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
                        case 'integrations.pricingautomatedschedule':
                            resolve(pricingAutomatedScheduleService.updateSchedule(item));
                            break;
                        case 'complex_import.compleximportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                complexImportSchemeService.getList(options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem;
                                            }

                                        });

                                        if (result) {

                                            item.id = result.id;

                                            resolveLocal(complexImportSchemeService.update(item.id, item))

                                        } else {

                                            resolveLocal(complexImportSchemeService.create(item));
                                        }

                                    } else {

                                        resolveLocal(complexImportSchemeService.create(item));
                                    }

                                })


                            }));
                            break;
                        case 'csv_import.csvimportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {


                                var options = {
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                };

                                csvImportSchemeService.getList(options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem;
                                            }

                                        });

                                        if (result) {

                                            item.id = result.id;

                                            resolveLocal(csvImportSchemeService.update(item.id, item))

                                        } else {

                                            resolveLocal(csvImportSchemeService.create(item));
                                        }

                                    } else {

                                        resolveLocal(csvImportSchemeService.create(item));
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

                                instrumentSchemeService.getList(options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem;
                                            }

                                        });

                                        if (result) {

                                            item.id = result.id;

                                            result.inputs.forEach(function (resultInput) {

                                                item.inputs.forEach(function (itemInput) {

                                                    if (resultInput.name === itemInput.name) {
                                                        itemInput.id = resultInput.id
                                                    }


                                                })

                                            });


                                            resolveLocal(instrumentSchemeService.update(item.id, item))

                                        } else {

                                            resolveLocal(instrumentSchemeService.create(item));
                                        }

                                    } else {

                                        resolveLocal(instrumentSchemeService.create(item));
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

                                priceDownloadSchemeService.getList(options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem;
                                            }

                                        });

                                        if (result) {

                                            item.id = result.id;

                                            resolveLocal(priceDownloadSchemeService.update(item.id, item))

                                        } else {

                                            resolveLocal(priceDownloadSchemeService.create(item))

                                        }

                                    } else {

                                        resolveLocal(priceDownloadSchemeService.create(item))

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

                                transactionSchemeService.getList(options).then(function (data) {

                                    var result;

                                    if (data.results.length) {

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem;
                                            }

                                        });

                                        if (result) {

                                            item.id = result.id;

                                            resolveLocal(transactionSchemeService.update(item.id, item))

                                        } else {

                                            resolveLocal(transactionSchemeService.create(item))

                                        }

                                    } else {

                                        resolveLocal(transactionSchemeService.create(item))

                                    }

                                })


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

                                        if (result) {

                                            item.id = result.id;

                                            resolve(uiRepository.updateListLayout(item.id, item));

                                        } else {
                                            resolve(uiRepository.createListLayout(item));
                                        }
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

                                        if (result) {

                                            item.id = result.id;

                                            resolve(uiRepository.updateListLayout(item.id, item));

                                        } else {

                                            resolve(uiRepository.createListLayout(item));
                                        }
                                    } else {

                                        resolve(uiRepository.createListLayout(item));

                                    }

                                });

                            }));
                            break;
                    }

                } catch (error) {

                    console.log('createItem.error', error)

                }

            }).catch(function (reason) {

                console.log('Overwrite sync error reason', reason);

                var name = '';

                if (item.hasOwnProperty('scheme_name')) {
                    name = item.scheme_name
                }

                if (item.hasOwnProperty('user_code')) {
                    name = item.user_code
                }

                if (item.hasOwnProperty('name')) {
                    name = item.name
                }

                errors.push({
                    content_type: contentType,
                    item: item,
                    error: {
                        message: 'Can\'t overwrite item ' + name
                    },
                    mode: 'overwrite'
                });

                resolve(reason)

            })

        })

    };

    var overwriteEntityItems = function (entities, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            console.log('overwriteEntityItems.entities', entities);

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolveItem, reject) {

                    var startIndex = 0;

                    recursiveOverwriteItem(resolveItem, startIndex, entityItem, cacheContainer, errors)
                }))

            });

            console.log('promises', promises);

            Promise.all(promises).then(function (data) {

                console.log("overwriteEntityItems?", data);

                resolve(data)


            })

        })

    };

    var overwriteEntities = function (items, settings, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            var overwriteEntities = items.filter(function (item) {
                return ['instruments.instrumenttype', 'transactions.transactiontype', 'ui.listlayout', 'ui.reportlayout',
                    'accounts.accounttype', 'currencies.currency', 'instruments.pricingpolicy',
                    'csv_import.csvimportscheme', 'integrations.instrumentdownloadscheme', 'integrations.pricedownloadscheme',
                    'integrations.complextransactionimportscheme', 'complex_import.compleximportscheme'].indexOf(item.entity) !== -1;
            });

            overwriteEntityItems(overwriteEntities, cacheContainer, errors).then(function (data) {

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

    var recursiveCreateItem = function (resolve, index, entityItem, settings, cacheContainer, errors) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            createItem(item, entityItem.entity, settings, cacheContainer, errors).then(function () {

                window.importConfigurationCounter = window.importConfigurationCounter + 1;

                if (index < entityItem.content.length) {
                    recursiveCreateItem(resolve, index, entityItem, settings, cacheContainer, errors)
                } else {
                    resolve(item);
                }

            })
        } else {

            if (index < entityItem.content.length) {
                recursiveCreateItem(resolve, index, entityItem, settings, cacheContainer, errors)
            } else {
                resolve(item);
            }

        }

    };

    var createItem = function (item, entity, settings, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            configurationImportSyncService.syncItem(item, entity, cacheContainer, errors).then(function (value) {

                try {

                    console.log('entity', entity);

                    switch (entity) {

                        case 'transactions.transactiontype':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'transactions.transactiontypegroup':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'accounts.accounttype':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'currencies.currency':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'instruments.pricingpolicy':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'instruments.instrumenttype':
                            resolve(createIfNotExists(entity, item, settings, cacheContainer, errors));
                            break;
                        case 'integrations.pricingautomatedschedule':
                            resolve(new Promise(function (resolveLocal, reject) {

                                pricingAutomatedScheduleService.updateSchedule(item).then(function (data) {

                                    console.log('pricingautomatedschedule here?', data);

                                    resolveLocal(data)
                                }).catch(function (reason) {

                                    errors.push({
                                        item: item,
                                        error: {
                                            message: reason
                                        }
                                    });

                                    console.log('pricingautomatedscheduleerror ', reason);

                                    resolveLocal(reason);
                                })

                            }));
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
                            resolve(new Promise(function (resolveLocal, reject) {

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

                                        if (result) {

                                            if (settings.mode !== 'overwrite') {

                                                errors.push({
                                                    content_type: 'ui.listlayout',
                                                    item: item,
                                                    error: {
                                                        message: 'Layout already exists: name ' + item.name
                                                    },
                                                    mode: 'skip'
                                                });

                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(uiRepository.createListLayout(item));

                                        }

                                    } else {

                                        resolveLocal(uiRepository.createListLayout(item));

                                    }

                                });

                            }));
                            break;
                        case 'ui.reportlayout':
                            resolve(new Promise(function (resolveLocal, reject) {

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

                                        if (result) {

                                            if (settings.mode !== 'overwrite') {

                                                errors.push({
                                                    content_type: 'ui.reportlayout',
                                                    item: item,
                                                    error: {
                                                        message: 'Report Layout already exists: name ' + item.name
                                                    },
                                                    mode: 'skip'
                                                });

                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(uiRepository.createListLayout(item));

                                        }

                                    } else {

                                        resolveLocal(uiRepository.createListLayout(item));

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
                        case 'complex_import.compleximportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {

                                complexImportSchemeService.getList({
                                    filters: {
                                        scheme_name: item.scheme_name,
                                        content_type: item.content_type
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem
                                            }

                                        });

                                        if (result) {

                                            if (settings.mode === 'overwrite') {
                                                console.warn('Complex Import scheme already exists: scheme_name ' + item.scheme_name);
                                            } else {

                                                errors.push({
                                                    content_type: 'complex_import.compleximportscheme',
                                                    item: item,
                                                    error: {
                                                        message: 'Complex Import scheme already exists: scheme_name ' + item.scheme_name
                                                    },
                                                    mode: 'skip'
                                                });
                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(complexImportSchemeService.create(item));

                                        }

                                    } else {

                                        resolveLocal(complexImportSchemeService.create(item));

                                    }

                                });


                            }));
                            break;
                        case 'csv_import.csvimportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {

                                csvImportSchemeService.getList({
                                    filters: {
                                        scheme_name: item.scheme_name,
                                        content_type: item.content_type
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem
                                            }

                                        });

                                        if (result) {

                                            if (settings.mode === 'overwrite') {
                                                console.warn('Simple Entity Import scheme already exists: name ' + item.scheme_name);
                                            } else {

                                                errors.push({
                                                    content_type: 'csv_import.csvimportscheme',
                                                    item: item,
                                                    error: {
                                                        message: 'Simple Entity Import scheme already exists: name ' + item.scheme_name
                                                    },
                                                    mode: 'skip'
                                                });
                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(csvImportSchemeService.create(item));

                                        }

                                    } else {

                                        resolveLocal(csvImportSchemeService.create(item));

                                    }

                                });


                            }));
                            break;
                        case 'integrations.instrumentdownloadscheme':
                            resolve(new Promise(function (resolveLocal, reject) {

                                instrumentSchemeService.getList({
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem
                                            }

                                        });

                                        if (result) {

                                            if (settings.mode === 'overwrite') {
                                                console.warn('Instrument download scheme already exists: scheme name ' + item.scheme_name);
                                            } else {

                                                errors.push({
                                                    content_type: 'integrations.instrumentdownloadscheme',
                                                    item: item,
                                                    error: {
                                                        message: 'Instrument download scheme already exists: scheme name ' + item.scheme_name
                                                    },
                                                    mode: 'skip'
                                                });
                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(instrumentSchemeService.create(item));

                                        }

                                    } else {

                                        resolveLocal(instrumentSchemeService.create(item));

                                    }

                                });


                            }));
                            break;
                        case 'integrations.pricedownloadscheme':
                            resolve(new Promise(function (resolveLocal, reject) {

                                priceDownloadSchemeService.getList({
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem
                                            }

                                        });

                                        if (result) {

                                            if (settings.mode === 'overwrite') {
                                                console.warn('Price download scheme already exists: scheme name ' + item.scheme_name);
                                            } else {

                                                errors.push({
                                                    content_type: 'integrations.pricedownloadscheme',
                                                    item: item,
                                                    error: {
                                                        message: 'Price download scheme already exists: scheme name ' + item.scheme_name
                                                    },
                                                    mode: 'skip'
                                                });

                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(priceDownloadSchemeService.create(item));

                                        }

                                    } else {

                                        resolveLocal(priceDownloadSchemeService.create(item));

                                    }

                                });


                            }));
                            break;
                        case 'integrations.complextransactionimportscheme':
                            resolve(new Promise(function (resolveLocal, reject) {

                                transactionSchemeService.getList({
                                    filters: {
                                        scheme_name: item.scheme_name
                                    }
                                }).then(function (data) {

                                    if (data.results.length) {

                                        var result;

                                        data.results.forEach(function (resultItem) {

                                            if (resultItem.scheme_name === item.scheme_name) {
                                                result = resultItem
                                            }

                                        });

                                        if (result) {

                                            if (settings.mode === 'overwrite') {
                                                console.warn('Transaction import scheme already exists: scheme name ' + item.scheme_name);
                                            } else {

                                                errors.push({
                                                    content_type: 'integrations.complextransactionimportscheme',
                                                    item: item,
                                                    error: {
                                                        message: 'Transaction import scheme already exists: scheme name ' + item.scheme_name
                                                    },
                                                    mode: 'skip'
                                                });
                                            }

                                            resolveLocal()

                                        } else {

                                            resolveLocal(transactionSchemeService.create(item));

                                        }

                                    } else {

                                        resolveLocal(transactionSchemeService.create(item));

                                    }

                                });


                            }));
                            break;
                        case 'obj_attrs.portfolioattributetype':
                            resolve(createAttributeTypeIfNotExists('portfolios.portfolio', item, errors));
                            break;
                        case 'obj_attrs.accountattributetype':
                            resolve(createAttributeTypeIfNotExists('accounts.account', item, errors));
                            break;
                        case 'obj_attrs.accounttypeattributetype':
                            resolve(createAttributeTypeIfNotExists('accounts.accounttype', item, errors));
                            break;
                        case 'obj_attrs.responsibleattributetype':
                            resolve(createAttributeTypeIfNotExists('counterparties.responsible', item, errors));
                            break;
                        case 'obj_attrs.counterpartyattributetype':
                            resolve(createAttributeTypeIfNotExists('counterparties.counterparty', item, errors));
                            break;
                        case 'obj_attrs.instrumentattributetype':
                            resolve(createAttributeTypeIfNotExists('instruments.instrument', item, errors));
                            break;
                        case 'obj_attrs.instrumenttypeattributetype':
                            resolve(createAttributeTypeIfNotExists('instruments.instrumenttype', item, errors));
                            break;
                    }

                } catch (reason) {

                    console.log('createItem create error reason', reason);

                    errors.push({
                        item: item,
                        error: {
                            message: reason
                        },
                        mode: 'skip'
                    });

                    resolve(reason)

                }

            }).catch(function (reason) {

                console.log('createItem sync error reason', reason);

                var name = '';

                if (item.hasOwnProperty('scheme_name')) {
                    name = item.scheme_name
                }

                if (item.hasOwnProperty('user_code')) {
                    name = item.user_code
                }

                if (item.hasOwnProperty('name')) {
                    name = item.name
                }


                errors.push({
                    content_type: entity,
                    item: item,
                    error: {
                        message: 'Can\'t create item ' + name
                    },
                    mode: 'skip'
                });

                resolve(reason)

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

    var createEntityItems = function (entities, settings, cacheContainer, errors) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolveItem, reject) {

                    var startIndex = 0;

                    recursiveCreateItem(resolveItem, startIndex, entityItem, settings, cacheContainer, errors)
                }))

            });

            Promise.all(promises).then(function (data) {

                resolve(data)

            })

        })

    };

    var createEntities = function (items, settings, cacheContainer, errors) {

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

            var attributeTypes = items.filter(function (item) {
                return item.entity === 'obj_attrs.portfolioattributetype' ||
                    item.entity === 'obj_attrs.accountattributetype' ||
                    item.entity === 'obj_attrs.instrumentattributetype' ||
                    item.entity === 'obj_attrs.accounttypeattributetype' ||
                    item.entity === 'obj_attrs.instrumenttypeattributetype' ||
                    item.entity === 'obj_attrs.responsibleattributetype' ||
                    item.entity === 'obj_attrs.counterpartyattributetype'
            });

            var otherEntities = items.filter(function (item) {
                return item.entity !== 'transactions.transactiontype' &&
                    item.entity !== 'instruments.instrumenttype' &&
                    item.entity !== 'transactions.transactiontypegroup' &&
                    item.entity !== 'ui.editlayout' &&
                    item.entity !== 'ui.listlayout' &&
                    item.entity !== 'ui.reportlayout' &&
                    item.entity !== 'ui.bookmark' &&
                    item.entity !== 'complex_import.compleximportscheme' &&
                    item.entity !== 'obj_attrs.portfolioattributetype' &&
                    item.entity !== 'obj_attrs.accountattributetype' &&
                    item.entity !== 'obj_attrs.instrumentattributetype' &&
                    item.entity !== 'obj_attrs.accounttypeattributetype' &&
                    item.entity !== 'obj_attrs.instrumenttypeattributetype' &&
                    item.entity !== 'obj_attrs.responsibleattributetype' &&
                    item.entity !== 'obj_attrs.counterpartyattributetype'
            });

            var layoutEntities = items.filter(function (item) {
                return item.entity === 'ui.editlayout' ||
                    item.entity === 'ui.listlayout' ||
                    item.entity === 'ui.reportlayout'
            });

            var bookmarks = items.filter(function (item) {
                return item.entity === 'ui.bookmark'
            });

            var complexImportSchemes = items.filter(function (item) {
                return item.entity === 'complex_import.compleximportscheme';
            });

            // We do not need to store errors of first Instrument Types import
            createEntityItems(instrumentTypes, settings, cacheContainer, []).then(function () {

                console.log("Instrument type import success");

                createEntityItems(transactionTypeGroups, settings, cacheContainer, errors).then(function (value) {

                    console.log("Transaction type groups import success");

                    createEntityItems(transactionTypes, settings, cacheContainer, errors).then(function () {

                        console.log("Transaction type import success");

                        specialOverwriteInstrumentTypes(instrumentTypes[0]).then(function () {

                            console.log("Instrument type overwrite success");

                            createEntityItems(attributeTypes, settings, cacheContainer, errors).then(function (data) {

                                console.log("Attribute types import success");

                                createEntityItems(otherEntities, settings, cacheContainer, errors).then(function (data) {

                                    console.log("Entities import success", data);

                                    createEntityItems(complexImportSchemes, settings, cacheContainer, errors).then(function (data) {

                                        console.log("Complex import Schemes import success", data);

                                        createEntityItems(layoutEntities, settings, cacheContainer, errors).then(function (data) {

                                            console.log("Layout import success", data);

                                            createEntityItems(bookmarks, settings, cacheContainer, errors).then(function (data) {

                                                console.log("Bookmark import success", data);

                                                resolve(data);

                                            }).catch(function (reason) {

                                                console.log('importConfiguration.reason', reason);

                                                reject(reason);
                                            })

                                        })

                                    });

                                })

                            });


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

                createEntities(items, settings, cacheContainer, errors).then(function () {

                    console.log('Create items success');

                    if (settings && settings.mode === 'overwrite') {

                        overwriteEntities(items, settings, cacheContainer, errors).then(function () {

                            console.log('Overwrite items success');

                            console.log('Finish import success');

                            console.log('Error', errors);

                            resolve({
                                errors: errors
                            })
                        })

                    } else {

                        console.log('Finish import success');

                        console.log('Error', errors);

                        resolve({
                            errors: errors
                        })
                    }


                })

            })

        })

    };


    var checkForDuplicates = function (file) {

        var formData = new FormData();

        formData.append('file', file);

        return configurationImportRepository.checkForDuplicates(formData);


    };

    module.exports = {
        importConfiguration: importConfiguration,
        checkForDuplicates: checkForDuplicates
    }

}());