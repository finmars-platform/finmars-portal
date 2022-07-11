/**
 * Created by szhitenev on 22.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var startImport = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex-transaction-csv-file-import/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    var validateImport = function (config) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/complex-transaction-csv-file-import-validate/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    module.exports = {
        startImport: startImport,
        validateImport: validateImport
    }

}());