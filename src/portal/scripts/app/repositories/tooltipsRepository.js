(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');

    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        if (!options) {
            options = {
                pageSize: 1000
            }
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'ui/entity-tooltip/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    }

    var updateList = function (tooltipsList) {
        return xhrService.fetch(baseUrl + 'ui/entity-tooltip',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(tooltipsList)
            })
    };

    module.exports = {
        getList: getList,
        updateList: updateList
    }

}());