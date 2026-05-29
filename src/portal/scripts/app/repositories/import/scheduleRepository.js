'use strict';

import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
import configureRepositoryUrlService from '../../services/configureRepositoryUrlService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getAccrualScheduleDownloadMethodList = function () {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/accrual-schedule-download-method/',
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

var getFactorScheduleDownloadMethodList = function () {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/factor-schedule-download-method/',
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

export default {
    getAccrualScheduleDownloadMethodList: getAccrualScheduleDownloadMethodList,
    getFactorScheduleDownloadMethodList: getFactorScheduleDownloadMethodList
};