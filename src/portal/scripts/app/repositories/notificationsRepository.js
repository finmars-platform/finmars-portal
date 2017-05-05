/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    'use strict';
    var baseUrlService = require('../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();
    var cookieService = require('../../../../core/services/cookieService');

    var getList = function (page, type) {
        var listUrl = '';
        switch (type) {
            case 'unreaded':
                listUrl = '?all=false&page=' + page
                break;
            default:
                listUrl = '?all=true&page=' + page
        }
        console.log('notification list url is', listUrl);
        return window.fetch(baseUrl + 'notifications/notification/' + listUrl,
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

    var markAsReaded = function (url, data) {
        var markUrl;
        return window.fetch(baseUrl + 'notifications/notification/' + url + '/mark-as-read/',
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
            return data.json();
        });
    }

    var markAllAsReaded = function () {
        var markUrl;
        //return window.fetch(baseUrl + 'notifications/notification/mark-as-read/',
        return window.fetch(baseUrl + 'notifications/notification/mark-all-as-read/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({})
            }).then(function (data) {
            return data.json();
        });
    }

    module.exports = {
        getList: getList,
        markAsReaded: markAsReaded,
        markAllAsReaded: markAllAsReaded
    }

}());