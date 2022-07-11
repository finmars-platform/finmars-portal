/**
 * Created by szhitenev on 04.05.2016.
 */

'use strict';

const baseUrlService = require('./baseUrlService');

export default function (cookieService) {

	// var cookieService = require('../../../../core/services/cookieService');
	var baseUrl = baseUrlService.resolve();

	const importConfigurationAsJson = function (data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/configuration-json/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			data: JSON.stringify(data)
		}).then(function (data) {
			return data.json();
		})
	};

	return {
		importConfigurationAsJson: importConfigurationAsJson,
	}

};