// import baseUrlService from "../services/baseUrlService";
(function () {
    'use strict';

    var baseUrlService = require("../services/baseUrlService").default;
    var cookieService = require('../../../../core/services/cookieService').default;
    var xhrService = require('../../../../core/services/xhrService').default;
    // var baseUrlService = require('../services/baseUrlService');
    var baseUrl = baseUrlService.resolve();
    var configureRepositoryUrlService = require('../services/configureRepositoryUrlService').default;

    var getList = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    // var eventAction = function (eventId, options) {
    // 	
    // var prefix = baseUrlService.getMasterUserPrefix();
    var apiVersion = baseUrlService.getApiVersion();
    //
    // return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/' + eventId + '/',
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

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/' + eventId + '/book/?action=' + actionId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var putEventAction = function (eventId, actionId, data, status) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/' + eventId + '/book/?action=' + actionId + '&event_status=' + status,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    };

    var informedEventAction = function (id) {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/' + id + '/informed/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })

    };

    var errorEventAction = function (id, actionId, data) {


        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/generated-event/' + id + '/error/?action=' + actionId,
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

    };

    var generateEvents = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/generate-events/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var generateEventsRange = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/generate-events-range/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    var generateAndProcessAsSystem = function () {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/system-generate-and-process/'),
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var generateEventsRangeForSingleInstrument = function (options) {

        var prefix = baseUrlService.getMasterUserPrefix();
        var apiVersion = baseUrlService.getApiVersion();

        return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'instruments/instrument/generate-events-range-for-single-instrument/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    'Authorization': 'Token ' + cookieService.getCookie('access_token'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(options)
            })
    };

    module.exports = {
        getList: getList,
        getEventAction: getEventAction,
        putEventAction: putEventAction,
        informedEventAction: informedEventAction,
        errorEventAction: errorEventAction,
        generateEvents: generateEvents,
        generateEventsRange: generateEventsRange,
        generateAndProcessAsSystem: generateAndProcessAsSystem,
        generateEventsRangeForSingleInstrument: generateEventsRangeForSingleInstrument
    }
}());