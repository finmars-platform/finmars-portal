/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var entitySchemeService = require('../../services/import/entitySchemeService');
    var priceDownloadSchemeService = require('../../services/import/priceDownloadSchemeService');
    var instrumentSchemeService = require('../../services/import/instrumentSchemeService');
    var entityResolverService = require('../../services/entityResolverService');
    var transactionSchemeService = require('../../services/import/transactionSchemeService');
    var pricingAutomatedScheduleService = require('../../services/import/pricingAutomatedScheduleService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var md5helper = require('../../helpers/md5.helper');
    var configurationImportHelper = require('../../helpers/configuration-import.helper');
    var uiRepository = require('../../repositories/uiRepository');

    module.exports = function ($scope, $mdDialog, file) {

        console.log("file", file);

        var vm = this;

        vm.items = file.body;

        vm.items.forEach(function (item) {

            item.active = false;

            item.content.forEach(function (child) {
                child.active = false;
            });

        });

        vm.getEntityName = function (item) {

            switch (item.entity) {
                case 'transactions.transactiontype':
                    return "Transaction Types";
                case 'accounts.accounttype':
                    return "Account Types";
                case 'instruments.instrumenttype':
                    return "Instrument Types";
                case 'import.pricingautomatedschedule':
                    return 'Automated uploads schedule ';
                case 'ui.editlayout':
                    return "Input Form";
                case 'ui.listlayout':
                    return "Entity viewer layouts";
                case 'ui.reportlayout':
                    return "Report builder layouts";
                case 'csv_import.scheme':
                    return "Data import from CSV schemes";
                case 'integrations.instrumentdownloadscheme':
                    return "Instrument Download Schemes";
                case 'integrations.pricedownloadscheme':
                    return "Price Download Schemes";
                case 'integrations.complextransactionimportscheme':
                    return "Complex Transaction Import Scheme";
                case 'obj_attrs.portfolioattributetype':
                    return "Portfolio Dynamic Attributes";
                case 'obj_attrs.accountattributetype':
                    return "Account Dynamic Attributes";
                case 'obj_attrs.accounttypeattributetype':
                    return "Account Type Dynamic Attributes";
                case 'obj_attrs.responsibleattributetype':
                    return "Responsible Dynamic Attributes";
                case 'obj_attrs.counterpartyattributetype':
                    return "Counterparty Dynamic Attributes";
                case 'obj_attrs.instrumentattributetype':
                    return "Instrument Dynamic Attributes";
                case 'obj_attrs.instrumenttypeattributetype':
                    return "Instrument Type Dynamic Attributes";
                default:
                    return "Unknown"
            }

        };

        vm.getItemName = function (item) {

            if (item.hasOwnProperty('user_code')) {
                return item.user_code
            }

            if (item.hasOwnProperty('scheme_name')) {
                return item.scheme_name;
            }

            if (item.hasOwnProperty('name')) {

                if (item.hasOwnProperty('csv_fields')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                if (item.hasOwnProperty('data')) {
                    return item.name + ' (' + metaContentTypesService.getEntityNameByContentType(item.content_type) + ')'
                }

                return item.name
            }

            if (item.hasOwnProperty('content_type')) {
                return metaContentTypesService.getEntityNameByContentType(item.content_type)
            }

            if (item.hasOwnProperty('last_run_at')) { // import.pricingautomatedschedule
                return "Schedule"
            }

        };

        vm.toggleActiveForChilds = function (item) {

            item.active = !item.active;

            item.content.forEach(function (child) {
                child.active = item.active;
            })

        };

        vm.updateActiveForParent = function (item, parent) {

            item.active = !item.active;

            var active = true;

            parent.content.forEach(function (item) {

                if (item.active === false) {
                    active = false;
                }

            });

            parent.active = active;


        };

        vm.getEntityDependenciesCaptions = function (entity) {

            var result = '';

            if (entity.dependencies && entity.dependencies.length) {

                result = result + '(Depends on: ';

                var dependenciesList = [];

                entity.dependencies.forEach(function (dependency) {

                    dependenciesList.push(metaContentTypesService.getEntityNameByContentType(dependency.entity))

                });

                result = result + dependenciesList.join(', ');

                result = result + ')';

            }


            return result;

        };

        function isEntityExistsAndSelected(items, entityName) {

            var entity = findEntity(items, entityName);

            var result = false;

            if (entity) {

                entity.content.forEach(function (item) {

                    if (item.active) {
                        result = true;
                    }

                });

            }

            return result;

        }

        function findEntity(items, entityName) {

            var result;

            items.forEach(function (item) {

                if (item.entity === entityName) {
                    result = item;
                }

            });

            return result;

        }

        function mapComplexTransactionImportSchemeRelations(complexTransactionImportSchemeEntity) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                complexTransactionImportSchemeEntity.content.forEach(function (entityItem) {

                    if (entityItem.active) {

                        entityItem.rules.forEach(function (rule) {

                            if (rule.hasOwnProperty('___transaction_type__user_code')) {

                                promises.push(new Promise(function (resolveRelation, reject) {

                                    var user_code = rule.___transaction_type__user_code;

                                    configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                        rule.transaction_type = data.id;

                                        rule.fields.forEach(function (field) {

                                            data.inputs.forEach(function (input) {

                                                if (field.___input__name === input.name) {
                                                    field.transaction_type_input = input.id;
                                                }

                                            })


                                        });


                                        resolveRelation(entityItem)

                                    });

                                }));

                            }

                        })

                    }

                });

                Promise.all(promises).then(function (data) {
                    resolve(data)
                })

            });
        }

        function mapInstrumentDownloadSchemeRelations(instrumentDownloadSchemeEntity) {

            return new Promise(function (resolve, reject) {

                resolve({})

                // priceDownloadSchemeService.getList().then(function (data) {
                //
                //     var schemes = data.results;
                //
                //     instrumentDownloadSchemeEntity.content.forEach(function (entityItem) {
                //
                //         schemes.forEach(function (scheme) {
                //
                //             if (entityItem.___price_download_scheme__scheme_name === scheme.scheme_name) {
                //                 entityItem.price_download_scheme = scheme.id;
                //             }
                //
                //         })
                //
                //     });
                //
                //     resolve(instrumentDownloadSchemeEntity);
                //
                // });

            })

        }

        function mapInstrumentTypeRelations(instrumentTypeEntity) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                instrumentTypeEntity.content.forEach(function (entityItem) {

                    if (entityItem.active) {

                        if (entityItem.hasOwnProperty('___one_off_event__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___one_off_event__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                    entityItem.one_off_event = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                        if (entityItem.hasOwnProperty('___regular_event__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___regular_event__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                    entityItem.regular_event = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                        if (entityItem.hasOwnProperty('___factor_same__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___factor_same__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                    entityItem.factor_same = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                        if (entityItem.hasOwnProperty('___factor_up__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___factor_up__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                    entityItem.factor_up = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                        if (entityItem.hasOwnProperty('___factor_down__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___factor_down__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type').then(function (data) {

                                    entityItem.factor_down = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                    }

                });

                Promise.all(promises).then(function () {
                    resolve(instrumentTypeEntity);
                });

            });

        }

        // transaction type map start

        function mapTransactionTypeRelations(transactionTypeEntity) {

            return new Promise(function (resolve) {

                var promises = [];

                transactionTypeEntity.content.forEach(function (entityItem) {

                    if (entityItem.active) {

                        if (entityItem.hasOwnProperty('___group__user_code')) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = entityItem.___group__user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'transaction-type-group').then(function (data) {

                                    entityItem.group = data.id;

                                    resolveRelation(entityItem)

                                });

                            }));

                        }

                        promises.push(mapTransactionTypeInputsRelations(entityItem));

                        promises.push(mapTransactionTypeActionsRelations(entityItem));

                    }

                });

                Promise.all(promises).then(function (data) {
                    resolve(data)
                })

            })

        }

        function mapTransactionTypeInputsRelations(transactionType) {

            return new Promise(function (resolve) {

                var promises = [];

                transactionType.inputs.forEach(function (input) {

                    if (input.value_type === 100) {

                        var model = input.content_type.split('.')[1];

                        var user_code_prop = '___' + model + '__user_code';

                        if (input.hasOwnProperty(user_code_prop)) {

                            promises.push(new Promise(function (resolveRelation, reject) {

                                var user_code = input[user_code_prop];
                                var entity = metaContentTypesService.findEntityByContentType(input.content_type);

                                configurationImportHelper.getEntityByUserCode(user_code, entity).then(function (data) {

                                    input[model] = data.id;

                                    resolveRelation(input)

                                });

                            }));

                        }

                    }

                });

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        function mapTransactionTypeActionsRelations(transactionType) {

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

                            promises.push(mapActionRelations(action, key))

                        }

                    })


                });

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        function mapActionRelations(action, key) {

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

                    if (propItem.hasOwnProperty(code_prop)) {

                        promises.push(new Promise(function (resolveRelation, reject) {

                            if (propItem.code_type === 'user_code') {

                                var user_code = input[code_prop];

                                configurationImportHelper.getEntityByUserCode(user_code, propItem.entity).then(function (data) {

                                    action[propItem.key] = data.id;

                                    resolveRelation(action)

                                });

                            } else {

                                var system_code = input[code_prop];

                                configurationImportHelper.getEntityBySystemCode(system_code, propItem.entity).then(function (data) {

                                    action[propItem.key] = data.id;

                                    resolveRelation(action)

                                });

                            }

                        }));

                    }


                });

                Promise.all(promises).then(function (data) {

                    resolve(action);

                })

            })

        }

        // transaction type map end

        function handleEditLayoutMap(layout) {

            return new Promise(function (resolve) {

                var entityType = metaContentTypesService.findEntityByContentType(layout.content_type, 'ui');

                attributeTypeService.getList(entityType).then(function (data) {

                    var layoutAttrs = data.results;

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

                    resolve(layout);

                });

            })

        }

        function handleListLayoutMap(layout) {

            console.log('handleListLayoutMap', layout);

            return new Promise(function (resolve) {

                if (layout.data) {

                    if (layout.data.reportOptions) {

                        var promises = [];

                        if (layout.data.reportOptions.pricing_policy_object) {

                            promises.push(new Promise(function (resolve, reject) {

                                var user_code = layout.data.reportOptions.pricing_policy_object.user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'pricing-policy').then(function (data) {

                                    layout.data.reportOptions.pricing_policy = data.id;
                                    layout.data.reportOptions.pricing_policy_object = data;

                                    resolve(layout)

                                })

                            }))

                        }

                        if (layout.data.reportOptions.report_currency_object) {

                            promises.push(new Promise(function (resolve, reject) {

                                var user_code = layout.data.reportOptions.report_currency_object.user_code;

                                configurationImportHelper.getEntityByUserCode(user_code, 'currency').then(function (data) {

                                    layout.data.reportOptions.report_currency = data.id;
                                    layout.data.reportOptions.report_currency_object = data;

                                    resolve(layout)

                                })

                            }))

                        }

                        if (layout.data.reportOptions.cost_method_object) {

                            promises.push(new Promise(function (resolve, reject) {

                                var system_code = layout.data.reportOptions.cost_method_object.system_code;

                                configurationImportHelper.getEntityBySystemCode(system_code, 'cost-method').then(function (data) {

                                    layout.data.reportOptions.cost_method = data.id;
                                    layout.data.reportOptions.cost_method_object = data;

                                    resolve(layout)

                                })

                            }))

                        }

                        layout.data.reportOptions.portfolios = [];
                        layout.data.reportOptions.accounts = [];
                        layout.data.reportOptions.strategies1 = [];
                        layout.data.reportOptions.strategies2 = [];
                        layout.data.reportOptions.strategies3 = [];

                        Promise.all(promises).then(function () {
                            resolve(layout)
                        })

                    } else {

                        resolve(layout);

                    }

                } else {

                    resolve(layout);

                }
            })

        }

        function mapLayouts(entity) {
            return new Promise(function (resolve) {

                var promises = [];

                entity.content.forEach(function (item) {

                    if (item.active) {
                        console.log("things to map", item.data);

                        if (entity.entity === 'ui.editlayout') {

                            promises.push(handleEditLayoutMap(item));

                        } else {

                            promises.push(handleListLayoutMap(item));

                        }

                    }

                });

                Promise.all(promises).then(function (data) {
                    console.log("Update Mappings to local master user data", entity);

                    resolve({});

                })

            })

        }

        function initPreparations(items) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                if (isEntityExistsAndSelected(items, 'transactions.transactiontype')) {

                    var transactionTypeEntity = findEntity(items, 'transactions.transactiontype');
                    promises.push(mapTransactionTypeRelations(transactionTypeEntity));

                }

                if (isEntityExistsAndSelected(items, 'integrations.complextransactionimportscheme')) {

                    var complexTransactionImportSchemeEntity = findEntity(items, 'integrations.complextransactionimportscheme')
                    promises.push(mapComplexTransactionImportSchemeRelations(complexTransactionImportSchemeEntity));

                }

                if (isEntityExistsAndSelected(items, 'integrations.instrumentdownloadscheme')) {

                    var instrumentDownloadSchemeEntity = findEntity(items, 'integrations.instrumentdownloadscheme');
                    promises.push(mapInstrumentDownloadSchemeRelations(instrumentDownloadSchemeEntity));

                }

                if (isEntityExistsAndSelected(items, 'instruments.instrumenttype')) {

                    var instrumentTypeEntity = findEntity(items, 'instruments.instrumenttype');
                    promises.push(mapInstrumentTypeRelations(instrumentTypeEntity));

                }

                if (isEntityExistsAndSelected(items, 'ui.listlayout')) {

                    var listLayoutEntity = findEntity(items, 'ui.listlayout');
                    promises.push(mapLayouts(listLayoutEntity))

                }

                if (isEntityExistsAndSelected(items, 'ui.reportlayout')) {
                    var reportLayoutEntity = findEntity(items, 'ui.reportlayout');
                    promises.push(mapLayouts(reportLayoutEntity))
                }

                if (isEntityExistsAndSelected(items, 'ui.editlayout')) {

                    var editLayoutEntity = findEntity(items, 'ui.editlayout');
                    promises.push(mapLayouts(editLayoutEntity))

                }

                Promise.all(promises).then(function (data) {
                    resolve(data);
                })

            })

        }

        function importConfiguration(items) {

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


                })

            })

        }

        vm.agree = function ($event) {

            initPreparations(vm.items).then(function (value) {

                // $mdDialog.hide({status: 'agree', data: {}});
                // return;

                importConfiguration(vm.items).then(function (data) {

                    var allSuccess = true;

                    if (data.length) {
                        data.forEach(function (dataItem) {

                            if (dataItem.status === 400) {
                                allSuccess = false;
                            }

                        })
                    }

                    if (allSuccess) {
                        $mdDialog.hide({status: 'agree', data: {}});
                    } else {

                        var errorMessage = {};

                        $mdDialog.show({
                            controller: 'ValidationDialogController as vm',
                            templateUrl: 'views/dialogs/validation-dialog-view.html',
                            targetEvent: $event,
                            locals: {
                                validationData: data
                            },
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true
                        })

                    }


                })

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

    }

}());