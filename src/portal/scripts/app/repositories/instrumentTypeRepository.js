/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService'); var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getListLight = function (options) {

        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type-light/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKey = function (id) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (data) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var update = function (id, data) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteByKey = function (id) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
        })
    };

    var updateBulk = function (data) {

        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/bulk-update/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

    };

    var deleteBulk = function (data) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/bulk-delete/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })
    };

    var updatePricing = function(id, data) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument-type/' + id + '/update-pricing/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk,

        updatePricing: updatePricing
    }

}());