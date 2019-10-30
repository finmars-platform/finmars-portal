/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'transactions/complex-transaction/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/',
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

    var update = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/',
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

    var updateProperties = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/update-properties/',
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

    var updatePropertiesBulk = function (transactions) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/bulk-update-properties/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(transactions)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/',
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
            //return data.json();
        })
    };

    var initRebookComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/rebook/',
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

    var rebookComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/rebook/',
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


    var initRebookPendingComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/rebook-pending/',
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

    var rebookPendingComplexTransaction = function (id, transaction) {
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/' + id + '/rebook-pending/',
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
        return xhrService.fetch(baseUrl + 'transactions/complex-transaction/bulk-delete/',
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

    var recalculatePermissionTransaction = function(data){
        return xhrService.fetch(baseUrl + 'transactions/recalculate-permission-transaction/',
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

    var recalculatePermissionComplexTransaction = function(data){
        return xhrService.fetch(baseUrl + 'transactions/recalculate-permission-complex-transaction/',
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

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        initRebookComplexTransaction: initRebookComplexTransaction,
        rebookComplexTransaction: rebookComplexTransaction,

        updateProperties: updateProperties,
        updatePropertiesBulk: updatePropertiesBulk,

        initRebookPendingComplexTransaction: initRebookPendingComplexTransaction,
        rebookPendingComplexTransaction: rebookPendingComplexTransaction,

        deleteBulk: deleteBulk,

        recalculatePermissionTransaction: recalculatePermissionTransaction,
        recalculatePermissionComplexTransaction: recalculatePermissionComplexTransaction
    }

}());