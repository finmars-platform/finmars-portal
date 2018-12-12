/**
 * Created by szhitenev on 29.09.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

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

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/transaction-class/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
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