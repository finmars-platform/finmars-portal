'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';
// var baseUrlService = require('../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getList = function (options) {

    if (!options) {
        options = {};
    }

    options.pageSize = options.pageSize || 1000;


    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/periodicity/', options),
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
};

export default {
    getList: getList
};