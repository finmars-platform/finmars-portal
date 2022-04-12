/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (name, page, instrument_type) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        if (!page) {
            page = 1
        }

        var instrumentDatabaseUrl = baseUrl + '/' + prefix + '/api/'  + 'instruments/instrument-database-search/?name=' + name + '&page=' + page

        if (instrument_type) {
            instrumentDatabaseUrl = instrumentDatabaseUrl + '&instrument_type=' + instrument_type

        }

        return xhrService.fetch(instrumentDatabaseUrl,
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


    module.exports = {
        getList: getList
    }

}());