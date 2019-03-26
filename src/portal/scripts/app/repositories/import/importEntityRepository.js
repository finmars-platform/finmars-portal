/**
 * Created by szhitenev on 18.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var startImport = function (config) {

        return xhrService.fetch(baseUrl + 'import/csv/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    var validateImport = function (config) {

        return xhrService.fetch(baseUrl + 'import/csv-validate/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
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