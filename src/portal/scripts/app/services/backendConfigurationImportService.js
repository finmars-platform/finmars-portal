/**
 * Created by szhitenev on 04.05.2016.
 */

'use strict';

import baseUrlService from './baseUrlService';
import xhrService from '../../../../core/services/xhrService';

export default function (cookieService) {

	// var cookieService = require('../../../../core/services/cookieService').default;
	var baseUrl = baseUrlService.resolve();

	const importConfigurationAsJson = function (data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'import/configuration-json/', {
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

	return {
		importConfigurationAsJson: importConfigurationAsJson,
	}

}