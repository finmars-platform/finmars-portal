/**
 * Created by szhitenev on 20.05.2020.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getCredentialList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'data-provider/bloomberg/credential/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getCredentialByKey = function (id) {
        return xhrService.fetch(baseUrl + 'data-provider/bloomberg/credential/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var createCredential = function (data) {
        return xhrService.fetch(baseUrl + 'data-provider/bloomberg/credential/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: data
            })
    };

    var updateCredential = function (id, data) {
        return xhrService.fetch(baseUrl + 'data-provider/bloomberg/credential/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: data
            })
    };

    var deleteCredentialByKey = function (id) {
        return xhrService.fetch(baseUrl + 'data-provider/bloomberg/credential/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
                //return data.json();
            })
    };

    module.exports = {

        getCredentialList: getCredentialList,
        getCredentialByKey: getCredentialByKey,
        createCredential: createCredential,
        updateCredential: updateCredential,
        deleteCredentialByKey: deleteCredentialByKey

    }

}());