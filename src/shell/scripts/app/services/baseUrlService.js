'use strict';

window.base_api_url = '';

const resolve = () => {

	if ('__PROJECT_ENV__') {

		const host = '__API_HOST__';

		return host;

	}

	return ''

};

const getAuthorizerUrl = () => {
	return '__AUTHORIZER_URL__'
}

const setMasterUserPrefix = function (_prefix) {
	window.base_api_url = _prefix;
	console.log("testing_opendatabase setMasterUserPrefix", _prefix, window.base_api_url);
	console.trace();
}

const getMasterUserPrefix = () => {
	console.log("testing_opendatabase getMasterUserPrefix", window.base_api_url);
	return window.base_api_url
}

const getApiVersion = () => {
	return 'api/v1'
}

export default {
	resolve: resolve,
	getAuthorizerUrl: getAuthorizerUrl,
	setMasterUserPrefix: setMasterUserPrefix,
	getMasterUserPrefix: getMasterUserPrefix,

	getApiVersion: getApiVersion
}