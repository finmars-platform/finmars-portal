/**
 * Created by sergey on 29.07.16.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {
        var fetchUrl = '';
        if (options.page && options.page.length) {
            fetchUrl = 'chats/thread/?ordering=created&page=' + options.page + '&thread_group=' + options.threadGroup;
        } else {
            fetchUrl = 'chats/thread/?ordering=created' + '&thread_group=' + options.threadGroup;
        }
        //
        // var prefix = baseUrlService.getMasterUserPrefix();
        //
        // return window.fetch(baseUrl  + prefix + '/' + 'chats/thread/?ordering=created&page=' + options.page + '&thread_group=' + options.threadGroup,

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(baseUrl + prefix + '/' + fetchUrl,
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

    var getByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(baseUrl + prefix + '/' + 'chats/thread/' + id + '/',
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

    var create = function (thread) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(baseUrl + prefix + '/' + 'chats/thread/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(thread)
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (id, thread) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(baseUrl + prefix + '/' + 'chats/thread/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(thread)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {

        var prefix = baseUrlService.getMasterUserPrefix();

        return window.fetch(baseUrl + prefix + '/' + 'chats/thread/' + id + '/',
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