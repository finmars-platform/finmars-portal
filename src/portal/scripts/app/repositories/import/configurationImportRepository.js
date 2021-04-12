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

    var checkForDuplicates = function (config) {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/configuration/check-duplicates/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: config
            })
    };

    module.exports = {
        checkForDuplicates: checkForDuplicates
    }

}());