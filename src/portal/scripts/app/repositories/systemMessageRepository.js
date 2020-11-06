/**
 * Created by szhitenev on 30.10.2020.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        if (!options) {
            options = {};
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'system-messages/message/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'system-messages/message/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var update = function (id, item) {
        return xhrService.fetch(baseUrl + 'system-messages/message/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(currency)
            })
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        update: update
    }

}());