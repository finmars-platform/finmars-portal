'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from './configureRepositoryUrlService';
var baseUrl = baseUrlService.resolve();


var getList = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();


    return xhrService.fetch(configureRepositoryUrlService.configureUrl('https://marketplace.finmars.com/api/v1/configuration/', options),
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

var getByKey = function (id) {

    return xhrService.fetch('https://marketplace.finmars.com/api/v1/configuration/' + id + '/',
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

var getVersions = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();


    return xhrService.fetch(configureRepositoryUrlService.configureUrl('https://marketplace.finmars.com/api/v1/configuration-release/', options),
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
    getList: getList,
    getByKey: getByKey,

    getVersions: getVersions,
};