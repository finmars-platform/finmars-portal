/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService'); var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();
    var getList = function () {
        return xhrService.fetch(baseUrl + 'instruments/instrument-type/',
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
        return xhrService.fetch(baseUrl + 'instruments/instrument-type/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (instrument) {
        return xhrService.fetch(baseUrl + 'instruments/instrument-type/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(instrument)
            })
    };

    var update = function (id, instrument) {
        return xhrService.fetch(baseUrl + 'instruments/instrument-type/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(instrument)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'instruments/instrument-type/' + id + '/',
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


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());