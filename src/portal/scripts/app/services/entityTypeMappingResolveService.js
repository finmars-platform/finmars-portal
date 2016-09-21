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

    var getList = function (entityType) {

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