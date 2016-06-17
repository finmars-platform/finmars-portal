/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var entityFieldsRepository = require('../repositories/entityFieldsRepository');
    var accountRepository = require('../repositories/accountRepository');

    var getFields = function (fieldKey) {

        return new Promise(function (resolve, reject) {
            switch (fieldKey) {
                case 'daily_pricing_model':
                    entityFieldsRepository.getDailyPricingModelChoices().then(function(data){
                        resolve(data);
                    });
                    break;
                case 'payment_size_detail':
                    entityFieldsRepository.getPaymentSizeDetailChoices().then(function(data){
                        resolve(data);
                    });
                    break;
                case 'type':
                    accountRepository.getTypeList().then(function(data){
                        resolve(data.results);
                    });
                    break;
            }

        });

    };

    module.exports = {
        getFields: getFields
    }

}());