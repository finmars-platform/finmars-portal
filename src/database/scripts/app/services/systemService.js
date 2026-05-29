'use strict';

import cookieService from '../../../../core/services/cookieService';
import baseUrlService from './baseUrlService';

var baseUrl = baseUrlService.resolve();

var getEcosystemConfiguration = function () {

var prefix = baseUrlService.getMasterUserPrefix();

return window.fetch(baseUrl  + prefix + '/' + 'system/ecosystem-configuration/', {
        method: 'GET',
        credentials: 'include',
        headers: {
           'Authorization': 'Token ' + cookieService.getCookie('access_token'),
Accept: 'application/json',
            'Content-type': 'application/json'
        }
    }).then(function (data) {
        return data.json();
    })
};


export default {
    getEcosystemConfiguration: getEcosystemConfiguration
};