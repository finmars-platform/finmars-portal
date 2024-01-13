/**
 * Created by szhitenev on 26.08.2016.
 */
// import baseUrlService from "../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        if (!options) {
            options = {};
        }

        options.pageSize = options.pageSize || 1000;

        
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/accrual-calculation-model/', options),
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

    module.exports = {
        getList: getList
    };

}());