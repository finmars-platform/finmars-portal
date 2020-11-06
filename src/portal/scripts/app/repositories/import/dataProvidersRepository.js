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

    var getList = function () {
        return xhrService.fetch(baseUrl + 'import/provider/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getConfigs = function () {
        return xhrService.fetch(baseUrl + 'import/config',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getConfig = function (providerId) {
        return xhrService.fetch(baseUrl + 'import/config/?provider=' + providerId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var setConfig = function (providerId, provider) {

        // Important! No headers as below required:
        // Accept: 'application/json',
        // 'Content-type': 'application/json'

        return xhrService.fetch(baseUrl + 'import/config/' + providerId + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: provider
            })


    };

    var createConfig = function (provider) {

        // Important! No headers as below required:
        // Accept: 'application/json',
        // 'Content-type': 'application/json

        return xhrService.fetch(baseUrl + 'import/config/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: provider
            })


    };

    var bloombergTestCertificate = function (data) {

        return xhrService.fetch(baseUrl + 'import/test-certificate/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })
    };

    var getPersonalProvidersList = function () {

        return xhrService.fetch(baseUrl + 'integrations/data-provider/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var getCredentials = function () {

        return xhrService.fetch(baseUrl + 'credentials/credentials/',
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

        return xhrService.fetch(baseUrl + 'credentials/credentials/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: JSON.stringify(data)
            })

    };

    var editCredential = function (credentialId, credential) {

        return xhrService.fetch(baseUrl + 'credentials/credentials/' + credentialId + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                },
                body: JSON.stringify(credential)
            })

    };

    var deleteCredential = function (credentialId) {

        return xhrService.fetch(baseUrl + 'credentials/credentials/' + credentialId + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                    'X-CSRFToken': cookieService.getCookie('csrftoken')
                }
            }).then(function () {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })

    };



    module.exports = {
        getList: getList,
        getConfigs: getConfigs,
        getConfig: getConfig,
        setConfig: setConfig,
        createConfig: createConfig,
        bloombergTestCertificate: bloombergTestCertificate,

        getPersonalProvidersList: getPersonalProvidersList,
        getCredentials: getCredentials,
        createCredential: createCredential,
        editCredential: editCredential,
        deleteCredential: deleteCredential
    }

}());