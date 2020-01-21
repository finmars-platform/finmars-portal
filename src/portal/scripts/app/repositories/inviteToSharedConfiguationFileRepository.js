/**
 * Created by szhitenev on 17.01.2020.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getListOfMyInvites = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'configuration-sharing/my-invites/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getByKeyMyInvite = function (id) {
        return xhrService.fetch(baseUrl + 'configuration-sharing/my-invites/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };


    var updateMyInvite = function (id, item) {
        return xhrService.fetch(baseUrl + 'configuration-sharing/my-invites/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(item)
            })
    };

    var deleteByKeyMyInvite = function (id) {
        return xhrService.fetch(baseUrl + 'configuration-sharing/my-invites/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })
    };

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'configuration-sharing/invites/', options),
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
        return xhrService.fetch(baseUrl + 'configuration-sharing/invites/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (item) {
        return xhrService.fetch(baseUrl + 'configuration-sharing/invites/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(item)
            })
    };


    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'configuration-sharing/invites/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    resolve({status: 'deleted'});
                });
            })
    };

    module.exports = {
        getListOfMyInvites: getListOfMyInvites,
        getByKeyMyInvite: getByKeyMyInvite,
        updateMyInvite: updateMyInvite,
        deleteByKeyMyInvite: deleteByKeyMyInvite,

        getList: getList,
        getByKey: getByKey,
        create: create,
        deleteByKey: deleteByKey
    }

}());