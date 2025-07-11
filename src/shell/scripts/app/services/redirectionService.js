'use strict';

import baseUrlService from "./baseUrlService";

export default function () {

	const PROJECT_ENV = '__PROJECT_ENV__';

	function getUrlByState (stateName) {

		let urlBeginning = baseUrlService.resolve();
		const base_api_url = baseUrlService.getMasterUserPrefix();

		if (base_api_url) urlBeginning += '/' + base_api_url;

		let profileUrl = baseUrlService.resolve() + '/v/profile' // no base_api_url for profile needed

		if (PROJECT_ENV === 'local') {
			profileUrl = urlBeginning + '/a/#!/profile'
		}

		const stateToUrl = {
			'app.portal.home': urlBeginning + '/v/home',
			'app.profile': profileUrl,
			'app.portal.reports.performance-report': urlBeginning + '/v/reports/performance',
			'app.portal.settings.users-groups': urlBeginning + '/v/settings/permissions',
			'app.portal.settings.vault-record': urlBeginning + '/v/settings/vault-record',
		};


		if (!stateToUrl.hasOwnProperty(stateName)) {
			throw new Error('There is no state with such name')
		}

		return stateToUrl[stateName];

	}

	function getUrl (path) {

		let urlBeginning = baseUrlService.resolve();
		const base_api_url = baseUrlService.getMasterUserPrefix();

		if (base_api_url) urlBeginning += '/' + base_api_url;

		urlBeginning = urlBeginning + '/v';

		return urlBeginning + path;

	}

	return {
		getUrlByState: getUrlByState,
		getUrl: getUrl,
	}
};