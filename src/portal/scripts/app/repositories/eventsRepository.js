(function () {
    'use strict';

    var cookieService = require('../../../../core/services/cookieService');
    var xhrService = require('../../../../core/services/xhrService');
    var baseUrlService = require('../services/baseUrlService');
    var baseUrl = baseUrlService.resolve();
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'instruments/generated-event/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    // var eventAction = function (eventId, options) {
    // 	return xhrService.fetch(baseUrl + 'instruments/generated-event/' + eventId + '/',
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
        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + url.eventId + '/book/?action=' + url.actionId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var putEventAction = function (url, data) {
        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + url.eventId + '/book/?action=' + url.actionId,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var ignoreEventAction = function (id) {

        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + id + '/ignore/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var generateEvents = function () {
        return xhrService.fetch(baseUrl + 'instruments/instrument/generate-events/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        ignoreEventAction: ignoreEventAction,
        generateEvents: generateEvents
    }
}());