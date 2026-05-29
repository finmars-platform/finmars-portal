'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';
// var baseUrlService = require('../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getList = function (options) {

    if (!options) {
        options = {
            pageSize: 1000
        }
    }

    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/entity-tooltip/', options),
        {
            method: 'GET',
            credentials: 'include',
            headers: {
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
}

var updateList = function (tooltipsList) {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/entity-tooltip',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(tooltipsList)
        })
};

export default {
    getList: getList,
    updateList: updateList
};