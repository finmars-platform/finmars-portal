/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var entityFieldsRepository = require('../repositories/entityFieldsRepository');
    var accountRepository = require('../repositories/accountRepository');
    var instrumentRepository = require('../repositories/instrumentRepository');
    var pricingPolicyRepository = require('../repositories/pricingPolicyRepository');

    var getFields = function (fieldKey) {

        return new Promise(function (resolve, reject) {
            switch (fieldKey) {
                case 'daily_pricing_model':
                    entityFieldsRepository.getDailyPricingModelChoices().then(function(data){
                        resolve({type: 'key-value', data: data});
                    });
                    break;
                case 'payment_size_detail':
                    entityFieldsRepository.getPaymentSizeDetailChoices().then(function(data){
                        resolve({type: 'key-value', data: data});
                    });
                    break;
                case 'instrument':
                    instrumentRepository.getList().then(function(data){
                        resolve({type: 'id', data: data.results});
                    });
                    break;
                case 'pricing_policy':
                    pricingPolicyRepository.getList().then(function(data){
                        resolve({type: 'id', data: data.results});
                    });
                    break;
                case 'type':
                    accountRepository.getTypeList().then(function(data){
                        resolve({type: 'id', data: data.results});
                    });
                    break;


            }

        });

    };

    module.exports = {
        getFields: getFields
    }

}());