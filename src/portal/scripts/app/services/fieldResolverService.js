/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var entityFieldsRepository = require('../repositories/entityFieldsRepository');
    var accountRepository = require('../repositories/accountRepository');
    var accountTypeRepository = require('../repositories/accountTypeRepository');
    var instrumentRepository = require('../repositories/instrumentRepository');
    var instrumentTypeRepository = require('../repositories/instrumentTypeRepository');
    var importPriceDownloadSchemeRepository = require('../repositories/import/importPriceDownloadSchemeRepository');
    var instrumentClassRepository = require('../repositories/instrument/instrumentClassRepository');
    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');
    var currencyRepository = require('../repositories/currencyRepository');
    var portfolioRepository = require('../repositories/portfolioRepository');
    var counterpartyRepository = require('../repositories/counterpartyRepository');
    var counterpartyGroupRepository = require('../repositories/counterpartyGroupRepository');
    var responsibleRepository = require('../repositories/responsibleRepository');
    var responsibleGroupRepository = require('../repositories/responsibleGroupRepository');
    var transactionTypeRepository = require('../repositories/transactionTypeRepository');
    var transactionTypeGroupRepository = require('../repositories/transaction/transactionTypeGroupRepository');
    var tagRepository = require('../repositories/tagRepository');
    var metaContentTypesRepository = require('../repositories/metaContentTypesRepository');

    var strategyRepository = require('../repositories/strategyRepository');
    var strategyGroupRepository = require('../repositories/strategyGroupRepository');
    var strategySubgroupRepository = require('../repositories/strategySubgroupRepository');

    var accrualCalculationModelRepository = require('../repositories/accrualCalculationModelRepository');
    var instrumentPeriodicityRepository = require('../repositories/instrumentPeriodicityRepository');
    var metaEventClassRepository = require('../repositories/metaEventClassRepository');
    var metaNotificationClassRepository = require('../repositories/metaNotificationClassRepository');

    var getFields = function (fieldKey, options, fieldsDataStore) {

        return new Promise(function (resolve, reject) {

            console.log('options', options);
                console.log('fieldKey', fieldKey);
            console.log('fieldsDataStore', fieldsDataStore);

            if (fieldsDataStore) {

                if (!fieldsDataStore['fieldKeys']) {
                    fieldsDataStore['fieldKeys'] = {}
                }

                if (fieldsDataStore['fieldKeys'][fieldKey]) {
                    resolve(fieldsDataStore[fieldKey])
                }

            }

            if (options && options.hasOwnProperty('entityType')) {

                var entityTypePieces = options.entityType.split('-');

                var entity = entityTypePieces[0];

                if (entity === 'transaction') {

                    if (fieldKey === 'group') {
                        transactionTypeGroupRepository.getList().then(function (data) {
                            resolve({type: 'id', key: 'group', data: data.results});
                        });
                    }
                }

                if (entity === 'strategy') {

                    var strategyNumber = entityTypePieces[1];

                    console.log('strategyNumber', strategyNumber);

                    if (fieldKey === 'group') {
                        strategyGroupRepository.getList(strategyNumber).then(function (data) {
                            resolve({type: 'id', key: 'group', data: data.results});
                        });
                    }

                    if (fieldKey === 'subgroup') {
                        strategySubgroupRepository.getList(strategyNumber).then(function (data) {
                            resolve({type: 'id', key: 'subgroup', data: data.results});
                        });
                    }
                }

                if (entity === 'counterparty') {
                    if (fieldKey === 'group') {
                        counterpartyGroupRepository.getList().then(function (data) {
                            resolve({type: 'id', key: 'group', data: data.results});
                        });
                    }
                }

                if (entity === 'responsible') {
                    if (fieldKey === 'group') {
                        responsibleGroupRepository.getList().then(function (data) {
                            resolve({type: 'id', key: 'group', data: data.results});
                        });
                    }
                }

                if (fieldKey == 'tags') {
                    tagRepository.getListByContentType(options.entityType).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'tags', data: data.results});
                    });
                }
            }

            switch (fieldKey) {
                case 'pricing_condition':
                    entityFieldsRepository.getPricingConditionChoices({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'pricing_condition', data: data});
                    });
                    break;
                case 'daily_pricing_model':
                    entityFieldsRepository.getDailyPricingModelChoices({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'daily_pricing_model', data: data});
                    });
                    break;
                case 'payment_size_detail':
                    entityFieldsRepository.getPaymentSizeDetailChoices({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'payment_size_detail', data: data});
                    });
                    break;
                case 'transaction_class':
                    entityFieldsRepository.getTransactionClassList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'transaction_class', data: data});
                    });
                    break;
                case 'periodicity':
                    instrumentPeriodicityRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'periodicity', data: data});
                    });
                    break;
                case 'accrual_calculation_model':
                    accrualCalculationModelRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'accrual_calculation_model', data: data});
                    });
                    break;
                case 'event_class':
                    metaEventClassRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'event_class', data: data});
                    });
                    break;
                case 'notification_class':
                    metaNotificationClassRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'notification_class', data: data});
                    });
                    break;
                case 'instrument':
                    instrumentRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument', data: data.results});
                    });
                    break;
                case 'linked_instrument':
                    instrumentRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument', data: data.results});
                    });
                    break;
                case 'allocation_balance':
                    instrumentRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument', data: data.results});
                    });
                    break;
                case 'allocation_pl':
                    instrumentRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument', data: data.results});
                    });
                    break;
                case 'pricing_policy':
                    pricingPolicyRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'pricing_policy', data: data.results});
                    });
                    break;

                case 'valuation_pricing_policy':
                    pricingPolicyRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'valuation_pricing_policy', data: data.results});
                    });
                    break;
                case 'price_download_scheme':
                    importPriceDownloadSchemeRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'price_download_scheme', data: data.results});
                    });
                    break;
                case 'instrument_type':
                    instrumentTypeRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument_type', data: data.results});
                    });
                    break;
                case 'instrument_class':
                    instrumentClassRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'instrument_class', data: data}); // system-wide list
                    });
                    break;
                case 'accrued_currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'accrued_currency', data: data.results});
                    });
                    break;
                case 'pricing_currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'pricing_currency', data: data.results});
                    });
                    break;
                case 'valuation_currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'valuation_currency', data: data.results});
                    });
                    break;
                case 'transaction_currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'transaction_currency', data: data.results});
                    });
                    break;
                case 'settlement_currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'settlement_currency', data: data.results});
                    });
                    break;
                case 'currency':
                    currencyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'currency', data: data.results});
                    });
                    break;
                case 'portfolio':
                    portfolioRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'portfolio', data: data.results});
                    });
                    break;
                case 'account':
                    accountRepository.getListLight({pageSize: 10000}).then(function (data) {
                        resolve({type: 'id', key: 'account', data: data.results});
                    });
                    break;
                case 'counterparty':
                    counterpartyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'counterparty', data: data.results});
                    });
                    break;
                case 'responsible':
                    responsibleRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'responsible', data: data.results});
                    });
                    break;
                case 'type':
                    accountTypeRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'type', data: data.results});
                    });
                    break;
                case 'account_type':
                    accountTypeRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'type', data: data.results});
                    });
                    break;

                case 'transaction_type':

                case 'one_off_event':
                case 'regular_event':
                case 'factor_same':
                case 'factor_down':
                case 'factor_up':
                    transactionTypeRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'transaction_type', data: data.results});
                    });
                    break;

                case 'account_cash':
                    accountRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'account_cash', data: data.results});
                    });
                    break;
                case 'account_position':
                    accountRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'account_position', data: data.results});
                    });
                    break;
                case 'account_interim':
                    accountRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'id', key: 'account_interim', data: data.results});
                    });
                    break;
                case 'strategy1':
                    strategyRepository.getListLight(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy1', data: data.results});
                    });
                    break;
                case 'strategy_1': // TODO do something with inconsistency of entity name
                    strategyRepository.getListLight(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy_1', data: data.results});
                    });
                    break;
                case 'strategy1_position':
                    strategyRepository.getListLight(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy1_position', data: data.results});
                    });
                    break;
                case 'strategy1_cash':
                    strategyRepository.getListLight(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy1_cash', data: data.results});
                    });
                    break;
                case 'strategy2':
                    strategyRepository.getListLight(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy2', data: data.results});
                    });
                    break;
                case 'strategy_2': // TODO do something with inconsistency of entity name
                    strategyRepository.getListLight(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy_2', data: data.results});
                    });
                    break;
                case 'strategy2_position':
                    strategyRepository.getListLight(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy2_position', data: data.results});
                    });
                    break;
                case 'strategy2_cash':
                    strategyRepository.getListLight(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy2_cash', data: data.results});
                    });
                    break;
                case 'strategy3':
                    strategyRepository.getListLight(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy3', data: data.results});
                    });
                    break;
                case 'strategy_3': // TODO do something with inconsistency of entity name
                    strategyRepository.getListLight(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy_3', data: data.results});
                    });
                    break;
                case 'strategy3_position':
                    strategyRepository.getListLight(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy3_position', data: data.results});
                    });
                    break;
                case 'strategy3_cash':
                    strategyRepository.getListLight(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy3_cash', data: data.results});
                    });
                    break;

                // TODO delete later, we are using subgroup as groups
                /*case 'strategy1_group':
                    strategyGroupRepository.getList(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy1_group', data: data.results});
                    });
                    break;
                case 'strategy2_group':
                    strategyGroupRepository.getList(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy2_group', data: data.results});
                    });
                    break;
                case 'strategy3_group':
                    strategyGroupRepository.getList(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy3_group', data: data.results});
                    });
                    break;*/

                case 'strategy1_subgroup':
                    strategySubgroupRepository.getList(1).then(function (data) {
                        resolve({type: 'id', key: 'strategy1_subgroup', data: data.results});
                    });
                    break;
                case 'strategy2_subgroup':
                    strategySubgroupRepository.getList(2).then(function (data) {
                        resolve({type: 'id', key: 'strategy2_subgroup', data: data.results});
                    });
                    break;
                case 'strategy3_subgroup':
                    strategySubgroupRepository.getList(3).then(function (data) {
                        resolve({type: 'id', key: 'strategy3_subgroup', data: data.results});
                    });
                    break;


                case 'portfolios':
                    portfolioRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'portfolios', data: data.results});
                    });
                    break;
                case 'account_types':
                    accountTypeRepository.getList({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'account_types', data: data.results});
                    });
                    break;
                case 'transaction_types':
                    transactionTypeRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'transaction_types', data: data.results});
                    });
                    break;
                case 'instrument_types':
                    instrumentTypeRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'instrument_types', data: data.results});
                    });
                    break;
                case 'counterparties':
                    counterpartyRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'counterparties', data: data.results});
                    });
                    break;
                case 'accounts':
                    accountRepository.getListLight({pageSize: 10000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'accounts', data: data.results});
                    });
                    break;
                case 'content_types':
                    resolve({
                        type: 'multiple-ids',
                        key: 'content_types',
                        data: metaContentTypesRepository.getListForTags()
                    });
                    break;
                case 'responsibles':
                    responsibleRepository.getListLight({pageSize: 1000}).then(function (data) {
                        resolve({type: 'multiple-ids', key: 'responsibles', data: data.results});
                    });
                    break;

            }

        });

    };

    var getFieldsByContentType = function (contentType, options, fieldsDataStore) {

        if (!fieldsDataStore['fieldKeys']) {
            fieldsDataStore['fieldKeys'] = {}
        }

        if (fieldsDataStore['fieldKeys'][contentType]) {

            if (fieldsDataStore['fieldKeys'][contentType] instanceof Promise) {

                console.log('instanceof Promise fieldsDataStore[contentType]', fieldsDataStore['fieldKeys'][contentType]);

                return fieldsDataStore['fieldKeys'][contentType];
            } else {

                console.log('return new promise fieldsDataStore[\'fieldKeys\'][contentType]', fieldsDataStore['fieldKeys'][contentType]);

                return new Promise(function (resolve, reject) {

                    resolve(fieldsDataStore['fieldKeys'][contentType])
                })
            }
        } else {

            fieldsDataStore['fieldKeys'][contentType] = new Promise(function (resolve, reject) {

                switch (contentType) {
                    case 'instruments.dailypricingmodel':
                        entityFieldsRepository.getDailyPricingModelChoices({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.dailypricingmodel',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.pricingpolicy':
                        pricingPolicyRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.pricingpolicy',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.paymentsizedetail':
                        entityFieldsRepository.getPaymentSizeDetailChoices({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.paymentsizedetail',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.accrualcalculationmodel':
                        accrualCalculationModelRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.accrualcalculationmodel',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.periodicity':
                        instrumentPeriodicityRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.periodicity',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.instrument':
                        instrumentRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.instrument',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'integrations.pricedownloadscheme':
                        importPriceDownloadSchemeRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'integrations.pricedownloadscheme',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'instruments.instrumenttype':
                        instrumentTypeRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'instruments.instrumenttype',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'currencies.currency':
                        currencyRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'currencies.currency',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'portfolios.portfolio':
                        portfolioRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'portfolios.portfolio',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'counterparties.counterparty':
                        counterpartyRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'counterparties.counterparty',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'counterparties.responsible':
                        responsibleRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'counterparties.responsible',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'accounts.account':
                        accountRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'accounts.account',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'accounts.accounttype':
                        accountTypeRepository.getListLight({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'accounts.accounttype',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'transactions.eventclass':
                        metaEventClassRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'transactions.eventclass',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'transactions.notificationclass':
                        metaNotificationClassRepository.getList({pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'transactions.notificationclass',
                                data: data
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'strategies.strategy1':
                        strategyRepository.getListLight(1, {pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'strategies.strategy1',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'strategies.strategy2':
                        strategyRepository.getListLight(2, {pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'strategies.strategy2',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                    case 'strategies.strategy3':
                        strategyRepository.getListLight(3, {pageSize: 1000}).then(function (data) {

                            fieldsDataStore['fieldKeys'][contentType] = {
                                type: 'id',
                                key: 'strategies.strategy3',
                                data: data.results
                            }

                            resolve(fieldsDataStore['fieldKeys'][contentType]);
                        });
                        break;
                }

            });

            return fieldsDataStore['fieldKeys'][contentType]

        }
    };

    module.exports = {
        getFields: getFields,
        getFieldsByContentType: getFieldsByContentType
    }

}());