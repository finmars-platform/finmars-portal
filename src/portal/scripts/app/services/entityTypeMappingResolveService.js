/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var currencyMappingService = require('./import/mappings/currencyMappingService');
    var instrumentTypeMappingService = require('./import/mappings/instrumentTypeMappingService');
    var accrualCalculationModelService = require('./import/mappings/accrualCalculationModelMappingService');
    var instrumentPeriodicityService = require('./import/mappings/instrumentPeriodicityMappingService');
    var instrumentAttributeTypeService = require('./import/mappings/instrumentAttributeTypeMappingService');

    var accountMappingService = require('./import/mappings/accountMappingService');
    var instrumentMappingService = require('./import/mappings/instrumentMappingService');
    var counterpartyMappingService = require('./import/mappings/counterpartyMappingService');
    var responsibleMappingService = require('./import/mappings/responsibleMappingService');
    var portfolioMappingService = require('./import/mappings/portfolioMappingService');

    var strategy1MappingService = require('./import/mappings/strategy1MappingService');
    var strategy2MappingService = require('./import/mappings/strategy2MappingService');
    var strategy3MappingService = require('./import/mappings/strategy3MappingService');

    var dailyPricingModelMappingService = require('./import/mappings/dailyPricingModelMappingService');
    var paymentSizeDetailMappingService = require('./import/mappings/paymentSizeDetailMappingService');
    var priceDownloadSchemeMappingService = require('./import/mappings/priceDownloadSchemeMappingService');

    var getList = function (entityType, options) {

        console.log('getList entityType', entityType);

        switch (entityType) {
            case 'currency':
                return currencyMappingService.getList(options);
                break;
            case 'instrument-type':
                return instrumentTypeMappingService.getList(options);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.getList(options);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.getList(options);
                break;
            case 'classifier':
                return instrumentAttributeTypeService.getList(options);
                break;
            case 'account':
                return accountMappingService.getList(options);
                break;
            case 'instrument':
                return instrumentMappingService.getList(options);
                break;
            case 'counterparty':
                return counterpartyMappingService.getList(options);
                break;
            case 'responsible':
                return responsibleMappingService.getList(options);
                break;
            case 'portfolio':
                return portfolioMappingService.getList(options);
                break;
            case 'strategy-1':
                return strategy1MappingService.getList(options);
                break;
            case 'strategy-2':
                return strategy2MappingService.getList(options);
                break;
            case 'strategy-3':
                return strategy3MappingService.getList(options);
                break;
            case 'daily-pricing-model':
                return dailyPricingModelMappingService.getList(options);
                break;
            case 'payment-size-detail':
                return paymentSizeDetailMappingService.getList(options);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeMappingService.getList(options);
                break;
        }

    };

    var getByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.getByKey(id);
                break;
            case 'instrument-type':
                return instrumentTypeMappingService.getByKey(id);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.getByKey(id);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.getByKey(id);
                break;
            case 'classifier':
                return instrumentAttributeTypeService.getByKey(id);
                break;
            case 'account':
                return accountMappingService.getByKey(id);
                break;
            case 'instrument':
                return instrumentMappingService.getByKey(id);
                break;
            case 'counterparty':
                return counterpartyMappingService.getByKey(id);
                break;
            case 'responsible':
                return responsibleMappingService.getByKey(id);
                break;
            case 'portfolio':
                return portfolioMappingService.getByKey(id);
                break;
            case 'strategy-1':
                return strategy1MappingService.getByKey(id);
                break;
            case 'strategy-2':
                return strategy2MappingService.getByKey(id);
                break;
            case 'strategy-3':
                return strategy3MappingService.getByKey(id);
                break;
            case 'daily-pricing-model':
                return dailyPricingModelMappingService.getByKey(id);
                break;
            case 'payment-size-detail':
                return paymentSizeDetailMappingService.getByKey(id);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeMappingService.getByKey(id);
                break;
        }

    };

    var create = function (entityType, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.create(map);
                break;
            case 'instrument-type':
                return instrumentTypeMappingService.create(map);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.create(map);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.create(map);
                break;
            case 'classifier':
                return instrumentAttributeTypeService.create(map);
                break;
            case 'account':
                return accountMappingService.create(map);
                break;
            case 'instrument':
                return instrumentMappingService.create(map);
                break;
            case 'counterparty':
                return counterpartyMappingService.create(map);
                break;
            case 'responsible':
                return responsibleMappingService.create(map);
                break;
            case 'portfolio':
                return portfolioMappingService.create(map);
                break;
            case 'strategy-1':
                return strategy1MappingService.create(map);
                break;
            case 'strategy-2':
                return strategy2MappingService.create(map);
                break;
            case 'strategy-3':
                return strategy3MappingService.create(map);
                break;
            case 'daily-pricing-model':
                return dailyPricingModelMappingService.create(map);
                break;
            case 'payment-size-detail':
                return paymentSizeDetailMappingService.create(map);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeMappingService.create(map);
                break;
        }

    };

    var update = function (entityType, id, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.update(id, map);
                break;
            case 'instrument-type':
                return instrumentTypeMappingService.update(id, map);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.update(id, map);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.update(id, map);
                break;
            case 'classifier':
                return instrumentAttributeTypeService.update(id, map);
                break;
            case 'account':
                return accountMappingService.update(id, map);
                break;
            case 'instrument':
                return instrumentMappingService.update(id, map);
                break;
            case 'counterparty':
                return counterpartyMappingService.update(id, map);
                break;
            case 'responsible':
                return responsibleMappingService.update(id, map);
                break;
            case 'portfolio':
                return portfolioMappingService.update(id, map);
                break;
            case 'strategy-1':
                return strategy1MappingService.update(id, map);
                break;
            case 'strategy-2':
                return strategy2MappingService.update(id, map);
                break;
            case 'strategy-3':
                return strategy3MappingService.update(id, map);
                break;
            case 'daily-pricing-model':
                return dailyPricingModelMappingService.update(id, map);
                break;
            case 'payment-size-detail':
                return paymentSizeDetailMappingService.update(id, map);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeMappingService.update(id, map);
                break;
        }

    };

    var deleteByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.deleteByKey(id);
                break;
            case 'instrument-type':
                return instrumentTypeMappingService.deleteByKey(id);
                break;
            case 'accrual-calculation-model':
                return accrualCalculationModelService.deleteByKey(id);
                break;
            case 'periodicity':
                return instrumentPeriodicityService.deleteByKey(id);
                break;
            case 'classifier':
                return instrumentAttributeTypeService.deleteByKey(id);
                break;
            case 'account':
                return accountMappingService.deleteByKey(id);
                break;
            case 'instrument':
                return instrumentMappingService.deleteByKey(id);
                break;
            case 'counterparty':
                return counterpartyMappingService.deleteByKey(id);
                break;
            case 'responsible':
                return responsibleMappingService.deleteByKey(id);
                break;
            case 'portfolio':
                return portfolioMappingService.deleteByKey(id);
                break;
            case 'strategy-1':
                return strategy1MappingService.deleteByKey(id);
                break;
            case 'strategy-2':
                return strategy2MappingService.deleteByKey(id);
                break;
            case 'strategy-3':
                return strategy3MappingService.deleteByKey(id);
                break;
            case 'daily-pricing-model':
                return dailyPricingModelMappingService.deleteByKey(id);
                break;
            case 'payment-size-detail':
                return paymentSizeDetailMappingService.deleteByKey(id);
                break;
            case 'price-download-scheme':
                return priceDownloadSchemeMappingService.deleteByKey(id);
                break;
        }

    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());