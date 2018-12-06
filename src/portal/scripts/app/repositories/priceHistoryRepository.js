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
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'instruments/price-history/', options),
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
        return xhrService.fetch(baseUrl + 'instruments/price-history/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (price) {
        return xhrService.fetch(baseUrl + 'instruments/price-history/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(price)
            })
    };

    var update = function (id, price) {
        return xhrService.fetch(baseUrl + 'instruments/price-history/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(price)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'instruments/price-history/' + id + '/',
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


    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());