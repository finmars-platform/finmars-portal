(function () {
    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('../services/baseUrlService');
    var baseUrl = baseUrlService.resolve();

    var getList = function () {
        return window.fetch(baseUrl + 'instruments/generated-event/',
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

    // var eventAction = function (eventId, options) {
    // 	return window.fetch(baseUrl + 'instruments/generated-event/' + eventId + '/',
    // 	{
    // 		method: 'PUT',
    // 		credentials: 'include',
    // 		headers: {
    // 			'X-CSRFToken': cookieService.getCookie('csrftoken'),
    // 			Accept: 'application/json',
    // 			'Content-type': 'application/json'
    // 		},
    // 		body: JSON.stringify(options)
    // 	}).then(function (data) {
    // 		return data.json();
    // 	});
    // }
    var getEventAction = function (url) {
        return window.fetch(baseUrl + 'instruments/generated-event/' + url.eventId + '/book/?action=' + url.actionId,
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

    var putEventAction = function (url, data) {
        return window.fetch(baseUrl + 'instruments/generated-event/' + url.eventId + '/book/?action=' + url.actionId,
            {
                method: 'PUT',
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
    };

    var ignoreEventAction = function (id) {

        return window.fetch(baseUrl + 'instruments/generated-event/' + id + '/ignore/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        });

    };

    var generateEvents = function () {
        return window.fetch(baseUrl + 'instruments/instrument/generate-events/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        });
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        ignoreEventAction: ignoreEventAction,
        generateEvents: generateEvents
    }
}());