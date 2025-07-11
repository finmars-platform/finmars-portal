// import baseUrlService from "../services/baseUrlService";
(function () {

    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    // var baseUrlService = require('../services/baseUrlService');
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;

    var configureRepositoryUrlService = require('./configureRepositoryUrlService').default;
    var baseUrl = baseUrlService.resolve();

    var initVault = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault/init/',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({'action': 'init'}),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    }
    var setVaultToken = function (base_api_url, vaultToken) {

        const authorizerUrl = baseUrlService.getAuthorizerUrl();

        return xhrService.fetch(authorizerUrl + '/master-user/' + base_api_url + '/set-vault-token/',
            {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({'vault_token': vaultToken}),
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    }


    var getHealth = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/vault/vault/health/',
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

        initVault: initVault,
        setVaultToken: setVaultToken,

        getHealth: getHealth,
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