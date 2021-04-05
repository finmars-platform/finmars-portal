(function () {

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');
    var entityUrlService = require('../../services/entityUrlService');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var baseUrl = baseUrlService.resolve();
    var xhrService = require('../../../../../core/services/xhrService');

    // DEPRECATED
    var getList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);

        var queryParams = '';

        if (options) {
            queryParams = '?' + queryParamsHelper.toQueryParamsString(options)
        }


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return window.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + entityUrl + '-ev-group/' + queryParams,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })


    };

    var getFilteredList = function (entityType, options) {

        var entityUrl = entityUrlService.resolve(entityType);

        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + entityUrl + '-ev-group/filtered/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })


    };

    module.exports = {
        getList: getList, // DEPRECATED
        getFilteredList: getFilteredList
    }


}());