/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var exportAll = function () {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return window.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/',
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

    var getConfigurationData = function () {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return window.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/', {
            method: 'GET',
            credentials: 'include',
            headers: {
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    var getMappingData = function () {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return window.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'export/mapping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    module.exports = {
        exportAll: exportAll,
        getConfigurationData: getConfigurationData,
        getMappingData: getMappingData
    }


}());