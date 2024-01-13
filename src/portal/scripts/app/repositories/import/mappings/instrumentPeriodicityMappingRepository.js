/**
 * Created by szhitenev on 19.08.2016.
 */
// import baseUrlService from "../../../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../../../services/baseUrlService").default;
    var cookieService = require('../../../../../../core/services/cookieService').default;
    var xhrService = require('../../../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../../../services/configureRepositoryUrlService').default;
    // var baseUrlService = require('../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/periodicity-mapping/?page_size=1000',
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
    var create = function (map) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/periodicity-mapping/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var getByKey = function (id) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/periodicity-mapping/' + id + '/',
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

    var update = function (id, map) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/periodicity-mapping/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var deleteByKey = function (id) {
        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/periodicity-mapping/' + id + '/',
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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());