'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';
// var baseUrlService = require('../services/baseUrlService');

var baseUrl = baseUrlService.resolve();


var getStats = function (period) {

    var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();


    return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/utils/stats/?period=' + period,
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

export default {
    getStats: getStats,

};