/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return xhrService.fetch(baseUrl + 'reports/report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var getBalanceReport = function (options) {
        return xhrService.fetch(baseUrl + 'reports/balance-report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var getPnlReport = function (options) {
        return xhrService.fetch(baseUrl + 'reports/pl-report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var getTransactionReport = function (options) {
        return xhrService.fetch(baseUrl + 'reports/transaction-report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var getCashFlowProjectionReport = function (options) {
        return xhrService.fetch(baseUrl + 'reports/cash-flow-projection-report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var getPerformanceReport = function (options) {
        return xhrService.fetch(baseUrl + 'reports/performance-report/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    module.exports = {
        getList: getList,
        getBalanceReport: getBalanceReport,
        getPnlReport: getPnlReport,
        getTransactionReport: getTransactionReport,
        getCashFlowProjectionReport: getCashFlowProjectionReport,
        getPerformanceReport: getPerformanceReport
    }

}());