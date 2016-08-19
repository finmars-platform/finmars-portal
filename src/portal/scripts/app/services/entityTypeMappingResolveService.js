/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var currencyMappingService = require('./import/currencyMappingService');
    var instrumentTypeMappingService = require('./import/instrumentTypeMappingService');

    var getList = function (entityType) {

        switch (entityType) {
            case 'currency':
                return currencyMappingService.getList();
                break;
            case 'instrument_type':
                return instrumentTypeMappingService.getList();
                break;
        }

    };

    var getByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.getByKey(id);
                break;
            case 'instrument_type':
                return currencyMappingService.getList();
                break;
        }

    };

    var create = function (entityType, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.create(map);
                break;
            case 'instrument_type':
                return currencyMappingService.getList();
                break;
        }

    };

    var update = function (entityType, id, map) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.update(id, map);
                break;
            case 'instrument_type':
                return currencyMappingService.getList();
                break;
        }

    };

    var deleteByKey = function (entityType, id) {
        switch (entityType) {
            case 'currency':
                return currencyMappingService.deleteByKey(id);
                break;
            case 'instrument_type':
                return currencyMappingService.getList();
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

}())