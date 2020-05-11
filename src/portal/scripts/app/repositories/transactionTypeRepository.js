/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/transaction-type/', options),
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

    var getListLight = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/transaction-type-light/', options),
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

    var getListLightWithInputs = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/transaction-type-light-with-inputs/', options),
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

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
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

    var getByKeyLight = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type-light/' + id + '/',
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

    var create = function (transaction) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transaction)
            })
    };

    var update = function (id, data) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var patch = function (id, data) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
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

    var updateBulkLight = function (transactionTypes) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type-light/bulk-update/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transactionTypes)
            })
    };

    var updateBulk = function (transactionTypes) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/bulk-update/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transactionTypes)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/',
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

    var initBookComplexTransaction = function (id, contextData) {

        var contextDataAsQueryParameters = '';

        if (contextData && Object.keys(contextData).length) {

            var list = [];

            Object.keys(contextData).forEach(function (key) {

                if (contextData[key]) {
                    list.push(key + '=' + contextData[key])
                }

            });

            contextDataAsQueryParameters = '?' + list.join('&')

        }

        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/book/' + contextDataAsQueryParameters,
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

    var bookComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/book/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transaction)
            })
    };

    var initBookPendingComplexTransaction = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/book-pending/',
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

    var bookPendingComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/' + id + '/book-pending/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transaction)
            })
    };

    var deleteBulk = function (data) {
        return xhrService.fetch(baseUrl + 'transactions/transaction-type/bulk-delete/',
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
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getListLightWithInputs: getListLightWithInputs,
        getByKey: getByKey,
        getByKeyLight: getByKeyLight,
        create: create,
        update: update,
        patch: patch,
        deleteByKey: deleteByKey,


        initBookComplexTransaction: initBookComplexTransaction,
        bookComplexTransaction: bookComplexTransaction,

        initBookPendingComplexTransaction: initBookPendingComplexTransaction,
        bookPendingComplexTransaction: bookPendingComplexTransaction,

        updateBulkLight: updateBulkLight,
        updateBulk: updateBulk,
        deleteBulk: deleteBulk
    }

}());