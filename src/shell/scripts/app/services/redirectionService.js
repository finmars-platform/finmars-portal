'use strict';

import baseUrlService from "./baseUrlService";

export default function () {

	const baseUrl = baseUrlService.resolve();

	let profileUrl = baseUrl + '/v/profile'

	if (window.location.href.indexOf('0.0.0.0') !== -1) { // for local develop mode
		profileUrl = '/#!/profile'
	}

	const stateToUrl = {
		'app.portal.home': baseUrl + '/v/',
		'app.profile': profileUrl,
		'app.portal.reports.performance-report': baseUrl + '/v/reports/performance',
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