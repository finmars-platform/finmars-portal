'use strict';

import baseUrlService from "../../services/baseUrlService";
import cookieService from '../../../../../core/services/cookieService';
import xhrService from '../../../../../core/services/xhrService';
// var baseUrlService = require('../../services/baseUrlService');

var baseUrl = baseUrlService.resolve();

var recalculate = function (dateFrom, dateTo) {
    
var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/recalculate-prices-accrued-price/?date_0=' + dateFrom + '&date_1=' + dateTo,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
               'Authorization': 'Token ' + cookieService.getCookie('access_token'),
Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
};


export default {
    recalculate: recalculate
};