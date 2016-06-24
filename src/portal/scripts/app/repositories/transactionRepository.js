/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = '/api/v1/';

    var getList = function (options) {
        return window.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/transaction/', options),
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

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'transactions/transaction/' + id + '/',
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

    var create = function (transaction) {
        return window.fetch(baseUrl + 'transactions/transaction/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transaction)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, transaction) {
        return window.fetch(baseUrl + 'transactions/transaction/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transaction)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'transactions/transaction/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
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