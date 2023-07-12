/**
 * Created by szhitenev on 04.05.2016.
 */
import configureRepositoryUrlService from "../../../../../shell/scripts/app/services/configureRepositoryUrlService";

(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function ( searchString, options={} ) {

        /*var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();*/
        if (!options.filters) {
            options.filters = {}
        }

        options.filters.query = searchString;

        if (options.page === null || options.page === undefined) {
            options.page = 1;
        }

        /*var instrumentDatabaseUrl = 'https://database.finmars.com/api/v1/instrument/?query=' + searchString + '&page_size=40' + '&page=' + page;

        if (instrument_type) {
            instrumentDatabaseUrl = instrumentDatabaseUrl + '&instrument_type=' + instrument_type;
        }*/
        if (!options.pageSize) {
            options.pageSize = 40;
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl('https://database.finmars.com/api/v1/instrument-narrow/', options),
            {
                method: 'GET',
                // credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    module.exports = {
        getList: getList
    }

}());