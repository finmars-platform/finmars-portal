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
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/accrual-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getFactorScheduleDownloadMethodList = function () {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/factor-schedule-download-method/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
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