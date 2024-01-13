/**
 * Created by szhitenev on 29.09.2016.
 */
// import baseUrlService from "../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../services/baseUrlService").default;
    var cookieService = require('../../../../../core/services/cookieService').default;
    var xhrService = require('../../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../../services/baseUrlService');

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
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'transactions/transaction-class/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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