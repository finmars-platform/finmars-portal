/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'active_processes/active_processes/', options),
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

    var deleteByKey = function (id) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'active_processes/active_processes/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
            //return data.json();
        })
    };


    module.exports = {

        deleteByKey: deleteByKey,
        getList: getList
    }

}());