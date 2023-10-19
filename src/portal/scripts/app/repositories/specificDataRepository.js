/**
 * Created by szhitenev on 22.12.2020.
 */

import baseUrlService from "../services/baseUrlService";

export default function (cookieService, xhrService) {

	var baseUrl = baseUrlService.resolve();

	var getValuesForSelect = function (contentType, key, valueType) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'specific-data/values-for-select/?content_type=' + contentType + '&key=' + key + '&value_type=' + valueType,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': 'Token ' + cookieService.getCookie('access_token'),
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			})
	};

	return {
		getValuesForSelect: getValuesForSelect,
	};

};