/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    var baseUrlService = require('./baseUrlService').default;


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


    module.exports = {
        importConfigurationAsJson: importConfigurationAsJson,
    }

}());