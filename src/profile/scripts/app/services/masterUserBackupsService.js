/**
 * Created by szhitenev on 04.10.2021.
 */

(function () {

	'use strict';

	var cookieService = require('../../../../core/services/cookieService');
	var baseUrlService = require('./baseUrlService');

	var getMasterUserBackupsList = function () {

		const authorizerUrl = baseUrlService.getAuthorizerUrl();

		return window.fetch(authorizerUrl + '/master-user-backups/',{
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
			data: JSON.stringify(user)
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
			data: JSON.stringify(data)
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

		getMasterUserBackupsList: getMasterUserBackupsList,
		getMasterUserBackupByKey: getMasterUserBackupByKey,
		updateMasterUserBackup: updateMasterUserBackup,

		deleteMasterUserBackup: deleteMasterUserBackup,
		restoreFromBackup: restoreFromBackup
	}

}());