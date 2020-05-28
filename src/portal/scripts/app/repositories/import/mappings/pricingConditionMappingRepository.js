/**
 * Created by szhitenev on 25.05.2020.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../../core/services/cookieService');
    var xhrService = require('../../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        if (!options) {
            options = {};
        }

        options.pageSize = options.pageSize || 1000;

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'import/pricing-condition-mapping/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };
    var create = function (map) {
        return xhrService.fetch(baseUrl + 'import/pricing-condition-mapping/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/pricing-condition-mapping/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var update = function (id, map) {
        return xhrService.fetch(baseUrl + 'import/pricing-condition-mapping/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/pricing-condition-mapping/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());