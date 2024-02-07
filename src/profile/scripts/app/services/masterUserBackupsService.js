/**
 * Created by szhitenev on 04.10.2021.
 */

(function () {

	'use strict';

	var cookieService = require('../../../../core/services/cookieService').default;
	var baseUrlService = require('./baseUrlService').default;

	var getMasterUserBackupsList = function (base_api_url) {
		// TODO pagination
		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		let url = authorizerUrl + '/master-user-backups/';

		if (base_api_url) {
			url = url + '?master_user_base_api_url=' + base_api_url
		}

		return window.fetch(url,{
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

	var getMasterUserBackupByKey = function (id) {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user-backups/' + id + '/', {
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

	var updateMasterUserBackup = function (id, user) {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user-backups/' + id + '/', {
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

	var deleteMasterUserBackup = function (id) {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user-backups/' + id + '/', {
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

	var restoreFromBackup = function (id, data) {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user-backups/' + id + '/restore-from-backup/', {
			method: 'PUT',
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

	var rollbackFromBackup = function (master_user_id, data) {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user/' + master_user_id + '/rollback-from-backup/', {
			method: 'PUT',
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

		})

	};




	module.exports = {

		getMasterUserBackupsList: getMasterUserBackupsList,
		getMasterUserBackupByKey: getMasterUserBackupByKey,
		updateMasterUserBackup: updateMasterUserBackup,

		deleteMasterUserBackup: deleteMasterUserBackup,
		restoreFromBackup: restoreFromBackup,
		rollbackFromBackup: rollbackFromBackup
	}

}());