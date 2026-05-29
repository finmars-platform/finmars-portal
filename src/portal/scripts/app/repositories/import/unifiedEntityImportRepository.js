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

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/unified_csv/',
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
    startImport: startImport
};