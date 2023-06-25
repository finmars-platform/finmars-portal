(function () {

    'use strict';

    var baseUrlService = require('../services/baseUrlService');
    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');

    var configureRepositoryUrlService = require('./configureRepositoryUrlService');
    var baseUrl = baseUrlService.resolve();

    var getStatus = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault/status/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    }

    var seal = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault/seal/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({'action': 'seal'}),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    }

    var unseal = function (key) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault/unseal/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({'action': 'unseal', 'key': key}),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    }

    var getListEngines = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-engine/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var createEngine = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-engine/create/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var deleteEngine = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-engine/delete/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    // Secrets

    var getListSecrets = function (engine_name) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/?engine_name=' + engine_name,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getSecret = function (engineName, path, version) {

        if (!version) {
            version = 1
        }

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/get/?engine_name=' + engineName + '&path=' + path + '&version=' + version,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getSecretMetadata = function (engineName, path) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/get-metadata/?engine_name=' + engineName + '&path=' + path,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    var createSecret = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/create/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var updateSecret = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/update/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var deleteSecret = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault-secret/delete/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    module.exports = {

        getStatus: getStatus,
        seal: seal,
        unseal: unseal,

        getListEngines: getListEngines,
        createEngine: createEngine,
        deleteEngine: deleteEngine,


        getListSecrets: getListSecrets,

        getSecret: getSecret,
        getSecretMetadata: getSecretMetadata,
        createSecret: createSecret,
        updateSecret: updateSecret,

        deleteSecret: deleteSecret
    }

}());