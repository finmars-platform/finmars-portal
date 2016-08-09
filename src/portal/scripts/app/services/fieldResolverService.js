/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var entityFieldsRepository = require('../repositories/entityFieldsRepository');
    var accountRepository = require('../repositories/accountRepository');
    var instrumentRepository = require('../repositories/instrumentRepository');
    var instrumentTypeRepository = require('../repositories/instrumentTypeRepository');
    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');
    var currencyRepository = require('../repositories/currencyRepository');
    var portfolioRepository = require('../repositories/portfolioRepository');
    var counterpartyRepository = require('../repositories/counterpartyRepository');
    var responsibleRepository = require('../repositories/responsibleRepository');

    var strategyRepository = require('../repositories/strategyRepository');
    var strategyGroupRepository = require('../repositories/strategyGroupRepository');
    var strategySubgroupRepository = require('../repositories/strategySubgroupRepository');

    var getFields = function (fieldKey) {

        return new Promise(function (resolve, reject) {
            switch (fieldKey) {
                case 'daily_pricing_model':
                    entityFieldsRepository.getDailyPricingModelChoices().then(function(data){
                        resolve({type: 'key-value', key: 'daily_pricing_model', data: data});
                    });
                    break;
                case 'payment_size_detail':
                    entityFieldsRepository.getPaymentSizeDetailChoices().then(function(data){
                        resolve({type: 'key-value', key: 'payment_size_detail', data: data});
                    });
                    break;
                case 'transaction_class':
                    entityFieldsRepository.getTransactionClassList().then(function(data){
                        resolve({type: 'key-value', key: 'transaction_class', data: data});
                    });
                    break;
                case 'instrument':
                    instrumentRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'instrument', data: data.results});
                    });
                    break;
                case 'pricing_policy':
                    pricingPolicyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'pricing_policy', data: data.results});
                    });
                    break;
                case 'instrument_type':
                    instrumentTypeRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'instrument_type', data: data.results});
                    });
                    break;
                case 'accrued_currency':
                    currencyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'accrued_currency', data: data.results});
                    });
                    break;
                case 'pricing_currency':
                    currencyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'pricing_currency', data: data.results});
                    });
                    break;
                case 'transaction_currency':
                    currencyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'transaction_currency', data: data.results});
                    });
                    break;
                case 'settlement_currency':
                    currencyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'settlement_currency', data: data.results});
                    });
                    break;
                case 'currency':
                    currencyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'currency', data: data.results});
                    });
                    break;
                case 'portfolio':
                    portfolioRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'portfolio', data: data.results});
                    });
                    break;
                case 'counterparty':
                    counterpartyRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'counterparty', data: data.results});
                    });
                    break;
                case 'responsible':
                    responsibleRepository.getList().then(function(data){
                        resolve({type: 'id', key: 'responsible', data: data.results});
                    });
                    break;
                case 'type':
                    accountRepository.getTypeList().then(function(data){
                        resolve({type: 'id', key: 'type', data: data.results});
                    });
                    break;
                case 'account_cash':
                    accountRepository.getTypeList().then(function(data){
                        resolve({type: 'id', key: 'account_cash', data: data.results});
                    });
                    break;
                case 'account_position':
                    accountRepository.getTypeList().then(function(data){
                        resolve({type: 'id', key: 'account_position', data: data.results});
                    });
                    break;
                case 'account_interim':
                    accountRepository.getTypeList().then(function(data){
                        resolve({type: 'id', key: 'account_interim', data: data.results});
                    });
                    break;
                case 'strategy1_position':
                    strategyRepository.getList(1).then(function(data){
                        resolve({type: 'id', key: 'strategy1_position' ,data: data.results});
                    });
                    break;
                case 'strategy1_cash':
                    strategyRepository.getList(1).then(function(data){
                        resolve({type: 'id', key: 'strategy1_cash', data: data.results});
                    });
                    break;
                case 'strategy2_position':
                    strategyRepository.getList(2).then(function(data){
                        resolve({type: 'id', key: 'strategy2_position', data: data.results});
                    });
                    break;
                case 'strategy2_cash':
                    strategyRepository.getList(2).then(function(data){
                        resolve({type: 'id', key: 'strategy2_cash', data: data.results});
                    });
                    break;
                case 'strategy3_position':
                    strategyRepository.getList(3).then(function(data){
                        resolve({type: 'id', key: 'strategy3_position', data: data.results});
                    });
                    break;
                case 'strategy3_cash':
                    strategyRepository.getList(3).then(function(data){
                        resolve({type: 'id', key: 'strategy3_cash', data: data.results});
                    });
                    break;
                case 'portfolios':
                    portfolioRepository.getList().then(function(data){
                        resolve({type: 'multiple-ids', key: 'portfolios', data: data.results});
                    });
                    break;
                case 'counterparties':
                    counterpartyRepository.getList().then(function(data){
                        resolve({type: 'multiple-ids', key: 'counterparties', data: data.results});
                    });
                    break;
                case 'responsibles':
                    responsibleRepository.getList().then(function(data){
                        resolve({type: 'multiple-ids', key: 'responsibles', data: data.results});
                    });
                    break;
                case 'accounts':
                    accountRepository.getList().then(function(data){
                        resolve({type: 'multiple-ids', key: 'accounts', data: data.results});
                    });
                    break;


            }

        });

    };

    module.exports = {
        getFields: getFields
    }

}());