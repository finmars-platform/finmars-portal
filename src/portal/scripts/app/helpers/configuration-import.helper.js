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

    var toastNotificationService = require('../../../../core/services/toastNotificationService');

    var uiRepository = require('../repositories/uiRepository');


    var configurationImportBackwardCompatibility = require('./configuration-import-backward-compatibility.helper');

    // transaction type map start

    function get_input_prop_by_content_type(model) {

        if (model === 'account') {
            return {
                'prop': 'account',
                'code': 'user_code'
            }
        }
        if (model === 'instrumenttype') {
            return {
                'prop': 'instrument_type',
                'code': 'user_code'
            }
        }
        if (model === 'instrument') {
            return {
                'prop': 'instrument',
                'code': 'user_code'
            }
        }
        if (model === 'currency') {
            return {
                'prop': 'currency',
                'code': 'user_code'
            }
        }
        if (model === 'counterparty') {
            return {
                'prop': 'counterparty',
                'code': 'user_code'
            }
        }
        if (model === 'responsible') {
            return {
                'prop': 'responsible',
                'code': 'user_code'
            }
        }
        if (model === 'portfolio') {
            return {
                'prop': 'portfolio',
                'code': 'user_code'
            }
        }
        if (model === 'strategy1') {
            return {
                'prop': 'strategy1',
                'code': 'user_code'
            }
        }
        if (model === 'strategy2') {
            return {
                'prop': 'strategy2',
                'code': 'user_code'
            }
        }
        if (model === 'strategy3') {
            return {
                'prop': 'strategy3',
                'code': 'user_code'
            }
        }
        if (model === 'dailypricingmodel') {
            return {
                'prop': 'daily_pricing_model',
                'code': 'system_code'
            }
        }
        if (model === 'paymentsizedetail') {
            return {
                'prop': 'payment_size_detail',
                'code': 'system_code'
            }
        }
        if (model === 'pricedownloadscheme') {
            return {
                'prop': 'payment_size_detail',
                'code': 'scheme_name'
            }
        }
        if (model === 'pricingpolicy') {
            return {
                'prop': 'pricing_policy',
                'code': 'user_code'
            }
        }
        if (model === 'periodicity') {
            return {
                'prop': 'periodicity',
                'code': 'system_code'
            }
        }
        if (model === 'accrualcalculationmodel') {
            return {
                'prop': 'accrual_calculation_model',
                'code': 'system_code'
            }
        }
        if (model === 'eventclass') {
            return {
                'prop': 'event_class',
                'code': 'system_code'
            }
        }
        if (model === 'notifitionclass') {
            return {
                'prop': 'notification_class',
                'code': 'system_code'
            }
        }
    }

    function mapTransactionTypeInputsRelations(transactionType, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            transactionType.inputs.forEach(function (input) {

                if (input.value_type === 100) {

                    var model = input.content_type.split('.')[1];

                    var prop_data = get_input_prop_by_content_type(model);

                    var user_code_prop = '___' + prop_data.prop + '__' + prop_data.code;

                    if (input.hasOwnProperty(user_code_prop)) {

                        promises.push(new Promise(function (resolveRelation, reject) {

                            var user_code = input[user_code_prop];
                            var entity = metaContentTypesService.findEntityByContentType(input.content_type);

                            if (prop_data.code === 'user_code') {

                                getEntityByUserCode(user_code, entity, cacheContainer).then(function (data) {

                                    input[model] = data.id;

                                    resolveRelation(input)

                                });

                            }

                            if(prop_data.code === 'system_code') {

                                getEntityBySystemCode(user_code, entity, cacheContainer).then(function (data) {

                                    input[model] = data.id;

                                    resolveRelation(input)

                                });

                            }

                        }));

                    }

                }

            });

            Promise.all(promises).then(function (data) {
                resolve(data);
            })

        })

    }

    function mapTransactionTypeActionsRelations(transactionType, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            var actionsWithRelations = [
                'instrument',
                'transaction',
                'instrument_accrual_calculation_schedules',
                'instrument_event_schedule',
                'instrument_factor_schedule',
                'instrument_manual_pricing_formula'
            ];

            transactionType.actions.forEach(function (action) {

                actionsWithRelations.forEach(function (key) {

                    if (action[key]) {

                        promises.push(mapActionRelations(action, key, cacheContainer))

                    }

                })


            });

            Promise.all(promises).then(function (data) {
                resolve(data);
            })

        })

    }

    function mapRelation(item, key, entity, code_type, code, cacheContainer) {

        return new Promise(function (resolveRelation, reject) {

            if (key === 'price_download_scheme') {

                getSchemeBySchemeName(code, entity).then(function (data) {

                    item[key] = data.id;

                    resolveRelation(item)

                });

            } else {


                if (code_type === 'user_code') {

                    getEntityByUserCode(code, entity, cacheContainer).then(function (data) {

                        item[key] = data.id;

                        resolveRelation(item)

                    });

                }

                if (code_type === 'system_code') {

                    getEntityBySystemCode(code, entity, cacheContainer).then(function (data) {

                        item[key] = data.id;

                        resolveRelation(item)

                    });

                }

            }

        })

    }

    function mapAttributeType(item, key, entity, code) {

        console.log('code', code);
        console.log('entity', entity);

        return new Promise(function (resolve, reject) {

            getAttributeTypeByUserCode(code, entity).then(function (data) {

                item[key] = data.id;

                resolve(item)

            }).catch(function (reason) {

                toastNotificationService.error(reason);

                resolve(reason)

            })

        })

    }

    function mapActionRelations(action, key, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            var relationProps = {
                'instrument': [
                    {
                        'key': 'accrued_currency',
                        'code_type': 'user_code',
                        'entity': 'currency'
                    },
                    {
                        'key': 'daily_pricing_model',
                        'code_type': 'system_code',
                        'entity': 'daily-pricing-model'
                    },
                    {
                        'key': 'instrument_type',
                        'code_type': 'user_code',
                        'entity': 'instrument-type'
                    },
                    {
                        'key': 'payment_size_detail',
                        'code_type': 'system_code',
                        'entity': 'payment-size-detail'
                    },
                    {
                        'key': 'price_download_scheme',
                        'code_type': 'scheme_name',
                        'entity': 'price-download-scheme'
                    },
                    {
                        'key': 'pricing_currency',
                        'code_type': 'user_code',
                        'entity': 'currency'
                    }],
                'transaction': [
                    {
                        'key': 'account_cash',
                        'code_type': 'user_code',
                        'entity': 'account'
                    },
                    {
                        'key': 'account_interim',
                        'code_type': 'user_code',
                        'entity': 'account'
                    },
                    {
                        'key': 'account_position',
                        'code_type': 'user_code',
                        'entity': 'account'
                    },
                    {
                        'key': 'allocation_balance',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'allocation_pl',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'linked_instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'portfolio',
                        'code_type': 'user_code',
                        'entity': 'portfolio'
                    },
                    {
                        'key': 'responsible',
                        'code_type': 'user_code',
                        'entity': 'responsible'
                    },
                    {
                        'key': 'counterparty',
                        'code_type': 'user_code',
                        'entity': 'counterparty'
                    },
                    {
                        'key': 'settlement_currency',
                        'code_type': 'user_code',
                        'entity': 'currency'
                    },
                    {
                        'key': 'strategy1_cash',
                        'code_type': 'user_code',
                        'entity': 'strategy-1'
                    },
                    {
                        'key': 'strategy1_position',
                        'code_type': 'user_code',
                        'entity': 'strategy-1'
                    },
                    {
                        'key': 'strategy2_cash',
                        'code_type': 'user_code',
                        'entity': 'strategy-2'
                    },
                    {
                        'key': 'strategy2_position',
                        'code_type': 'user_code',
                        'entity': 'strategy-2'
                    },
                    {
                        'key': 'strategy3_cash',
                        'code_type': 'user_code',
                        'entity': 'strategy-3'
                    },
                    {
                        'key': 'strategy3_position',
                        'code_type': 'user_code',
                        'entity': 'strategy-3'
                    },
                    {
                        'key': 'transaction_class',
                        'code_type': 'system_code',
                        'entity': 'transaction-class'
                    },
                    {
                        'key': 'transaction_currency',
                        'code_type': 'user_code',
                        'entity': 'currency'
                    }
                ],
                'instrument_factor_schedule': [
                    {
                        'key': 'instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    }],
                'instrument_manual_pricing_formula': [
                    {
                        'key': 'instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    }, {
                        'key': 'pricing_policy',
                        'code_type': 'user_code',
                        'entity': 'pricing-policy'
                    }],
                'instrument_accrual_calculation_schedules': [
                    {
                        'key': 'instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'periodicity',
                        'code_type': 'system_code',
                        'entity': 'periodicity'
                    },
                    {
                        'key': 'accrual_calculation_model',
                        'code_type': 'system_code',
                        'entity': 'accrual-calculation-model'
                    }],
                'instrument_event_schedule': [
                    {
                        'key': 'instrument',
                        'code_type': 'user_code',
                        'entity': 'instrument'
                    },
                    {
                        'key': 'periodicity',
                        'code_type': 'system_code',
                        'entity': 'periodicity'
                    },
                    {
                        'key': 'notification_class',
                        'code_type': 'system_code',
                        'entity': 'notification-class'
                    },
                    {
                        'key': 'event_class',
                        'code_type': 'system_code',
                        'entity': 'event-class'
                    }]
            };

            relationProps[key].forEach(function (propItem) {

                var code_prop = '___' + propItem.key + '__' + propItem.code_type;

                // console.log('code_prop', code_prop);
                // console.log('action', action);

                // TODO Make recursive like import method to make caching work properly

                if (action[key].hasOwnProperty(code_prop)) {

                    var code = action[key][code_prop];
                    var code_type = propItem.code_type;
                    var entity = propItem.entity;
                    var item = action[key];
                    var item_key = propItem.key;

                    promises.push(mapRelation(item, item_key, entity, code_type, code, cacheContainer))


                }


            });

            Promise.all(promises).then(function (data) {

                resolve(action);

            })

        })

    }

    // transaction type map end

    function mapReportOptions(layout, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            if (layout.data.reportOptions) {

                if (layout.data.reportOptions.pricing_policy_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var user_code = layout.data.reportOptions.pricing_policy_object.user_code;

                        getEntityByUserCode(user_code, 'pricing-policy', cacheContainer).then(function (data) {

                            layout.data.reportOptions.pricing_policy = data.id;
                            layout.data.reportOptions.pricing_policy_object = data;

                            resolveRelation(layout)

                        })

                    }))

                }

                if (layout.data.reportOptions.report_currency_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var user_code = layout.data.reportOptions.report_currency_object.user_code;

                        getEntityByUserCode(user_code, 'currency', cacheContainer).then(function (data) {

                            layout.data.reportOptions.report_currency = data.id;
                            layout.data.reportOptions.report_currency_object = data;

                            resolveRelation(layout)

                        })

                    }))

                }

                if (layout.data.reportOptions.cost_method_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var system_code = layout.data.reportOptions.cost_method_object.system_code;

                        getEntityBySystemCode(system_code, 'cost-method', cacheContainer).then(function (data) {

                            layout.data.reportOptions.cost_method = data.id;
                            layout.data.reportOptions.cost_method_object = data;

                            resolveRelation(layout)

                        })

                    }))

                }

                layout.data.reportOptions.portfolios = [];
                layout.data.reportOptions.accounts = [];
                layout.data.reportOptions.strategies1 = [];
                layout.data.reportOptions.strategies2 = [];
                layout.data.reportOptions.strategies3 = [];

            }

            Promise.all(promises).then(function () {
                resolve(layout)
            })

        })

    }

    function handleEditLayoutMap(layout) {

        return new Promise(function (resolve) {

            var entityType = metaContentTypesService.findEntityByContentType(layout.content_type, 'ui');

            attributeTypeService.getList(entityType).then(function (data) {

                var layoutAttrs = data.results;

                if (layout.data) {

                    layout.data.forEach(function (tab) {

                        tab.layout.fields.forEach(function (field) {

                            if (field.attribute && field.attribute.id) {

                                var mapped = false;

                                layoutAttrs.forEach(function (layoutAttr) {

                                    if (layoutAttr.user_code === field.attribute.user_code) {
                                        field.attribute = layoutAttr;
                                        field.id = layoutAttr.id;
                                        mapped = true;
                                    }

                                });

                                if (mapped === false) {
                                    field.attribute = null;
                                    field.id = null;
                                    field.attribute_class = null;
                                    field.type = "empty"
                                }


                            }

                        })

                    });
                }

                resolve(layout);

            });

        })

    }

    function handleListLayoutMap(layout, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            if (layout.data) {

                promises.push(mapReportOptions(layout, cacheContainer));

                var code;
                var entity;
                var item;
                var item_key;

                console.log('handleListLayoutMap', layout);

                layout.data.columns.forEach(function (column) {

                    if (column.hasOwnProperty('id')) {

                        code = column.user_code;
                        entity = column.entity;
                        item = column;
                        item_key = 'id';

                        promises.push(mapAttributeType(item, item_key, entity, code));

                    }


                });


                layout.data.grouping.forEach(function (group) {

                    if (group.hasOwnProperty('id')) {

                        code = group.user_code;
                        entity = group.entity;
                        item = group;
                        item_key = 'id';

                        promises.push(mapAttributeType(item, item_key, entity, code));

                    }

                });

            }

            Promise.all(promises).then(function (data) {
                resolve(data)
            }).catch(function (reason) {

                reject(reason)
            })
        })

    }

    var getEntityByUserCode = function (user_code, entity, cacheContainer) {

        if (!cacheContainer) {
            cacheContainer = {}; // no cache then
        }

        return new Promise(function (resolve, reject) {

            if (!cacheContainer[entity]) {
                cacheContainer[entity] = {};
            }

            console.log(JSON.parse(JSON.stringify(cacheContainer[entity])));

            if (cacheContainer[entity][user_code]) {

                console.log('From cache: ', cacheContainer[entity][user_code]);

                resolve(cacheContainer[entity][user_code]);

            } else {

                entityResolverService.getList(entity, {
                    filters: {
                        "user_code": user_code
                    }
                }).then(function (data) {

                    if (data.results.length) {

                        data.results.forEach(function (item) {

                            if (item.user_code === user_code) {
                                cacheContainer[entity][user_code] = item;
                                resolve(item)
                            }

                        })

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
                        reject(new Error("Scheme with name'-' does not exist"))
                    }

                }

            })

        })

    };

    var mapFieldsInInstrumentType = function (item) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            if (item.hasOwnProperty('___one_off_event__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___one_off_event__user_code;

                    getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.one_off_event = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___regular_event__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___regular_event__user_code;

                    getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.regular_event = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_same__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_same__user_code;

                    getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.factor_same = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_up__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_up__user_code;

                    getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.factor_up = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_down__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_down__user_code;

                    getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.factor_down = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            Promise.all(promises).then(function (value) {

                resolve(item);

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

    var overwriteInstrumentTypes = function (entity) {

        return new Promise(function (resolve, reject) {

            if (entity) {

                var instrumentTypes = entity.content.filter(function (item) {
                    return item.active;
                });

                console.log('instrumentTypes', instrumentTypes);

                getInstrumentsTypesWithIds(instrumentTypes).then(function (items) {

                    console.log('instrumentTypes with ids', items);

                    var promises = [];

                    items.forEach(function (item) {

                        mapFieldsInInstrumentType(item).then(function (updatedItem) {

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

    var recursiveImportItem = function (resolve, index, entityItem, cacheContainer) {

        var item = entityItem.content[index];

        index = index + 1;

        if (item.active) {

            importItem(item, entityItem.entity, cacheContainer).then(function () {

                window.importConfigurationCounter = window.importConfigurationCounter + 1;

                if (index === entityItem.content.length) {
                    resolve(item);
                } else {
                    recursiveImportItem(resolve, index, entityItem, cacheContainer)
                }

            })
        } else {
            if (index === entityItem.content.length) {
                resolve(item);
            } else {
                recursiveImportItem(resolve, index, entityItem, cacheContainer)
            }
        }

    };

    var importEntities = function (entities, cacheContainer) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            entities.forEach(function (entityItem) {

                promises.push(new Promise(function (resolve, reject) {

                    var startIndex = 0;

                    recursiveImportItem(resolve, startIndex, entityItem, cacheContainer)
                }))

            });

            Promise.all(promises).then(function (data) {
                resolve(data)
            })

        })

    };

    var importItem = function (item, entity, cacheContainer) {

        return new Promise(function (resolve, reject) {

            switch (entity) {

                case 'transactions.transactiontype':
                    resolve(new Promise(function (resolveLocal, reject) {

                        new Promise(function (resolveMap, reject) {

                            var promises = [];

                            if (item.hasOwnProperty('___group__user_code')) {

                                promises.push(new Promise(function (resolveRelation, reject) {

                                    var user_code = item.___group__user_code;

                                    getEntityByUserCode(user_code, 'transaction-type-group', cacheContainer).then(function (data) {

                                        item.group = data.id;

                                        resolveRelation(item)

                                    });

                                }));

                            }

                            promises.push(mapTransactionTypeInputsRelations(item, cacheContainer));

                            promises.push(mapTransactionTypeActionsRelations(item, cacheContainer));

                            Promise.all(promises).then(function (data) {

                                resolveMap(data);

                            })

                        }).then(function (value) {

                            resolveLocal(entityResolverService.create('transaction-type', item))

                        })

                    }));
                    break;
                case 'transactions.transactiontypegroup':
                    resolve(entityResolverService.create('transaction-type-group', item));
                    break;
                case 'accounts.accounttype':
                    resolve(entityResolverService.create('account-type', item));
                    break;
                case 'instruments.pricingpolicy':
                    resolve(entityResolverService.create('pricing-policy', item));
                    break;
                case 'instruments.instrumenttype':
                    resolve(entityResolverService.create('instrument-type', item));
                    break;
                case 'import.pricingautomatedschedule':
                    resolve(pricingAutomatedScheduleService.updateSchedule(item));
                    break;
                case 'ui.editlayout':
                    handleEditLayoutMap(item).then(function (value) {

                        var entityType = metaContentTypesService.findEntityByContentType(item.content_type, 'ui');

                        var promise = new Promise(function (resolveLocal, reject) {

                            uiRepository.getEditLayout(entityType).then(function (data) {

                                if (data.results.length) {
                                    uiRepository.updateEditLayout(data.results[0].id, item).then(function (item) {
                                        resolveLocal({})
                                    })
                                } else {
                                    uiRepository.createEditLayout(item).then(function (item) {
                                        resolveLocal({})
                                    })
                                }

                            });

                        });

                        resolve(promise);

                    });
                    break;
                case 'ui.listlayout':
                    resolve(new Promise(function (resolve, reject) {
                        handleListLayoutMap(item, cacheContainer).then(function (value) {

                            console.log('handleListLayoutMap', item);

                            uiRepository.getListLayoutDefault({
                                filters: {
                                    name: item.name,
                                    content_type: item.content_type
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var layout = data.results[0];
                                    var name = layout.name.split(item.name)[1];

                                    if (data.results.length !== 1) {

                                        item.name = item.name + ' (' + data.results.length + ')';

                                    } else {

                                        item.name = item.name + ' (1)'
                                    }

                                }

                                resolve(uiRepository.createListLayout(item));

                            });

                        })
                    }));
                    break;
                case 'ui.reportlayout':
                    resolve(new Promise(function (resolve, reject) {
                        handleListLayoutMap(item, cacheContainer).then(function (value) {

                            console.log('handleListLayoutMap', item);

                            uiRepository.getListLayoutDefault({
                                filters: {
                                    name: item.name,
                                    content_type: item.content_type
                                }
                            }).then(function (data) {

                                if (data.results.length) {

                                    var layout = data.results[0];
                                    var name = layout.name.split(item.name)[1];

                                    console.log('name', name);

                                    if (data.results.length !== 1) {

                                        item.name = item.name + ' (' + data.results.length + ')';

                                    } else {

                                        item.name = item.name + ' (1)'
                                    }

                                }

                                resolve(uiRepository.createListLayout(item));

                            });

                        })
                    }));
                    break;
                case 'csv_import.scheme':
                    resolve(entitySchemeService.create(item));
                    break;
                case 'integrations.instrumentdownloadscheme':
                    resolve(new Promise(function (resolveLocal, reject) {

                        return new Promise(function (resolveLocal) {

                            var promises = [];

                            if (item.hasOwnProperty('___price_download_scheme__scheme_name')) {

                                var code = '___price_download_scheme__scheme_name';
                                var code_type = 'scheme_name';
                                var entity = 'price-download-scheme';
                                var item_key = 'price_download_scheme';

                                promises.push(mapRelation(item, item_key, entity, code_type, code, cacheContainer))

                            }

                            Promise.all(promises).then(function (data) {

                                resolveLocal(data)
                            });


                        }).then(function (value) {

                            resolveLocal(instrumentSchemeService.create(item))

                        });

                    }));
                    break;
                case 'integrations.pricedownloadscheme':
                    resolve(priceDownloadSchemeService.create(item));
                    break;
                case 'integrations.complextransactionimportscheme':
                    resolve(new Promise(function (resolveLocal, reject) {

                            return new Promise(function (resolveLocalMap) {

                                var promises = [];

                                item.rules.forEach(function (rule) {

                                    if (rule.hasOwnProperty('___transaction_type__user_code')) {

                                        promises.push(new Promise(function (resolveRelation, reject) {

                                            var user_code = rule.___transaction_type__user_code;

                                            getEntityByUserCode(user_code, 'transaction-type', cacheContainer).then(function (data) {

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

                                    resolveLocalMap(data);

                                })

                            }).then(function (value) {

                                resolveLocal(transactionSchemeService.create(item));

                            })

                        })
                    );
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

        })

    };

    var importConfiguration = function (items) {

        return new Promise(function (resolve, reject) {

            configurationImportBackwardCompatibility.repairItems(items).then(function () {

                console.log('Repair items success');

                var promises = [];

                var instrumentTypes = items.filter(function (item) {
                    return item.entity === 'instruments.instrumenttype';
                });

                var instrumentTypeGroups = items.filter(function (item) {
                    return item.entity === 'instruments.instrumenttypegroup';
                });

                var transactionTypes = items.filter(function (item) {
                    return item.entity === 'transactions.transactiontype';
                });

                var otherEntities = items.filter(function (item) {
                    return item.entity !== 'transactions.transactiontype' &&
                        item.entity !== 'instruments.instrumenttype' &&
                        item.entity !== 'ui.editlayout' &&
                        item.entity !== 'ui.listlayout' &&
                        item.entity !== 'ui.reportlayout'
                });

                var layoutEntities = items.filter(function (item) {
                    return item.entity === 'ui.editlayout' ||
                        item.entity === 'ui.listlayout' ||
                        item.entity === 'ui.reportlayout'
                });

                console.log('instrumentTypes', instrumentTypes);
                console.log('transactionTypes', transactionTypes);
                console.log('otherEntities', otherEntities);
                console.log('layoutEntities', layoutEntities);

                var cacheContainer = {};

                importEntities(instrumentTypes, cacheContainer).then(function () {

                    console.log("Instrument type import success");

                    importEntities(instrumentTypeGroups, cacheContainer).then(function (value) {

                        console.log("Transaction type groups import success");

                        importEntities(transactionTypes, cacheContainer).then(function () {

                            console.log("Transaction type import success");

                            overwriteInstrumentTypes(instrumentTypes[0]).then(function () {

                                console.log("Instrument type overwrite success");

                                importEntities(otherEntities, cacheContainer).then(function (data) {

                                    console.log("Entities import success", data);

                                    importEntities(layoutEntities, cacheContainer).then(function (data) {

                                        console.log("Layout import success", data);

                                        resolve(data);

                                    }).catch(function (reason) {

                                        console.log('importConfiguration.reason', reason);

                                        reject(reason);
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