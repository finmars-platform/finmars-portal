/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var currencyMappingService = require('./import/currencyMappingService');
    var instrumentTypeMappingService = require('./import/instrumentTypeMappingService');
    var accrualCalculationModelService = require('./import/accrualCalculationModelMappingService');
    var instrumentPeriodicityService = require('./import/instrumentPeriodicityMappingService');
    var instrumentAttributeTypeService = require('./import/instrumentAttributeTypeMappingService');

    var accountMappingService = require('./import/accountMappingService');
    var instrumentMappingService = require('./import/instrumentMappingService');
    var counterpartyMappingService = require('./import/counterpartyMappingService');
    var responsibleMappingService = require('./import/responsibleMappingService');
    var portfolioMappingService = require('./import/portfolioMappingService');

    var strategy1MappingService = require('./import/strategy1MappingService');
    var strategy2MappingService = require('./import/strategy2MappingService');
    var strategy3MappingService = require('./import/strategy3MappingService');

    var dailyPricingModelMappingService = require('./import/dailyPricingModelMappingService');
    var paymentSizeDetailMappingService = require('./import/paymentSizeDetailMappingService');
    var priceDownloadSchemeMappingService = require('./import/priceDownloadSchemeMappingService');

    var getList = function (entityType) {

        console.log('getList entityType', entityType);

        switch (entityType) {
            case 'currency':
                return currencyMappingService.getList();
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.getList();
                break;
            case 'accrual_calculation_model':
                return accrualCalculationModelService.getList();
                break;
            case 'periodicity':
                return instrumentPeriodicityService.getList();
                break;
            case 'classifier':
                return instrumentAttributeTypeService.getList();
                break;
            case 'account':
                return accountMappingService.getList();
                break;
            case 'instrument':
                return instrumentMappingService.getList();
                break;
            case 'counterparty':
                return counterpartyMappingService.getList();
                break;
            case 'responsible':
                return responsibleMappingService.getList();
                break;
            case 'portfolio':
                return portfolioMappingService.getList();
                break;
            case 'strategy_1':
                return strategy1MappingService.getList();
                break;
            case 'strategy_2':
                return strategy2MappingService.getList();
                break;
            case 'strategy_3':
                return strategy3MappingService.getList();
                break;
            case 'daily_pricing_model':
                return dailyPricingModelMappingService.getList();
                break;
            case 'payment_size_detail':
                return paymentSizeDetailMappingService.getList();
                break;
            case 'price_download_scheme':
                return priceDownloadSchemeMappingService.getList();
                break;
        }

    };

    var getByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.getByKey(id);
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.getByKey(id);
                break;
            case 'accrual_calculation_model':
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
            case 'strategy_1':
                return strategy1MappingService.getByKey(id);
                break;
            case 'strategy_2':
                return strategy2MappingService.getByKey(id);
                break;
            case 'strategy_3':
                return strategy3MappingService.getByKey(id);
                break;
            case 'daily_pricing_model':
                return dailyPricingModelMappingService.getByKey(id);
                break;
            case 'payment_size_detail':
                return paymentSizeDetailMappingService.getByKey(id);
                break;
            case 'price_download_scheme':
                return priceDownloadSchemeMappingService.getByKey(id);
                break;
        }

    };

    var create = function (entityType, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.create(map);
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.create(map);
                break;
            case 'accrual_calculation_model':
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
            case 'strategy_1':
                return strategy1MappingService.create(map);
                break;
            case 'strategy_2':
                return strategy2MappingService.create(map);
                break;
            case 'strategy_3':
                return strategy3MappingService.create(map);
                break;
            case 'daily_pricing_model':
                return dailyPricingModelMappingService.create(map);
                break;
            case 'payment_size_detail':
                return paymentSizeDetailMappingService.create(map);
                break;
            case 'price_download_scheme':
                return priceDownloadSchemeMappingService.create(map);
                break;
        }

    };

    var update = function (entityType, id, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.update(id, map);
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.update(id, map);
                break;
            case 'accrual_calculation_model':
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
            case 'strategy_1':
                return strategy1MappingService.update(id, map);
                break;
            case 'strategy_2':
                return strategy2MappingService.update(id, map);
                break;
            case 'strategy_3':
                return strategy3MappingService.update(id, map);
                break;
            case 'daily_pricing_model':
                return dailyPricingModelMappingService.update(id, map);
                break;
            case 'payment_size_detail':
                return paymentSizeDetailMappingService.update(id, map);
                break;
            case 'price_download_scheme':
                return priceDownloadSchemeMappingService.update(id, map);
                break;
        }

    };

    var deleteByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.deleteByKey(id);
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.deleteByKey(id);
                break;
            case 'accrual_calculation_model':
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
            case 'strategy_1':
                return strategy1MappingService.deleteByKey(id);
                break;
            case 'strategy_2':
                return strategy2MappingService.deleteByKey(id);
                break;
            case 'strategy_3':
                return strategy3MappingService.deleteByKey(id);
                break;
            case 'daily_pricing_model':
                return dailyPricingModelMappingService.deleteByKey(id);
                break;
            case 'payment_size_detail':
                return paymentSizeDetailMappingService.deleteByKey(id);
                break;
            case 'price_download_scheme':
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