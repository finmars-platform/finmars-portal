(function () {

	'use strict';

	var baseUrlService = require('../services/baseUrlService');
	var cookieService = require('../../../../core/services/cookieService');
	var baseUrl = baseUrlService.resolve();

	var validate = function (data) {

		if (!data.hasOwnProperty('is_eval')) {
			data.is_eval = false;
		}


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('access_token'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				data: JSON.stringify(data)
			})
			.then(function (response) {

				if (!response.ok) {
					throw response;
				}

				return response.json()
			})


	};
	/**
	 *
	 * @param data {Object}
	 * @param {string} data.expression - expression formula
	 * @param {boolean} [data.is_eval = true]
	 * @returns {Promise<Response>}
	 */
	var getResultOfExpression = function (data) {

		if (!data.hasOwnProperty('is_eval')) {
			data.is_eval = true;
		}

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return window.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('access_token'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				data: JSON.stringify(data)
			})
			.then(function (response) {

				if (!response.ok) {
					throw response;
				}

				return response.json()
			})
	};

	module.exports = {
		validate: validate,
		getResultOfExpression: getResultOfExpression
	}

}());