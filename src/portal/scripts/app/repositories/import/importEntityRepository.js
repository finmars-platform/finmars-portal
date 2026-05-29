'use strict';

import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
import configureRepositoryUrlService from '../../services/configureRepositoryUrlService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var startImport = function (config) {


    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/csv/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                'X-CSRFToken': cookieService.getCookie('csrftoken')
            },
            body: config
        })
};

var validateImport = function (config) {


    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/csv-validate/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                'X-CSRFToken': cookieService.getCookie('csrftoken')
            },
            body: config
        })
};

export default {
    startImport: startImport,
    validateImport: validateImport
};