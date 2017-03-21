/**
 * Created by szhitenev on 29.09.2016.
 */
(function () {

    'use strict';

    var transactionClasses = [
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
    ];

    var getList = function () {
        return new Promise(function (resolve, reject) {
            resolve(transactionClasses)
        })
    };

    var getListSync = function () {
        return transactionClasses;
    };

    module.exports = {
        getList: getList,
        getListSync: getListSync
    }

}());