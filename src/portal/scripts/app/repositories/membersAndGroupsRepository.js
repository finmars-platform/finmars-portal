(function() {
	'use strict';

	var cookieService = require('../../../../core/services/cookieService');
	var baseUrlService = require('../services/baseUrlService');

	var baseUrl = baseUrlService.resolve();

	var getList = function (type) {
		var fetchUrl = '';
		type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		return window.fetch(baseUrl + fetchUrl,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			}).then(function (data) {
			return data.json();
		})
	};

	var getMemberOrGroupByKey = function (type, id) {
		var fetchUrl = '';
		type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		return window.fetch(baseUrl + fetchUrl + id + '/', 
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/json'
				}
			}).then(function (data) {
				return data.json();
			});
	}

	var create = function (type, data) {
		var fetchUrl = '';
		type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		console.log('url is', baseUrl + fetchUrl);
		return window.fetch(baseUrl + fetchUrl,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			}).then(function (data) {
			return new Promise(function (resolve, reject) {
				data.json().then(function (result) {
					resolve({
						response: result,
						status: data.status
					})
				})
			});
		});
	}

	var update = function (type, id, data) {
		var fetchUrl = '';
		type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		return window.fetch(baseUrl + fetchUrl + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
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

	var deleteByKey = function (type, id) {
		var fetchUrl = '';
		type === 'members' ? fetchUrl = 'users/member/' : fetchUrl = 'users/group/';
		return window.fetch(baseUrl + fetchUrl + id + '/',
			{
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
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
		getList: getList,
		getMemberOrGroupByKey: getMemberOrGroupByKey,
		create: create,
		update: update,
		deleteByKey: deleteByKey
	}
}());