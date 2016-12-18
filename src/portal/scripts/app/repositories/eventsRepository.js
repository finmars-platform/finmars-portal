(function() {
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

	var eventAction = function (eventId, options) {
		return window.fetch(baseUrl + 'instruments/generated-event/' + eventId + '/',
		{
			method: 'PUT',
			credentials: 'include',
			headers: {
			    'X-CSRFToken': cookieService.getCookie('csrftoken'),
			    Accept: 'application/json',
			    'Content-type': 'application/json'
			},
			body: JSON.stringify(options)
		}).then(function (data) {
			return data.json();
		});
	}

	module.exports = {
		getList: getList,
		eventAction: eventAction
	}
}());