/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('./baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var importConfigurationAsJson = function (data) {

var prefix = baseUrlService.getMasterUserPrefix();

return window.fetch(baseUrl  + prefix + '/' + 'import/configuration-json/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': cookieService.getCookie('csrftoken'),
               'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
 Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })
    };


    module.exports = {
        importConfigurationAsJson: importConfigurationAsJson,
    }

}());