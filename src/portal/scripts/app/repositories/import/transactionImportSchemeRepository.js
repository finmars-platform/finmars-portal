/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'import/complex-transaction-import-scheme/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getListLight = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'import/complex-transaction-import-scheme-light/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };
    
    
    var create = function (data) {
        return xhrService.fetch(baseUrl + 'import/complex-transaction-import-scheme/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
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

    var update = function (id, data) {
        return xhrService.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                resolve({status: 'deleted'});
            });
        })
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());