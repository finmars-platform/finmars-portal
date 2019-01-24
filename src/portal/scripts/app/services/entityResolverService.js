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

    var pricingPolicyService = require('./pricingPolicyService');
    var instrumentTypeService = require('./instrumentTypeService');
    var accrualCalculationModelService = require('./accrualCalculationModelService');
    var instrumentPeriodicityService = require('./instrumentPeriodicityService');
    var tagService = require('./tagService');

    var strategyService = require('./strategyService');
    var strategyGroupService = require('./strategyGroupService');
    var strategySubgroupService = require('./strategySubgroupService');

    var instrumentDailyPricingModelService = require('./instrument/instrumentDailyPricingModelService');
    var instrumentPaymentSizeDetailService = require('./instrument/instrumentPaymentSizeDetailService');
    var instrumentClassService = require('./instrument/instrumentClassService');
    var priceDownloadSchemeService = require('./import/priceDownloadSchemeService');

    var costMethodService = require('./instrument/instrumentCostMethodService');

    var getList = function (entityType, options) {

        switch (entityType) {
            case 'portfolio':
                return portfolioService.getList(options);
            case 'account':
                return accountService.getList(options);
            case 'responsible':
                return responsibleService.getList(options);
            case 'counterparty':
                return counterpartyService.getList(options);
            case 'currency':
                return currencyService.getList(options);
            case 'instrument':
                return instrumentService.getList(options);
            case 'instrument-type':
                return instrumentTypeService.getList(options);
            case 'transaction-type':
                return transactionTypeService.getList(options);
            case 'periodicity':
                return instrumentPeriodicityService.getList(options);
            case 'accrual-calculation-model':
                return accrualCalculationModelService.getList(options);
            case 'daily-pricing-model':
                return instrumentDailyPricingModelService.getList(options);
            case 'payment-size-detail':
                return instrumentPaymentSizeDetailService.getList(options);
            case 'price-download-scheme':
                return priceDownloadSchemeService.getList(options);
            case 'transaction-type-group':
                return transactionTypeGroupService.getList(options);
            case 'strategy-1':
                return strategyService.getList(1);
            case 'strategy-2':
                return strategyService.getList(2);
            case 'strategy-3':
                return strategyService.getList(3);
            case 'instrument-class':
                return instrumentClassService.getList(options);
            case 'pricing-policy':
                return pricingPolicyService.getList(options);
            case 'cost-method':
                return costMethodService.getList(options);
            case 'transaction-class':
                return transactionClassService.getList(options)
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
                return complexTransactionService.getBookComplexTransaction(id);
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
                return transactionTypeService.getBookTransaction(id);
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
                    transactionTypeService.getBookTransaction(entity.transaction_type).then(function (data) {

                        var res = Object.assign(data, entity);

                        transactionTypeService.bookTransaction(entity.transaction_type, res).then(function (data) {
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
                    return complexTransactionService.getBookComplexTransaction(id).then(function (data) {

                        var originValues = JSON.parse(JSON.stringify(entity.values));

                        entity.transactions = data.transactions;
                        entity.values = data.values;

                        var originValuesKeys = Object.keys(originValues);
                        var defaultValuesKeys = Object.keys(entity.values);

                        originValuesKeys.forEach(function (originVal) {
                            defaultValuesKeys.forEach(function (defaultVal) {

                                if (originVal === defaultVal) {
                                    entity.values[defaultVal] = originValues[originVal];
                                }

                            })
                        });

                        complexTransactionService.bookComplexTransaction(id, entity).then(function (data) {
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
                //return instrumentTypeService.update(id, entity);
                break;
            case 'transaction':
                //return transactionService.update(id, entity);
                break;
            case 'complex-transaction':
                //return complexTransactionService.update(id, entity);
                break;
            case 'transaction-type':
                return transactionTypeService.updateBulk(entities);
                break;
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
                //return strategyService.update(1, id, entity);
                break;
            case 'strategy-2':
                //return strategyService.update(2, id, entity);
                break;
            case 'strategy-3':
                //return strategyService.update(3, id, entity);
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
        }
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        updateBulk: updateBulk
    }

}());