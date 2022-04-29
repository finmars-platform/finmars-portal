/**
 * Created by szhitenev on 30.03.2021.
 *
 * Used when creating database.
 */

// (function () {

'use strict';

    /*var cookieService = require('../../../../core/services/cookieService');
    var baseUrlService = require('./baseUrlService');

    var authorizerUrl = baseUrlService.getAuthorizerUrl();*/

import baseUrlService from '../services/baseUrlService';

export default function (xhrService, cookieService) {

	const authorizerUrl = baseUrlService.getAuthorizerUrl();

	const getByKey = function (id) {

		return xhrService.fetch(authorizerUrl + '/user/' + id + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const update = function (id, user) {

		return xhrService.fetch(authorizerUrl + '/user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
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

	const checkMasterUserUniqueness = function (name) {

		return xhrService.fetch(authorizerUrl + '/master-user-check-uniqueness/?name=' + name, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const checkUserLicenseKey = function (key) {

		return xhrService.fetch(authorizerUrl + '/user-check-license/?key=' + key, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const createMasterUser = function (user) {

		return xhrService.fetch(authorizerUrl + '/master-user-create/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
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

	const getMasterUsersList = function () {

		return xhrService.fetch(authorizerUrl + '/master-user/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const getMasterUsersListLight = function () {

		return xhrService.fetch(authorizerUrl + '/master-user-light/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const getMasterUserByKey = function (id) {

		return xhrService.fetch(authorizerUrl + '/master-user/' + id, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const updateMasterUser = function (id, user) {

		return xhrService.fetch(authorizerUrl + '/master-user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		});
	};

	const setCurrentMasterUser = function (id) {

		return xhrService.fetch(authorizerUrl + '/master-user/' + id + '/set-current/', {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const getInviteFromMasterUserList = function (status) {

		return xhrService.fetch(authorizerUrl + '/invite-from-master-user/?status=' + status, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const updateInviteFromMasterUserByKey = function (id, invite) {

		return xhrService.fetch(authorizerUrl + '/invite-from-master-user/' + id + '/', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(invite)
		});
	};

	const leaveMasterUser = function (masterUserId) {

		return xhrService.fetch(authorizerUrl + '/master-user-leave/' + masterUserId + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const deleteMasterUserByKey = function (masterUserId) {

		return xhrService.fetch(authorizerUrl + '/master-user-delete/' + masterUserId + '/', {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		});
	};

	const copyMasterUser = function (data) {

		return xhrService.fetch(authorizerUrl + '/master-user-copy/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
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

	const exportToBackup = function (masterUserId) {

		return xhrService.fetch(authorizerUrl + '/master-user-export/' + masterUserId + '/', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})

	};

	const createMasterUserFromBackup = function (data) {

		return xhrService.fetch(authorizerUrl + '/master-user-create-from-backup/', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('authtoken')
			},
			body: data
		})
	}


	// module.exports = {
	return {
		getByKey: getByKey,
		update: update,

		createMasterUser: createMasterUser,
		getMasterUsersListLight: getMasterUsersListLight,
		getMasterUsersList: getMasterUsersList,
		getMasterUserByKey: getMasterUserByKey,
		updateMasterUser: updateMasterUser,
		setCurrentMasterUser: setCurrentMasterUser,

		checkMasterUserUniqueness: checkMasterUserUniqueness,
		checkUserLicenseKey: checkUserLicenseKey,

		getInviteFromMasterUserList: getInviteFromMasterUserList,
		updateInviteFromMasterUserByKey: updateInviteFromMasterUserByKey,

		leaveMasterUser: leaveMasterUser,
		deleteMasterUserByKey: deleteMasterUserByKey,


		copyMasterUser: copyMasterUser,

		exportToBackup: exportToBackup,
		createMasterUserFromBackup: createMasterUserFromBackup
	}

};
// }());