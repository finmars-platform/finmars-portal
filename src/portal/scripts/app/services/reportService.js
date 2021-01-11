/**
 * Created by szhitenev on 16.11.2016.
 */
(function () {

    'use strict';

    var reportRepository = require('../repositories/reportRepository');

    var getList = function (options) {
        return reportRepository.getList(options);
    };

    var getBalanceReport = function (options) {

        //TODO refactor soon
        var isSql = window.location.search.indexOf('report=legacy') === -1;

        return reportRepository.getBalanceReport(options, isSql);
    };

    var getPnlReport = function (options) {

        var isSql = window.location.search.indexOf('report=legacy') === -1;

        return reportRepository.getPnlReport(options, isSql);
    };

    var getCashFlowProjectionReport = function (options) {
        return reportRepository.getCashFlowProjectionReport(options);
    };

    var getTransactionReport = function (options) {

        var isSql = window.location.search.indexOf('report=legacy') === -1;

        return reportRepository.getTransactionReport(options, isSql);
    };

    var getPerformanceReport = function (options) {
        return reportRepository.getPerformanceReport(options);
    };

    module.exports = {
        getList: getList,
        getBalanceReport: getBalanceReport,
        getPnlReport: getPnlReport,
        getCashFlowProjectionReport: getCashFlowProjectionReport,
        getTransactionReport: getTransactionReport,
        getPerformanceReport: getPerformanceReport
    }

}());