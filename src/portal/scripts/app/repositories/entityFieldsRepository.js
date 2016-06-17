/**
 * Created by szhitenev on 17.06.2016.
 */
(function () {

    'use strict';

    var getDailyPricingModelChoices = function () {
        return new Promise(function(resolve, reject){
            resolve([
                {
                    "value": "1",
                    "name": "Skip"
                },
                {
                    "value": "2",
                    "name": "Manual"
                },
                {
                    "value": "3",
                    "name": "Bloomberg"
                }
            ])
        });
    };

    var getPaymentSizeDetailChoices = function () {
        return new Promise(function(resolve, reject) {
            resolve([
                {
                    "value": "1",
                    "name": "% per annum"
                },
                {
                    "value": "2",
                    "name": "per annum"
                },
                {
                    "value": "3",
                    "name": "per quarter"
                },
                {
                    "value": "4",
                    "name": "per month"
                },
                {
                    "value": "5",
                    "name": "per week"
                },
                {
                    "value": "6",
                    "name": "per day"
                }
            ])
        });
    };

    module.exports = {
        getDailyPricingModelChoices: getDailyPricingModelChoices,
        getPaymentSizeDetailChoices: getPaymentSizeDetailChoices
    }

}());