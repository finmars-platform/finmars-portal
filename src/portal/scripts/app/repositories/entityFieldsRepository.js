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

    var getTransactionClassList = function() {
        return new Promise(function(resolve, reject) {
            resolve([
                {
                    "value": "1",
                    "name": "Buy"
                },
                {
                    "value": "2",
                    "name": "Sell"
                },
                {
                    "value": "3",
                    "name": "FX Trade"
                },
                {
                    "value": "4",
                    "name": "Instrument PL"
                },
                {
                    "value": "5",
                    "name": "Transaction PL"
                },
                {
                    "value": "6",
                    "name": "Transfer"
                },
                {
                    "value": "7",
                    "name": "FX Transfer"
                },
                {
                    "value": "8",
                    "name": "Cash-Inflow"
                },
                {
                    "value": "9",
                    "name": "Cash-Outflow"
                }
            ])
        })
    };

    module.exports = {
        getDailyPricingModelChoices: getDailyPricingModelChoices,
        getPaymentSizeDetailChoices: getPaymentSizeDetailChoices,
        getTransactionClassList: getTransactionClassList
    }

}());