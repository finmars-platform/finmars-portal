'use strict';

import baseUrlService from "../services/baseUrlService";
import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import configureRepositoryUrlService from '../services/configureRepositoryUrlService';
// var baseUrlService = require('../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var getInstrumentMappingList = function () {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'import/instruments/instrument/mapping/',
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
    getInstrumentMappingList: getInstrumentMappingList
};