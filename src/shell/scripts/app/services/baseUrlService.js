'use strict';

window.base_api_url = '';

const resolve = () => {

	if ('__PROJECT_ENV__') {

		// const host = '__API_HOST__';
		const host = window.API_HOST;

		return host;

	}

	return ''

};

const getAuthorizerUrl = () => {
	// return '__AUTHORIZER_URL__'
	return window.AUTHORIZER_URL
}

/**
 * Actually sets current realm and space
 *
 * @param realmAndSpace
 */
const setMasterUserPrefix = function (realmAndSpace) {
	window.base_api_url = realmAndSpace;
}

/**
 * @return {String|undefined} - realm and space in form of ${realm}/${space}
 */
const getMasterUserPrefix = () => {
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