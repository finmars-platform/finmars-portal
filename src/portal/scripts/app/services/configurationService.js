/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var exportAll = function () {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/',
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

    var getConfigurationData = function () {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/configuration/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    var getMappingData = function () {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'export/mapping/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    var getList = function () {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/?page_size=1000', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    var getByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        }).then(function (data) {
            return data.json();
        })

    };

    var create = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })

    };

    var update = function (id, data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })

    };

    var deleteByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })

    };

    var exportConfiguration = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/export-configuration/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
            // }).then(function (data) {
            //     return data.blob();
            // })
        }).then(function (data) {
            return data.json();
        })

    };

    var importConfiguration = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/import-configuration/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                'X-CSRFToken': cookieService.getCookie('csrftoken')
            },
            body: data
        }).then(function (data) {
            return data.json();
        })

    };

    var pushConfigurationToMarketplace = function (id, data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/' + id + '/push-configuration-to-marketplace/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })

    };

    var installConfiguration = function (data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/configuration/install-configuration-from-marketplace/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (data) {
            return data.json();
        })

    };




    module.exports = {
        exportAll: exportAll,
        getConfigurationData: getConfigurationData,
        getMappingData: getMappingData,
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        exportConfiguration: exportConfiguration,
        importConfiguration: importConfiguration,
        pushConfigurationToMarketplace: pushConfigurationToMarketplace,
        installConfiguration: installConfiguration,
    }


}());