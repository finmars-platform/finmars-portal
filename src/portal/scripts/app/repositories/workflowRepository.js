'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';
// var baseUrlService = require('../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getList = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/workflow/api/workflow/', options),
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

var getByKey = function (id) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/workflow/api/workflow/' + id + '/',
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

var executeCode = function (data) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/workflow/api/execute-code/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
};

export default {

    getList: getList,
    getByKey: getByKey,
    executeCode: executeCode

};