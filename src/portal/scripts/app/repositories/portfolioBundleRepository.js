/**
 * Created by mevstratov on 12.09.2022.
 */

var cookieService = require('../../../../core/services/cookieService');
var xhrService = require('../../../../core/services/xhrService');

var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');
var baseUrlService = require('../services/baseUrlService');

const baseUrl = baseUrlService.resolve();

const getList = function (options) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/', options),
		{
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
};

const getListLight = function (options) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-light/', options),
		{
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
};

const getByKey = function (id) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/' + id + '/',
		{
			method: 'GET',
			credentials: 'include',
			headers: {
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			}
		})
};

const create = function (portfolio) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/',
		{
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			data: JSON.stringify(portfolio)
		})
};

const update = function (id, portfolio) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/' + id + '/',
		{
			method: 'PUT',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			data: JSON.stringify(portfolio)
		})
};

const updateBulk = function (portfolios) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/bulk-update/',
		{
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			data: JSON.stringify(portfolios)
		})
};

const deleteByKey = function (id) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/' + id + '/',
		{
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
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

const deleteBulk = function (data) {

	var prefix = baseUrlService.getMasterUserPrefix();
	var apiVersion = baseUrlService.getApiVersion();

	return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'portfolios/portfolio-register-record/bulk-delete/',
		{
			method: 'POST',
			credentials: 'include',
			headers: {
				'X-CSRFToken': cookieService.getCookie('csrftoken'),
				'Authorization': 'Token ' + cookieService.getCookie('access_token'),
				Accept: 'application/json',
				'Content-type': 'application/json'
			},
			data: JSON.stringify(data)
		})
		.then(function (data) {
			return new Promise(function (resolve, reject) {
				resolve({status: 'deleted'});
			});
		})
};

export default {
	getList: getList,
	getListLight: getListLight,
	getByKey: getByKey,
	create: create,
	update: update,
	deleteByKey: deleteByKey,

	updateBulk: updateBulk,
	deleteBulk: deleteBulk,
}