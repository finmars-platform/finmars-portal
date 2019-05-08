/**
 * Created by szhitenev on 12.09.2016.
 */
(function () {

    'use strict';

    var metaContentTypesService = require('../../services/metaContentTypesService');

    var toastNotificationService = require('../../../../../core/services/toastNotificationService');

    var configurationImportGetService = require('./configurationImportGetService');

    var attributeTypeService = require('../../services/attributeTypeService');

    var get_input_prop_by_content_type = function (model) {

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
    };

    var mapTransactionTypeInputsRelations = function (transactionType, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            transactionType.inputs.forEach(function (input) {

                if (input.value_type === 100) {

                    var model = input.content_type.split('.')[1];

                    var prop_data = get_input_prop_by_content_type(model);

                    var user_code_prop = '___' + prop_data.prop + '__' + prop_data.code;

                    if (input.hasOwnProperty(user_code_prop)) {

                        promises.push(new Promise(function (resolveRelation, reject) {

                            // console.log('input', input);
                            // console.log('input.content_type', input.content_type);

                            var user_code = input[user_code_prop];
                            var entity = metaContentTypesService.findEntityByContentType(input.content_type);

                            // console.log('input.entity', entity);

                            if (prop_data.code === 'user_code') {

                                configurationImportGetService.getEntityByUserCode(user_code, entity, cacheContainer).then(function (data) {

                                    input[model] = data.id;

                                    resolveRelation(input)

                                });

                            }

                            if (prop_data.code === 'system_code') {

                                configurationImportGetService.getEntityBySystemCode(user_code, entity, cacheContainer).then(function (data) {

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

    };

    var mapTransactionTypeActionsRelations = function (transactionType, cacheContainer) {

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

    };

    var mapRelation = function (item, key, entity, code_type, code, cacheContainer) {

        return new Promise(function (resolveRelation, reject) {

            if (key === 'price_download_scheme' || key === 'complex_transaction_import_scheme' || key === 'csv_import_scheme') {

                configurationImportGetService.getSchemeBySchemeName(code, entity).then(function (data) {

                    item[key] = data.id;

                    resolveRelation(item)

                });

            } else {


                if (code_type === 'user_code') {

                    configurationImportGetService.getEntityByUserCode(code, entity, cacheContainer).then(function (data) {

                        item[key] = data.id;

                        resolveRelation(item)

                    });

                }

                if (code_type === 'system_code') {

                    configurationImportGetService.getEntityBySystemCode(code, entity, cacheContainer).then(function (data) {

                        item[key] = data.id;

                        resolveRelation(item)

                    });

                }

            }

        })

    };

    var mapAttributeType = function (item, key, entity, code) {

        console.log('code', code);
        console.log('entity', entity);
        console.log('item', item);
        console.log('key', key);

        return new Promise(function (resolve, reject) {

            configurationImportGetService.getAttributeTypeByUserCode(code, entity).then(function (data) {

                var pieces = item[key].split('.');
                pieces.splice(-1, 1);
                pieces.push(data.id);
                var result = pieces.join('.');
                item[key] = result;

                resolve(item)

            }).catch(function (reason) {

                console.error(reason);

                toastNotificationService.error(reason);

                resolve(reason)

            })

        })

    };

    var mapActionRelations = function (action, key, cacheContainer) {

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

    };

    var mapReportOptions = function (layout, cacheContainer) {

        return new Promise(function (resolve) {

            var promises = [];

            if (layout.data.reportOptions) {

                if (layout.data.reportOptions.pricing_policy_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var user_code = layout.data.reportOptions.pricing_policy_object.user_code;

                        configurationImportGetService.getEntityByUserCode(user_code, 'pricing-policy', cacheContainer).then(function (data) {

                            layout.data.reportOptions.pricing_policy = data.id;
                            layout.data.reportOptions.pricing_policy_object = data;

                            resolveRelation(layout)

                        })

                    }))

                }

                if (layout.data.reportOptions.report_currency_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var user_code = layout.data.reportOptions.report_currency_object.user_code;

                        configurationImportGetService.getEntityByUserCode(user_code, 'currency', cacheContainer).then(function (data) {

                            layout.data.reportOptions.report_currency = data.id;
                            layout.data.reportOptions.report_currency_object = data;

                            resolveRelation(layout)

                        })

                    }))

                }

                if (layout.data.reportOptions.cost_method_object) {

                    promises.push(new Promise(function (resolveRelation, reject) {

                        var system_code = layout.data.reportOptions.cost_method_object.system_code;

                        configurationImportGetService.getEntityBySystemCode(system_code, 'cost-method', cacheContainer).then(function (data) {

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

    };

    var mapFieldsInInstrumentType = function (item) {

        return new Promise(function (resolve, reject) {

            var promises = [];

            if (item.hasOwnProperty('___one_off_event__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___one_off_event__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.one_off_event = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___regular_event__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___regular_event__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.regular_event = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_same__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_same__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.factor_same = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_up__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_up__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                        item.factor_up = data.id;

                        resolveRelation(item)

                    });

                }));

            }

            if (item.hasOwnProperty('___factor_down__user_code')) {

                promises.push(new Promise(function (resolveRelation, reject) {

                    var user_code = item.___factor_down__user_code;

                    configurationImportGetService.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

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

    var mapEditLayout = function (layout) {

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

    };

    var recursiveMapItemInLayout = function (resolve, items, index) {

        if (items.length) {

            if (items[index].hasOwnProperty('attribute_type')) {



                var code = items[index].attribute_type.user_code;
                var entity = metaContentTypesService.findEntityByContentType(items[index].content_type, 'ui');
                var item = items[index];
                var item_key = 'key';

                if (entity) {

                    mapAttributeType(item, item_key, entity, code).then(function () {

                        if (index < items.length - 1) {
                            index = index + 1;
                            recursiveMapItemInLayout(resolve, items, index);
                        } else {
                            resolve(items);
                        }

                    }).catch(function (error) {

                        items.splice(index, 1);

                        index = index - 1;

                        console.log('splice items', items);

                        if (index < items.length - 1) {
                            recursiveMapItemInLayout(resolve, items, index)
                        } else {
                            resolve(items);
                        }

                    })

                } else {

                    items.splice(index, 1);

                    index = index - 1;

                    console.log('splice items', items);

                    if (index < items.length - 1) {
                        recursiveMapItemInLayout(resolve, items, index)
                    } else {
                        resolve(items);
                    }

                }

            } else {
                if (index < items.length - 1) {

                    index = index + 1;
                    recursiveMapItemInLayout(resolve, items, index)

                } else {

                    resolve(items)

                }
            }

        } else {
            resolve(items)
        }

    };

    var recursiveMapListLayout = function (items) {

        return new Promise(function (resolve, reject) {

            var startIndex = 0;

            recursiveMapItemInLayout(resolve, items, startIndex);

        })

    };

    var mapListLayout = function (layout, cacheContainer) {

        return new Promise(function (resolve, reject) {

            if (layout.data) {

                mapReportOptions(layout, cacheContainer).then(function (layout) {

                    recursiveMapListLayout(layout.data.columns).then(function (columns) {

                        layout.data.columns = columns;

                        recursiveMapListLayout(layout.data.grouping).then(function (grouping) {

                            layout.data.grouping = grouping;

                            resolve(layout)

                        })


                    });

                })
            } else {
                resolve(layout)
            }
        })

    };

    module.exports = {
        mapTransactionTypeInputsRelations: mapTransactionTypeInputsRelations,
        mapTransactionTypeActionsRelations: mapTransactionTypeActionsRelations,
        mapRelation: mapRelation,
        mapAttributeType: mapAttributeType,
        mapActionRelations: mapActionRelations,
        mapReportOptions: mapReportOptions,
        mapFieldsInInstrumentType: mapFieldsInInstrumentType,
        mapEditLayout: mapEditLayout,
        mapListLayout: mapListLayout
    }

}());