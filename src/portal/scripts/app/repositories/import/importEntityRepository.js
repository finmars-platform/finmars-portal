/**
 * Created by szhitenev on 18.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var startImport = function (config) {

        var status = null;

        return window.fetch(baseUrl + 'import/csv/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            }).then(function (data) {

            status = data.status;

            return data.json()

        }).then(function (data) {

            return {
                status: status,
                response: data
            }

        })
    };

    module.exports = {
        startImport: startImport
    }

}());