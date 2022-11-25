(function () {

	'use strict';

	var baseUrlService = require('../services/baseUrlService');
	var cookieService = require('../../../../core/services/cookieService');
	var xhrService = require('../../../../core/services/xhrService');
	var baseUrl = baseUrlService.resolve();

	var validate = function (data) {

		if (!data.hasOwnProperty('is_eval')) {
			data.is_eval = false;
		}


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
			{
				method: 'POST',
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

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'utils/expression/',
			{
				method: 'POST',
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

	module.exports = {
		validate: validate,
		getResultOfExpression: getResultOfExpression
	}

}());