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

    var getEventAction = function (eventId, actionId) {
        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + eventId + '/book/?action=' + actionId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var putEventAction = function (eventId, actionId, data) {
        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + eventId + '/book/?action=' + actionId,
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

    var informedEventAction = function (id) {

        return xhrService.fetch(baseUrl + 'instruments/generated-event/' + id + '/informed/',
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

    var generateEventsRange = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'instruments/instrument/generate-events-range/', options),
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

    var sortEventsBy = function (options) {
        return
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        informedEventAction: informedEventAction,
        generateEvents: generateEvents,
        generateEventsRange: generateEventsRange
    }
}());