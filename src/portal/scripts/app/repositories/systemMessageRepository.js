'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';

// var baseUrlService = require('../services/baseUrlService');
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';

var baseUrl = baseUrlService.resolve();

var getList = function (options) {

    if (!options) {
        options = {};
    }


    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'system-messages/message/', options),
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

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'system-messages/message/' + id + '/',
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

var update = function (id, item) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'system-messages/message/' + id + '/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
};

var viewFile = function (id) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    // Warning, response could not be JSON (it can be txt, xml, png etc)
    return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'file-reports/file-report/' + id + '/view/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
            }
        }).then(function (response) {
        return response.blob()
    })

}


var solve = function (id, item) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'system-messages/message/' + id + '/solve/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
};


var comment = function (id, item) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'system-messages/message/' + id + '/comment/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
};

export default {

    getList: getList,
    getByKey: getByKey,
    update: update,

    viewFile: viewFile,

    solve: solve,
    comment: comment
};