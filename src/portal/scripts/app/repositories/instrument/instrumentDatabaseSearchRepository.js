'use strict';

import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
import configureRepositoryUrlService from '../../services/configureRepositoryUrlService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getList = function ( searchString, options={} ) {

    /*var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();*/
    if (!options.filters) {
        options.filters = {}
    }

    if (searchString) options.filters.query = searchString;

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

    const requestParamsObj = {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + cookieService.getCookie('access_token'),
            Accept: 'application/json',
            'Content-type': 'application/json'
        }
    };

    if (options.abortSignal) {
        requestParamsObj.signal = options.abortSignal;
    }

    return xhrService.fetch(
        configureRepositoryUrlService.configureUrl('https://database.finmars.com/api/v1/instrument-narrow/', options),
        requestParamsObj
    )
};


export default {
    getList: getList
};