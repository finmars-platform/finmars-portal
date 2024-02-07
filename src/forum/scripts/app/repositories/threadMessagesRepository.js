/**
 * Created by sergey on 29.07.16.
 */
(function(){

    'use strict';

    var cookieService = require('../../../../core/services/cookieService').default;
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (options) {

var prefix = baseUrlService.getMasterUserPrefix();

return window.fetch(baseUrl  + prefix + '/' + 'chats/message/?ordering=created&thread=' + options.thread + '&page=' + options.page,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var getByKey = function (id) {

var prefix = baseUrlService.getMasterUserPrefix();

return window.fetch(baseUrl  + prefix + '/' + 'chats/message/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
 Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var create = function (thread) {

var prefix = baseUrlService.getMasterUserPrefix();

return window.fetch(baseUrl  + prefix + '/' + 'chats/message/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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

return window.fetch(baseUrl  + prefix + '/' + 'chats/message/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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

return window.fetch(baseUrl  + prefix + '/' + 'chats/message/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                   'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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