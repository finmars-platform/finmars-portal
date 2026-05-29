'use strict';

import baseUrlService from "../services/baseUrlService";

// var baseUrlService = require('../services/baseUrlService');
import cookieService from '../../../../core/services/cookieService';

import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from './configureRepositoryUrlService';
var baseUrl = baseUrlService.resolve();


var getList = function (options) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();


    return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/ui/draft/', options),
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

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/ui/draft/' + id + '/',
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

var create = function (data) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/ui/draft/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
};

var update = function (id, data) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/ui/draft/' + id + '/',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
};

var deleteByKey = function (id) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();

    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/ui/draft/' + id + '/',
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
        .then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
            //return data.json();
        })
};


export default {
    getList: getList,
    getByKey: getByKey,
    create: create,
    update: update,
    deleteByKey: deleteByKey,
};