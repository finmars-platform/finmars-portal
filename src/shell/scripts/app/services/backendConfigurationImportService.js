'use strict';

import cookieService from '../../../../core/services/cookieService';
import xhrService from '../../../../core/services/xhrService';
import baseUrlService from './baseUrlService';


var baseUrl = baseUrlService.resolve();

var importConfigurationAsJson = function (data) {

    var prefix = baseUrlService.getMasterUserPrefix();

    return xhrService.fetch(baseUrl + prefix + '/' + 'import/configuration-json/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CSRFToken': cookieService.getCookie('csrftoken'),
            'Authorization': 'Token ' + cookieService.getCookie('access_token'),
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};


export default {
    importConfigurationAsJson: importConfigurationAsJson,
};