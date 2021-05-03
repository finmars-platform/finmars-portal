/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

	'use strict';

	var cookieService = require('../../../../core/services/cookieService');
	var xhrService = require('../../../../core/services/xhrService');
	var baseUrlService = require('../services/baseUrlService');

	var baseUrl = baseUrlService.resolve();

	var handleError = function (methodName) {
		console.log('Method: ' + methodName + '. Cannot get data from server');
	};

	var login = function (login, password) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/login/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify({username: login, password: password})
		})
	};

	var logout = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/logout/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify({})
		})
	};

	var ping = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/ping/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var protectedPing = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/protected-ping/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/' + id + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMe = function () {

		var baseUrl = baseUrlService.resolve();


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/0/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMyCurrentMember = function () {

		var baseUrl = baseUrlService.resolve();
		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/0/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getCurrentMasterUser = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/get-current-master-user/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var changePassword = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/' + id + '/set-password/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var update = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var patch = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/' + id + '/', {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var deleteByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user/' + id + '/', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var createMasterUser = function (user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var getMasterListLight = function () {

		var baseUrl = baseUrlService.resolve();


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user-light/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMasterList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMasterByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/' + id + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var updateMaster = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var patchMaster = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/' + id + '/', {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var deleteMasterByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/' + id + '/', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var setMasterUser = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/master-user/' + id + '/set-current/', {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMemberList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getMemberByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/' + id, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var updateMember = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/' + id, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var patchMember = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/' + id, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
	};

	var deleteMemberByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/member/' + id, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getGroupList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/group/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var getOwnMemberSettings = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user-member/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
	};

	var updateOwnMemberSettings = function (id, member) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/user-member/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(member)
		})
	};


	var getUsercodePrefixList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/usercode-prefix/',
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			})
	};

	var createUsercodePrefix = function (item) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/usercode-prefix/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(item)
			})
	};

	var deleteUserCodePrefixByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'users/usercode-prefix/' + id + '/', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return new Promise(function (resolve, reject) {
				resolve({status: 'deleted'});
			});
			//return data.json();
		})
	};

	module.exports = {
		login: login,
		logout: logout,

		ping: ping,
		protectedPing: protectedPing,

		getList: getList,
		getByKey: getByKey,
		getMe: getMe,
		getMyCurrentMember: getMyCurrentMember,
		changePassword: changePassword,
		update: update,
		patch: patch,
		deleteByKey: deleteByKey,

		getCurrentMasterUser: getCurrentMasterUser,
		createMasterUser: createMasterUser,
		getMasterList: getMasterList,
		getMasterListLight: getMasterListLight,
		getMasterByKey: getMasterByKey,
		updateMaster: updateMaster,
		patchMaster: patchMaster,
		deleteMasterByKey: deleteMasterByKey,
		setMasterUser: setMasterUser,

		getMemberList: getMemberList,
		getMemberByKey: getMemberByKey,
		updateMember: updateMember,
		patchMember: patchMember,
		deleteMemberByKey: deleteMemberByKey,

		getGroupList: getGroupList,

		getOwnMemberSettings: getOwnMemberSettings,
		updateOwnMemberSettings: updateOwnMemberSettings,


		getUsercodePrefixList: getUsercodePrefixList,
		createUsercodePrefix: createUsercodePrefix,
		deleteUserCodePrefixByKey: deleteUserCodePrefixByKey

	}

}());