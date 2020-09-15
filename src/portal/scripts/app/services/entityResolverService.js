/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

    'use strict';

    var portfolioService = require('./portfolioService');
    var accountService = require('./accountService');
    var accountTypeService = require('./accountTypeService');
    var responsibleService = require('./responsibleService');
    var responsibleGroupService = require('./responsibleGroupService');
    var counterpartyService = require('./counterpartyService');
    var counterpartyGroupService = require('./counterpartyGroupService');
    var instrumentService = require('./instrumentService');
    var currencyService = require('./currencyService');
    var priceHistoryService = require('./priceHistoryService');
    var currencyHistoryService = require('./currencyHistoryService');
    var transactionService = require('./transactionService');
    var transactionTypeService = require('./transactionTypeService');
    var transactionClassService = require('./transaction/transactionClassService');
    var transactionTypeGroupService = require('./transaction/transactionTypeGroupService');
    var complexTransactionService = require('./transaction/complexTransactionService');

    var metaEventClassService = require('./metaEventClassService');
    var metaNotificationClassService = require('./metaNotificationClassService');
    var pricingPolicyService = require('./pricingPolicyService');
    var instrumentTypeService = require('./instrumentTypeService');
    var accrualCalculationModelService = require('./accrualCalculationModelService');
    var instrumentPeriodicityService = require('./instrumentPeriodicityService');
    var tagService = require('./tagService');

    var strategyService = require('./strategyService');
    var strategyGroupService = require('./strategyGroupService');
    var strategySubgroupService = require('./strategySubgroupService');

    var instrumentDailyPricingModelService = require('./instrument/instrumentDailyPricingModelService');
    var instrumentPricingConditionService = require('./instrument/instrumentPricingConditionService');
    var instrumentPaymentSizeDetailService = require('./instrument/instrumentPaymentSizeDetailService');
    var instrumentClassService = require('./instrument/instrumentClassService');
    var priceDownloadSchemeService = require('./import/priceDownloadSchemeService');
    var csvImportSchemeService = require('./import/csvImportSchemeService');
    var complexImportSchemeService = require('./import/complexImportSchemeService');
    var complexTransactionImportSchemeService = require('./import/transactionImportSchemeService');

    var costMethodService = require('./instrument/instrumentCostMethodService');

    var priceHistoryErrorService = require('./pricing/priceHistoryErrorService');
    var currencyHistoryErrorService = require('./pricing/currencyHistoryErrorService');

    var getList = function (entityType, options) {

        switch (entityType) {
            case 'portfolio':
                return portfolioService.getList(options);
                break;
            case 'account':
                return accountService.getList(options);
                break;
            case 'account-type':
                return accountTypeService.getList(options);
                break;
            case 'responsible':
                return responsibleService.getList(options);
                break;
            case 'counterparty':
                return counterpartyService.getList(options);
                break;
            case 'currency':
                return currencyService.getList(options);
                break;
            case 'instrument':
                return instrumentService.getList(options);
                break;
            case 'instrument-type':
                return instrumentTypeService.getList(options);
                break;
            case 'transaction-type':
                return transactionTypeService.getListLight(options);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.getList(options);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.getList(options);
                break;
            case 'payment-size-detail':
                return instrumentPaymentSizeDetailService.getList(options);
                break;
            case 'pricing-condition':
                return instrumentPricingConditionService.getList(options);
                break;
            case 'event-class':
                return metaEventClassService.getList(options);
                break;
            case 'notification-class':
                return metaNotificationClassService.getList(options);
                break;
            case 'daily-pricing-model':
                return instrumentDailyPricingModelService.getList(options);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeService.getList(options);
                break;
            case 'csv-import-scheme':
                return csvImportSchemeService.getList(options);
                break;
            case 'complex-import-scheme':
                return complexImportSchemeService.getList(options);
                break;
            case 'complex-transaction-import-scheme':
                return complexTransactionImportSchemeService.getList(options);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.getList(options);
                break;
            case 'strategy-1':
                return strategyService.getList(1);
                break;
            case 'strategy-2':
                return strategyService.getList(2);
                break;
            case 'strategy-3':
                return strategyService.getList(3);
                break;
            case 'instrument-class':
                return instrumentClassService.getList(options);
                break;
            case 'pricing-policy':
                return pricingPolicyService.getList(options);
                break;
            case 'cost-method':
                return costMethodService.getList(options);
                break;
            case 'transaction-class':
                return transactionClassService.getList(options)
                break;
        }
    };

    var getListLight = function (entityType, options) {

        switch (entityType) {
            case 'portfolio':
                return portfolioService.getListLight(options);
            case 'account':
                return accountService.getListLight(options);
            case 'account-type':
                return accountTypeService.getList(options);
            case 'responsible':
                return responsibleService.getListLight(options);
            case 'counterparty':
                return counterpartyService.getListLight(options);
            case 'currency':
                return currencyService.getListLight(options);
            case 'instrument':
                return instrumentService.getListLight(options);
            case 'instrument-type':
                return instrumentTypeService.getList(options);
            case 'transaction-type':
                return transactionTypeService.getListLight(options);
            case 'strategy-1':
                return strategyService.getListLight(1);
            case 'strategy-2':
                return strategyService.getListLight(2);
            case 'strategy-3':
                return strategyService.getListLight(3);
            case 'pricing-policy':
                return pricingPolicyService.getListLight(options);
        }
    };

    var getByKey = function (entityType, id) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.getByKey(id);
                break;
            case 'account':
                return accountService.getByKey(id);
                break;
            case 'account-type':
                return accountTypeService.getByKey(id);
                break;
            case 'responsible':
                return responsibleService.getByKey(id);
                break;
            case 'responsible-group':
                return responsibleGroupService.getByKey(id);
                break;
            case 'counterparty':
                return counterpartyService.getByKey(id);
                break;
            case 'counterparty-group':
                return counterpartyGroupService.getByKey(id);
                break;
            case 'instrument':
                return instrumentService.getByKey(id);
                break;
            case 'instrument-type':
                return instrumentTypeService.getByKey(id);
                break;
            case 'currency':
                return currencyService.getByKey(id);
                break;
            case 'complex-transaction':
                return complexTransactionService.initRebookComplexTransaction(id);
                break;
            case 'pricing-policy':
                return pricingPolicyService.getByKey(id);
                break;
            case 'transaction':
                return transactionService.getByKey(id);
                break;
            case 'transaction-type':
                return transactionTypeService.getByKey(id);
                break;
            case 'transaction-type-book':
                return transactionTypeService.initBookComplexTransaction(id);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.getByKey(id);
                break;
            case 'price-history':
                return priceHistoryService.getByKey(id);
                break;
            case 'currency-history':
                return currencyHistoryService.getByKey(id);
                break;
            case 'strategy-1':
                return strategyService.getByKey(1, id);
                break;
            case 'strategy-2':
                return strategyService.getByKey(2, id);
                break;
            case 'strategy-3':
                return strategyService.getByKey(3, id);
                break;
            case 'strategy-1-group':
                return strategyGroupService.getByKey(1, id);
                break;
            case 'strategy-2-group':
                return strategyGroupService.getByKey(2, id);
                break;
            case 'strategy-3-group':
                return strategyGroupService.getByKey(3, id);
                break;
            case 'strategy-1-subgroup':
                return strategySubgroupService.getByKey(1, id);
                break;
            case 'strategy-2-subgroup':
                return strategySubgroupService.getByKey(2, id);
                break;
            case 'strategy-3-subgroup':
                return strategySubgroupService.getByKey(3, id);
                break;
            case 'tag':
                return tagService.getByKey(id);
                break;
            case 'price-history-error':
                return priceHistoryErrorService.getByKey(id);
                break;
            case 'currency-history-error':
                return currencyHistoryErrorService.getByKey(id);
        }
    };

    var create = function (entityType, entity) {
        switch (entityType) {
            case 'portfolio':
                entity.counterparties = entity.counterparties || [];
                entity.accounts = entity.accounts || [];
                entity.responsibles = entity.responsibles || [];
                entity.transaction_types = entity.transaction_types || [];
                return portfolioService.create(entity);
                break;
            case 'account':
                entity.portfolios = entity.portfolios || [];
                return accountService.create(entity);
                break;
            case 'account-type':
                return accountTypeService.create(entity);
                break;
            case 'responsible':
                return responsibleService.create(entity);
                break;
            case 'responsible-group':
                return responsibleGroupService.create(entity);
                break;
            case 'counterparty':
                return counterpartyService.create(entity);
                break;
            case 'counterparty-group':
                return counterpartyGroupService.create(entity);
                break;
            case 'instrument':
                return instrumentService.create(entity);
                break;
            case 'instrument-type':
                return instrumentTypeService.create(entity);
                break;
            case 'currency':
                return currencyService.create(entity);
                break;
            case 'pricing-policy':
                return pricingPolicyService.create(entity);
                break;
            case 'transaction':
                return transactionService.create(entity);
                break;
            case 'transaction-type':
                return transactionTypeService.create(entity);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.create(entity);
                break;
            case 'price-history':
                return priceHistoryService.create(entity);
                break;
            case 'currency-history':
                return currencyHistoryService.create(entity);
                break;
            case 'strategy-1':
                return strategyService.create(1, entity);
                break;
            case 'strategy-2':
                return strategyService.create(2, entity);
                break;
            case 'strategy-3':
                return strategyService.create(3, entity);
                break;
            case 'strategy-1-group':
                return strategyGroupService.create(1, entity);
                break;
            case 'strategy-2-group':
                return strategyGroupService.create(2, entity);
                break;
            case 'strategy-3-group':
                return strategyGroupService.create(3, entity);
                break;
            case 'strategy-1-subgroup':
                return strategySubgroupService.create(1, entity);
                break;
            case 'strategy-2-subgroup':
                return strategySubgroupService.create(2, entity);
                break;
            case 'strategy-3-subgroup':
                return strategySubgroupService.create(3, entity);
                break;
            case 'complex-transaction':

                return new Promise(function (resolve, reject) {
                    transactionTypeService.initBookComplexTransaction(entity.transaction_type).then(function (data) {

                        var res = Object.assign(data, entity);

                        transactionTypeService.bookComplexTransaction(entity.transaction_type, res).then(function (data) {
                            resolve(data);
                        });
                    });
                });
            case 'tag':
                return tagService.create(entity);
                break;

        }
    };

    var update = function (entityType, id, entity) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.update(id, entity);
                break;
            case 'currency':
                return currencyService.update(id, entity);
                break;
            case 'account':
                return accountService.update(id, entity);
                break;
            case 'account-type':
                return accountTypeService.update(id, entity);
                break;
            case 'responsible':
                return responsibleService.update(id, entity);
                break;
            case 'responsible-group':
                return responsibleGroupService.update(id, entity);
                break;
            case 'counterparty':
                return counterpartyService.update(id, entity);
                break;
            case 'counterparty-group':
                return counterpartyGroupService.update(id, entity);
                break;
            case 'instrument':
                return instrumentService.update(id, entity);
                break;
            case 'instrument-type':
                return instrumentTypeService.update(id, entity);
                break;
            case 'transaction':
                return transactionService.update(id, entity);
                break;
            case 'complex-transaction-default':
                return complexTransactionService.update(entity.id, entity);
            case 'complex-transaction':
                // return complexTransactionService.bookComplexTransaction(entity.id, entity);
                return new Promise(function (resolve, reject) {
                    return complexTransactionService.initRebookComplexTransaction(id).then(function (data) {

                        var originValues = JSON.parse(JSON.stringify(entity.values));

                        // entity.transactions = data.transactions;
                        entity.values = data.values;
                        entity.complex_transaction = data.complex_transaction; // ?

                        var originValuesKeys = Object.keys(originValues);
                        var defaultValuesKeys = Object.keys(entity.values);

                        originValuesKeys.forEach(function (originVal) {
                            defaultValuesKeys.forEach(function (defaultVal) {

                                if (originVal === defaultVal) {
                                    entity.values[defaultVal] = originValues[originVal];
                                }

                            })
                        });

                        complexTransactionService.rebookComplexTransaction(id, entity).then(function (data) {
                            resolve(data);
                        });
                    });
                });
                break;
            case 'transaction-type':
                return transactionTypeService.update(id, entity);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.update(id, entity);
                break;
            case 'price-history':
                return priceHistoryService.update(id, entity);
                break;
            case 'pricing-policy':
                return pricingPolicyService.update(id, entity);
                break;
            case 'currency-history':
                return currencyHistoryService.update(id, entity);
                break;
            case 'strategy-1':
                return strategyService.update(1, id, entity);
                break;
            case 'strategy-2':
                return strategyService.update(2, id, entity);
                break;
            case 'strategy-3':
                return strategyService.update(3, id, entity);
                break;
            case 'strategy-1-group':
                return strategyGroupService.update(1, id, entity);
                break;
            case 'strategy-2-group':
                return strategyGroupService.update(2, id, entity);
                break;
            case 'strategy-3-group':
                return strategyGroupService.update(3, id, entity);
                break;
            case 'strategy-1-subgroup':
                return strategySubgroupService.update(1, id, entity);
                break;
            case 'strategy-2-subgroup':
                return strategySubgroupService.update(2, id, entity);
                break;
            case 'strategy-3-subgroup':
                return strategySubgroupService.update(3, id, entity);
                break;
            case 'tag':
                return tagService.update(id, entity);
                break;
            case 'price-history-error':
                return priceHistoryErrorService.update(id, entity);
                break;
            case 'currency-history-error':
                return currencyHistoryErrorService.update(id, entity);
        }
    };

    var updateBulk = function (entityType, entities) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.updateBulk(entities);
                break;
            case 'currency':
                //return currencyService.update(id, entity);
                break;
            case 'account':
                return accountService.updateBulk(entities);
                break;
            case 'account-type':
                return accountTypeService.updateBulk(entities);
                break;
            case 'responsible':
                return responsibleService.updateBulk(entities);
                break;
            case 'responsible-group':
                //return responsibleGroupService.update(id, entity);
                break;
            case 'counterparty':
                return counterpartyService.updateBulk(entities);
                break;
            case 'counterparty-group':
                //return counterpartyGroupService.update(id, entity);
                break;
            case 'instrument':
                return instrumentService.updateBulk(entities);
                break;
            case 'instrument-type':
                return instrumentTypeService.updateBulk(entities);
                break;
            case 'transaction':
                //return transactionService.update(id, entity);
                break;
            case 'complex-transaction':
                return complexTransactionService.updatePropertiesBulk(entities);
            case 'transaction-type':
                // return transactionTypeService.updateBulk(entities);
                return transactionTypeService.updateBulkLight(entities);
            case 'transaction-type-group':
                //return transactionTypeGroupService.update(id, entity);
                break;
            case 'price-history':
                //return priceHistoryService.update(id, entity);
                break;
            case 'pricing-policy':
                //return pricingPolicyService.update(id, entity);
                break;
            case 'currency-history':
                //return currencyHistoryService.update(id, entity);
                break;
            case 'strategy-1':
                return strategyService.updateBulk(1, entities);
                break;
            case 'strategy-2':
                return strategyService.updateBulk(2, entities);
                break;
            case 'strategy-3':
                return strategyService.updateBulk(3, entities);
                break;
            case 'strategy-1-group':
                //return strategyGroupService.update(1, id, entity);
                break;
            case 'strategy-2-group':
                //return strategyGroupService.update(2, id, entity);
                break;
            case 'strategy-3-group':
                //return strategyGroupService.update(3, id, entity);
                break;
            case 'strategy-1-subgroup':
                //return strategySubgroupService.update(1, id, entity);
                break;
            case 'strategy-2-subgroup':
                //return strategySubgroupService.update(2, id, entity);
                break;
            case 'strategy-3-subgroup':
                //return strategySubgroupService.update(3, id, entity);
                break;
            case 'tag':
                //return tagService.update(id, entity);
                break;
        }
    };

    var deleteByKey = function (entityType, id) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.deleteByKey(id);
                break;
            case 'account':
                return accountService.deleteByKey(id);
                break;
            case 'account-type':
                return accountTypeService.deleteByKey(id);
                break;
            case 'responsible':
                return responsibleService.deleteByKey(id);
                break;
            case 'responsible-group':
                return responsibleGroupService.deleteByKey(id);
                break;
            case 'counterparty':
                return counterpartyService.deleteByKey(id);
                break;
            case 'counterparty-group':
                return counterpartyGroupService.deleteByKey(id);
                break;
            case 'instrument':
                return instrumentService.deleteByKey(id);
                break;
            case 'instrument-type':
                return instrumentTypeService.deleteByKey(id);
                break;
            case 'complex-transaction':
                return complexTransactionService.deleteByKey(id);
                break;
            case 'transaction':
                return transactionService.deleteByKey(id);
                break;
            case 'transaction-type':
                return transactionTypeService.deleteByKey(id);
                break;
            case 'transaction-type-group':
                return transactionTypeGroupService.deleteByKey(id);
                break;
            case 'price-history':
                return priceHistoryService.deleteByKey(id);
                break;
            case 'pricing-policy':
                return pricingPolicyService.deleteByKey(id);
                break;
            case 'currency-history':
                return currencyHistoryService.deleteByKey(id);
                break;
            case 'strategy-1':
                return strategyService.deleteByKey(1, id);
                break;
            case 'strategy-2':
                return strategyService.deleteByKey(2, id);
                break;
            case 'strategy-3':
                return strategyService.deleteByKey(3, id);
                break;
            case 'strategy-1-group':
                return strategyGroupService.deleteByKey(1, id);
                break;
            case 'strategy-2-group':
                return strategyGroupService.deleteByKey(2, id);
                break;
            case 'strategy-3-group':
                return strategyGroupService.deleteByKey(3, id);
                break;
            case 'strategy-1-subgroup':
                return strategySubgroupService.deleteByKey(1, id);
                break;
            case 'strategy-2-subgroup':
                return strategySubgroupService.deleteByKey(2, id);
                break;
            case 'strategy-3-subgroup':
                return strategySubgroupService.deleteByKey(3, id);
                break;
            case 'tag':
                return tagService.deleteByKey(id);
                break;
            case 'price-history-error':
                return priceHistoryErrorService.deleteByKey(id);
                break;
            case 'currency-history-error':
                return currencyHistoryErrorService.deleteByKey(id);
        }
    };

    var deleteBulk = function (entityType, data) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.deleteBulk(data);
            case 'currency':
                return currencyService.deleteBulk(data);
            case 'account':
                return accountService.deleteBulk(data);
            case 'account-type':
                return accountTypeService.deleteBulk(data);
            case 'responsible':
                return responsibleService.deleteBulk(data);
            case 'responsible-group':
                return responsibleGroupService.deleteBulk(data);
            case 'counterparty':
                return counterpartyService.deleteBulk(data);
            case 'counterparty-group':
                return counterpartyGroupService.deleteBulk(data);
            case 'instrument':
                return instrumentService.deleteBulk(data);
            case 'instrument-type':
                return instrumentTypeService.deleteBulk(data);
            case 'transaction':
                return transactionService.deleteBulk(data);
            case 'complex-transaction':
                return complexTransactionService.deleteBulk(data);
            case 'transaction-type':
                return transactionTypeService.deleteBulk(data);
            case 'transaction-type-group':
                return transactionTypeGroupService.deleteBulk(data);
            case 'price-history':
                return priceHistoryService.deleteBulk(data);
            case 'pricing-policy':
                return pricingPolicyService.deleteBulk(data);
            case 'currency-history':
                return currencyHistoryService.deleteBulk(data);
            case 'strategy-1':
                return strategyService.deleteBulk(1, data);
            case 'strategy-2':
                return strategyService.deleteBulk(2, data);
            case 'strategy-3':
                return strategyService.deleteBulk(3, data);
            case 'strategy-1-group':
                //return strategyGroupService.deleteBulk(data);
                break;
            case 'strategy-2-group':
                //return strategyGroupService.deleteBulk(data);
                break;
            case 'strategy-3-group':
                //return strategyGroupService.deleteBulk(data);
                break;
            case 'strategy-1-subgroup':
                //return strategySubgroupService.deleteBulk(data);
                break;
            case 'strategy-2-subgroup':
                //return strategySubgroupService.deleteBulk(data);
                break;
            case 'strategy-3-subgroup':
                //return strategySubgroupService.deleteBulk(data);
                break;
            case 'tag':
                //return tagService.deleteBulk(data);
                break;

            case 'price-history-error':
                return priceHistoryErrorService.deleteBulk(data);
            case 'currency-history-error':
                return currencyHistoryErrorService.deleteBulk(data);
        }
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        updateBulk: updateBulk,
        deleteBulk: deleteBulk
    }

}());