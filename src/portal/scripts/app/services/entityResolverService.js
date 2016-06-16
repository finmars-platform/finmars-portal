/**
 * Created by szhitenev on 16.06.2016.
 */
(function(){

    'use strict';

    var portfolioService = require('./portfolioService');
    var accountService = require('./accountService');
    var responsibleService = require('./responsibleService');
    var counterpartyService = require('./counterpartyService');
    var instrumentService = require('./instrumentService');

    var create = function(entityType, entity) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.create(entity);
                break;
            case 'account':
                return accountService.create(entity);
                break;
            case 'responsible':
                return responsibleService.create(entity);
                break;
            case 'counterparty':
                return counterpartyService.create(entity);
                break;
            case 'instrument':
                return instrumentService.create(entity);
                break;
        }
    };

    var update = function(entityType, id, entity) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.update(id, entity);
                break;
            case 'account':
                return accountService.update(id, entity);
                break;
            case 'responsible':
                return responsibleService.update(id, entity);
                break;
            case 'counterparty':
                return counterpartyService.update(id, entity);
                break;
            case 'instrument':
                return instrumentService.update(id, entity);
                break;
        }
    };

    var deleteByKey = function(entityType, id) {
        switch (entityType) {
            case 'portfolio':
                return portfolioService.deleteByKey(id);
                break;
            case 'account':
                return accountService.deleteByKey(id);
                break;
            case 'responsible':
                return responsibleService.deleteByKey(id);
                break;
            case 'counterparty':
                return counterpartyService.deleteByKey(id);
                break;
            case 'instrument':
                return instrumentService.deleteByKey(id);
                break;
        }
    };

    module.exports = {
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());