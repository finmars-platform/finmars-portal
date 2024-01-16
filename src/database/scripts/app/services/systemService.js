/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService').default;
    var baseUrlService = require('./baseUrlService').default;

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


    module.exports = {
        getEcosystemConfiguration: getEcosystemConfiguration
    }

}());