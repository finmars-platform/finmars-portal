(function () {

    'use strict';

    var baseUrlService = require('../services/baseUrlService');
    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');

    var configureRepositoryUrlService = require('./configureRepositoryUrlService');
    var baseUrl = baseUrlService.resolve();


    var getCurrenciesList = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();


        return xhrService.fetch('https://database.finmars.com/api/v1/currency/',
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

    var getCounterpartiesList = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();


        return xhrService.fetch('https://database.finmars.com/api/v1/company/',
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
        getCurrenciesList: getCurrenciesList,
        getCounterpartiesList: getCounterpartiesList
    }

}());