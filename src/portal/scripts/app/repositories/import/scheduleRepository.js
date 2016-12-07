/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getAccrualScheduleDownloadMethodList = function () {
        return window.fetch(baseUrl + 'import/accrual-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var getFactorScheduleDownloadMethodList = function () {
        return window.fetch(baseUrl + 'import/factor-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {
        getAccrualScheduleDownloadMethodList: getAccrualScheduleDownloadMethodList,
        getFactorScheduleDownloadMethodList: getFactorScheduleDownloadMethodList
    }

}());