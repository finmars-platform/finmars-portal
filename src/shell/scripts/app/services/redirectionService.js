'use strict';

import baseUrlService from "./baseUrlService";

export default function () {



	function getUrl (stateName) {

		const baseUrl = baseUrlService.resolve();
		const base_api_url = baseUrlService.getMasterUserPrefix()

		let profileUrl = baseUrl + '/v/profile'

		if (window.location.href.indexOf('0.0.0.0') !== -1) { // for local develop mode
			profileUrl = '/#!/profile'
		}

		const stateToUrl = {
			'app.portal.home': baseUrl + '/' + base_api_url + '/v/',
			'app.profile': profileUrl,
			'app.portal.reports.performance-report': baseUrl + '/' + base_api_url + '/v/reports/performance',
		};


		if (!stateToUrl.hasOwnProperty(stateName)) {
			throw new Error('There is no state with such name')
		}

		return stateToUrl[stateName];

	}

	return {
		getUrl: getUrl
	}
};