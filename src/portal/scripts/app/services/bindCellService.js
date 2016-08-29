/**
 * Created by szhitenev on 24.06.2016.
 */
(function () {

    'use strict';

    var instrumentRepository = require('../repositories/instrumentRepository');
    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');
    var currencyRepository = require('../repositories/currencyRepository');
    var accountRepository = require('../repositories/accountRepository');
    var instrumentTypeRepository = require('../repositories/instrumentTypeRepository');
    var transactionTypeRepository = require('../repositories/transactionTypeRepository');

    var strategyService = require('./strategyService');
    var strategyGroupService = require('./strategyGroupService');
    var strategySubgroupService = require('./strategySubgroupService');

    var entities = {};

    var findEntities = function (entity, options) {
        return new Promise(function (resolve) {

            if (!entities[entity]) {

                if (options.entityType.indexOf('strategy') !== -1) {

                    var entityTypePieces = options.entityType.split('-');

                    var strategyNumber = entityTypePieces[1];

                    if (entity === 'group') {
                        return strategyGroupService.getList(strategyNumber).then(function (data) {
                            entities[entity] = data.results;
                            resolve({key: entity, data: entities[entity]});
                        });
                    }
                    if (entity === 'subgroup') {
                        return strategySubgroupService.getList(strategyNumber).then(function (data) {
                            entities[entity] = data.results;
                            resolve({key: entity, data: entities[entity]});
                        });
                    }
                } else {
                    switch (entity) {
                        case 'instrument':
                            return instrumentRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'pricing_policy':
                            return pricingPolicyRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'currency':
                            return currencyRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'pricing_currency':
                            return currencyRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'accrued_currency':
                            return currencyRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'instrument_type':
                            return instrumentTypeRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'transaction_types':
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', entity);
                            return transactionTypeRepository.getList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                        case 'type':
                            return accountRepository.getTypeList().then(function (data) {
                                entities[entity] = data.results;
                                resolve({key: entity, data: entities[entity]});
                            });
                            break;
                    }
                }

            }
            resolve({key: entity, data: entities[entity]});
        })

    };

    module.exports = {
        findEntities: findEntities
    }

}());