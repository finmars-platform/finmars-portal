/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

        if (!options) {
            options = {};
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'currencies/currency/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getListLight = function (options) {

        if (!options) {
            options = {};
        }

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'currencies/currency-light/', options),
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
        return xhrService.fetch(baseUrl + 'currencies/currency/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (currency) {
        return xhrService.fetch(baseUrl + 'currencies/currency/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(currency)
            })
    };

    var update = function (id, currency) {
        return xhrService.fetch(baseUrl + 'currencies/currency/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(currency)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'currencies/currency/' + id + '/',
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

    var deleteBulk = function (data) {
        return xhrService.fetch(baseUrl + 'currencies/currency/bulk-delete/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)

            }).then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })
    };


    module.exports = {

        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk
    }

}());