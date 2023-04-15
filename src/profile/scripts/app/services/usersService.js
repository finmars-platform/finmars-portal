/**
 * Created by szhitenev on 04.05.2016.
 */

(function () {

	'use strict';

	var cookieService = require('../../../../core/services/cookieService');
	var baseUrlService = require('./baseUrlService');

	var baseUrl = baseUrlService.resolve();

	var getByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/user/' + id + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var update = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then(function (data) {
			return new Promise(function (resolve, reject) {
				data.json().then(function (result) {
					resolve({
						response: result,
						status: data.status
					})
				})
			});
		})
	};

	var checkMasterUserUniqueness = function (name) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-check-uniqueness/?name=' + name, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var createMasterUser = function (user) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-create/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then(function (data) {

			if (data.status !== 200 && data.status !== 201) {
				throw data
			}

			return data.json();

		}).catch(function (reason) {

			console.log('createMasterUser reject?', reason);

			throw reason
		})
	};

	var getMasterList = function () {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var getMasterListLight = function () {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-light/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var getMasterByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user/' + id, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var updateMaster = function (id, user) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then(function (data) {
			return data.json();
		})
	};

	var setMasterUser = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user/' + id + '/set-current/', {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var getInviteFromMasterUserList = function (status) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/invite-from-master-user/?status=' + status, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var updateInviteFromMasterUserByKey = function (id, invite) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/invite-from-master-user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(invite)
		}).then(function (data) {
			return data.json();
		})
	};

	var leaveMasterUser = function (masterUserId) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-leave/' + masterUserId + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var deleteMasterUser = function (masterUserId) {

		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-delete/' + masterUserId + '/', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		}).then(function (data) {
			return data.json();
		})
	};

	var copyMasterUser = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();

		return window.fetch(baseUrl + prefix + '/' + 'users/master-user-copy/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(function (data) {

			if (data.status !== 200 && data.status !== 201) {
				throw data
			}

			return data.json();

		}).catch(function (reason) {

			console.log('createMasterUser reject?', reason);

			throw reason
		})

	};

	module.exports = {

		getByKey: getByKey,
		update: update,

		createMasterUser: createMasterUser,
		getMasterListLight: getMasterListLight,
		getMasterList: getMasterList,
		getMasterByKey: getMasterByKey,
		updateMaster: updateMaster,
		setMasterUser: setMasterUser,

		checkMasterUserUniqueness: checkMasterUserUniqueness,

		getInviteFromMasterUserList: getInviteFromMasterUserList,
		updateInviteFromMasterUserByKey: updateInviteFromMasterUserByKey,

		leaveMasterUser: leaveMasterUser,
		deleteMasterUser: deleteMasterUser,


		copyMasterUser: copyMasterUser
	}

}());