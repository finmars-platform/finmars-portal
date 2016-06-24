/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var baseUrl = '/api/v1/';

    var getList = function (options) {
        return window.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'instruments/price-history/', options),
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
        return window.fetch(baseUrl + 'instruments/price-history/' + id + '/',
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

    var create = function (price) {
        return window.fetch(baseUrl + 'instruments/price-history/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(price)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, price) {
        return window.fetch(baseUrl + 'instruments/price-history/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(price)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'instruments/price-history/' + id + '/',
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
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());