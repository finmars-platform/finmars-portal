'use strict';

import baseUrlService from "./baseUrlService";

export default function () {

	const baseUrl = baseUrlService.resolve();

	const stateToUrl = {
		'app.portal.home': baseUrl + '/v/',
		'app.profile': baseUrl + '/v/profile'
	};

	function getUrl (stateName) {

		if (!stateToUrl.hasOwnProperty(stateName)) {
			throw new Error('There is no state with such name')
		}

		return stateToUrl[stateName];

	}

	return {
		getUrl: getUrl
	}
};