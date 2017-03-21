/**
 * Created by szhitenev on 17.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function () {
        return window.fetch(baseUrl + 'import/complex-transaction-import-scheme/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var create = function (scheme) {
        return window.fetch(baseUrl + 'import/complex-transaction-import-scheme/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                data.json().then(function (result) {
                    resolve({
                        response: result,
                        status: data.status
                    })
                })
            });
        })
    };

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, scheme) {
        return window.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                data.json().then(function (result) {
                    resolve({
                        response: result,
                        status: data.status
                    })
                })
            });
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'import/complex-transaction-import-scheme/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {
        getList: getList,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());