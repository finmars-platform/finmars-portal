'use strict';

import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
import configureRepositoryUrlService from '../../services/configureRepositoryUrlService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getList = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex/scheme/', options),
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

var create = function (scheme) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex/scheme/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(scheme)
        })
};

var getByKey = function (id) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex/scheme/' + id + '/',
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

var update = function (id, scheme) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex/scheme/' + id + '/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(scheme)
        })
};

var deleteByKey = function (id) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex/scheme/' + id + '/',
        {
            method: 'DELETE',
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
    create: create,
    getByKey: getByKey,
    update: update,
    deleteByKey: deleteByKey
};