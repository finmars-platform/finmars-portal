/**
 * Created by szhitenev on 28.04.2023.
 */
(function () {

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function () {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/?page_size=1000', {
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
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/' + id + '/', {
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
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            },
            body: data
        }).then(function (data) {
            return data.json();
        })

    };

    var update = function (id, data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/' + id + '/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token')
            },
            body: data
        }).then(function (data) {
            return data.json();
        })

    };

    var deleteByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/' + id + '/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })

    };

    var install = function (id, data) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        // TODO change fetch to universal fetch
        return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/configuration/new-member-setup-configuration/' + id + '/install/', {
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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        install: install
    }


}());