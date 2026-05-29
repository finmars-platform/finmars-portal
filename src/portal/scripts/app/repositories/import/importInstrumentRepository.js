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

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/instrument/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(config)
        })
};

export default {
    startImport: startImport
};