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

        var url;

        if (window.location.search.indexOf('sql=true') !== -1) {
            url = 'reports/balance-report-sql/'
        } else {
            url = 'reports/balance-report/'
        }

        return xhrService.fetch(baseUrl + url,
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

        var url;

        if (window.location.search.indexOf('sql=true') !== -1) {
            url = 'reports/transaction-report-sql/'
        } else {
            url = 'reports/transaction-report/'
        }

        return xhrService.fetch(baseUrl + url,
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