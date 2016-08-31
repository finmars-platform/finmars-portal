/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');

    var baseUrl = '/api/v1/';

    var getList = function (options) {
        return window.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'instruments/payment-size-detail/', options),
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
        return window.fetch(baseUrl + 'instruments/payment-size-detail/' + id + '/',
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

    var create = function (account) {
        return window.fetch(baseUrl + 'instruments/payment-size-detail/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(account)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, account) {
        return window.fetch(baseUrl + 'instruments/payment-size-detail/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(account)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'instruments/payment-size-detail/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return new Promise(function(resolve,reject) {
                resolve({status: 'deleted'});
            });
            //return data.json();
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