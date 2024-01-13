/**
 * Created by szhitenev on 22.12.2020.
 */

import baseUrlService from "../services/baseUrlService";
import configureRepositoryUrlService from "../../../../shell/scripts/app/services/configureRepositoryUrlService";

export default function (cookieService, xhrService) {

	var baseUrl = baseUrlService.resolve();

	/**
	 *
	 * @param {String} contentType
	 * @param {String} key
	 * @param {Number} valueType
	 * @param { {} } options
	 * @return {Promise<*>}
	 */
	var getValuesForSelect = function (contentType, key, valueType, options={}) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		if (!options.filters) {
			options.filters = {}
		}

		options.filters.content_type = contentType
		options.filters.key = key;
		options.filters.value_type = valueType;

		// baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'specific-data/values-for-select/?content_type=' + contentType + '&key=' + key + '&value_type=' + valueType
		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'specific-data/values-for-select/', options),
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