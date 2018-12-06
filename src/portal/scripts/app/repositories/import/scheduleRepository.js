/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getAccrualScheduleDownloadMethodList = function () {
        return xhrService.fetch(baseUrl + 'import/accrual-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getFactorScheduleDownloadMethodList = function () {
        return xhrService.fetch(baseUrl + 'import/factor-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getAccrualScheduleDownloadMethodList: getAccrualScheduleDownloadMethodList,
        getFactorScheduleDownloadMethodList: getFactorScheduleDownloadMethodList
    }

}());