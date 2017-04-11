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
        return reportRepository.getBalanceReport(options);
    };

    var getPnlReport = function (options) {
        return reportRepository.getPnlReport(options);
    };

    var getCashFlowProjectionReport = function (options) {
        return reportRepository.getCashFlowProjectionReport(options);
    };

    var getTransactionReport = function (options) {
        return reportRepository.getTransactionReport(options);
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