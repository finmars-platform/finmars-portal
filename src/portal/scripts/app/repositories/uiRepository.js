/**
 * Created by szhitenev on 16.06.2016.
 */
(function () {

	'use strict';

	var cookieService = require('../../../../core/services/cookieService');
	var xhrService = require('../../../../core/services/xhrService');
	var metaContentTypesService = require('../services/metaContentTypesService');
	var metaRestrictionsRepository = require('./metaRestrictionsRepository');
	var baseUrlService = require('../services/baseUrlService');

	var configureRepositoryUrlService = require('../services/configureRepositoryUrlService');

	var baseUrl = baseUrlService.resolve();

	var getRequestParams = {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
			Accept: 'application/json',
			'Content-type': 'application/json'
		}
	};

	var getRequestParams2 = {
		method: 'GET',
		credentials: 'include',
		headers: {
			'X-CSRFToken': cookieService.getCookie('csrftoken'),
			'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
			Accept: 'application/json',
			'Content-type': 'application/json'
		}
	};

	var getPortalInterfaceAccess = function (uiLayoutId) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/portal-interface-access/',
			getRequestParams2)
	};

	var getListLayout = function (entity, options) {

		/* if (entity == 'all') {


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/', options),
				getRequestParams)

		} else {

			if (!options) {
				options = {}
			}

			if (!options.content_type) {
				options.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
			}


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/', options),
				getRequestParams);
		} */

		if (!options) {
			options = {}
		}

		if (entity !== 'all') {

			if (!options.filters) {
				options.filters = {}
			}

			if (!options.filters.content_type) {
				options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
			}


			var prefix = baseUrlService.getMasterUserPrefix();
			var apiVersion = baseUrlService.getApiVersion();

			return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/', options),
				getRequestParams);

		}


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/', options),
			getRequestParams);

	};

	var getListLayoutLight = function (entity, options) {

		if (!options) {
			options = {}
		}

		if (entity !== 'all') {

			if (!options.filters) {
				options.filters = {}
			}

			if (!options.filters.content_type) {
				options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
			}


			var prefix = baseUrlService.getMasterUserPrefix();
			var apiVersion = baseUrlService.getApiVersion();

			return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout-light/', options),
				getRequestParams);

		}


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout-light/', options),
			getRequestParams);

	};

	var getListLayoutByKey = function (uiLayoutId) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/' + uiLayoutId + '/',
			getRequestParams2);
	};

	/* var getListLayoutDefault = function (options) {

var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/', options),
			getRequestParams);
	}; */

	/* var getActiveListLayout = function (entity) {

		var contentType = metaContentTypesService.findContentTypeByEntity(entity, 'ui');


var prefix = baseUrlService.getMasterUserPrefix();
var apiVersion = baseUrlService.getApiVersion();

return xhrService.fetch(baseUrl   +  '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/?is_active=2&content_type=' + contentType,
			getRequestParams2)
	}; */

	var getDefaultListLayout = function (entityType) {

		var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/?is_default=2&content_type=' + contentType,
			getRequestParams2)
	};

	var createListLayout = function (ui) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(ui)
			})
	};

	var updateListLayout = function (id, ui) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(ui)
			})
	};

	var deleteListLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};
	/**
	 *
	 * @param layoutId {number}
	 * @param xhrOptions {=Object} - options for xhrService
	 * @returns {Promise<Object>}
	 */
	var pingListLayoutByKey = function (layoutId, xhrOptions) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/list-layout/' + layoutId + '/ping/',
			getRequestParams2, xhrOptions)
	};

	var getListLayoutTemplate = function () {
		return [{
			"name": "default",
			"data": {
				"entityType": null,
				"folding": false,
				"sorting": {
					"group": {
						"id": null,
						"sort": "DESC",
						"key": null
					},
					"column": {
						"id": null,
						"sort": "ASC",
						"key": null
					}
				},
				"grouping": [],
				"columns": [],
				"filters": [],
				"additions": {}
			}
		}]
	};

	// Input Form Layout

	var getListEditLayout = function (entity, options) {

		console.log('getListEditLayout.entity', entity)

		if (!options) {
			options = {}
		}

		if (entity !== 'all') {

			if (!options.filters) {
				options.filters = {}
			}

			if (!options.filters.content_type) {
				options.filters.content_type = metaContentTypesService.findContentTypeByEntity(entity, 'ui');
			}


			var prefix = baseUrlService.getMasterUserPrefix();
			var apiVersion = baseUrlService.getApiVersion();

			return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/', options),
				getRequestParams);

		}


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/', options),
			getRequestParams);

	};

	var getDefaultEditLayout = function (entityType) {

		var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/?is_default=2&content_type=' + contentType,
			getRequestParams2)
	};

	var getEditLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/' + id + '/',
			getRequestParams)
	};

	var getEditLayoutByUserCode = function (entityType, userCode) {

		var contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');
		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/?content_type=' + contentType + '&user_code=' + userCode,
			getRequestParams2);

	};

	var createEditLayout = function (ui) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(ui)
			})
	};

	var updateEditLayout = function (id, ui) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(ui)
			})
	};

	var deleteEditLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/edit-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};


	// Configuration Layout

	var getConfigurationList = function () {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration/',
			getRequestParams)
	};

	var createConfiguration = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateConfiguration = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteConfigurationByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};

	var getConfigurationExportLayoutList = function () {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration-export-layout/',
			getRequestParams)
	};

	var createConfigurationExportLayout = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration-export-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateConfigurationExportLayout = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration-export-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteConfigurationExportLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/configuration-export-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};

	var getTransactionFieldList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/transaction-user-field/', options),
			getRequestParams)

	};

	var createTransactionField = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/transaction-user-field/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateTransactionField = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/transaction-user-field/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var getInstrumentFieldList = function (options) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/instrument-user-field/', options),
			getRequestParams)

	};

	var createInstrumentField = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/instrument-user-field/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateInstrumentField = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/instrument-user-field/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var getDashboardLayoutList = function (entity, options) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/', options),
			getRequestParams)
	};

	var getDashboardLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/' + id + '/',
			getRequestParams2)
	};

	var getActiveDashboardLayout = function () {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/?is_active=2',
			getRequestParams2)
	};

	var getDefaultDashboardLayout = function () {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/?is_default=2',
			getRequestParams2)
	};

	var createDashboardLayout = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateDashboardLayout = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteDashboardLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/dashboard-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};


	var getTemplateLayoutList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/', options),
			getRequestParams)
	};

	var getTemplateLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/' + id + '/',
			getRequestParams2)
	};

	var getDefaultTemplateLayout = function () {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/?is_default=2',
			getRequestParams2)
	};

	var createTemplateLayout = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateTemplateLayout = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteTemplateLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/template-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};

	var getContextMenuLayoutList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/context-menu-layout/', options),
			getRequestParams)
	};

	var getContextMenuLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/context-menu-layout/' + id + '/',
			getRequestParams2)
	};

	var createContextMenuLayout = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/context-menu-layout/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateContextMenuLayout = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/context-menu-layout/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteContextMenuLayoutByKey = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/context-menu-layout/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};


	var getEntityTooltipList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/entity-tooltip/', options),
			getRequestParams)
	};

	var createEntityTooltip = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/entity-tooltip/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateEntityTooltip = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/entity-tooltip/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	// Cross Entity Attribute Extension

	var getCrossEntityAttributeExtensionList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/cross-entity-attribute-extension/', options),
			getRequestParams)
	};

	var getCrossEntityAttributeExtension = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/cross-entity-attribute-extension/' + id + '/',
			{
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

	var createCrossEntityAttributeExtension = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/cross-entity-attribute-extension/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateCrossEntityAttributeExtension = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/cross-entity-attribute-extension/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteCrossEntityAttributeExtension = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/cross-entity-attribute-extension/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};

	// Column Sort Data

	var getColumnSortDataList = function (options) {

		console.log('options', options);


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/column-sort-data/', options),
			getRequestParams)
	};

	var getColumnSortData = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/column-sort-data/' + id + '/',
			{
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

	var createColumnSortData = function (data) {


		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/column-sort-data/',
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var updateColumnSortData = function (id, data) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/column-sort-data/' + id + '/',
			{
				method: 'PUT',
				credentials: 'include',
				headers: {
					'X-CSRFToken': cookieService.getCookie('csrftoken'),
					'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
					Accept: 'application/json',
					'Content-type': 'application/json'
				},
				body: JSON.stringify(data)
			})
	};

	var deleteColumnSortData = function (id) {

		var prefix = baseUrlService.getMasterUserPrefix();
		var apiVersion = baseUrlService.getApiVersion();

		return new Promise(function (resolve, reject) {
			xhrService.fetch(baseUrl + '/' + prefix + '/' + apiVersion + '/' + 'ui/column-sort-data/' + id + '/',
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'X-CSRFToken': cookieService.getCookie('csrftoken'),
						'Authorization': 'Token ' + cookieService.getCookie('authtoken'),
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				}).then(function (data) {
				resolve(undefined);
			})
		})
	};


	module.exports = {

		getPortalInterfaceAccess: getPortalInterfaceAccess,


		getDefaultListLayout: getDefaultListLayout,

		// getActiveListLayout: getActiveListLayout,

		getListLayoutTemplate: getListLayoutTemplate,

		getListLayout: getListLayout,
		getListLayoutLight: getListLayoutLight,
		getListLayoutByKey: getListLayoutByKey,
		// getListLayoutDefault: getListLayoutDefault,
		createListLayout: createListLayout,
		updateListLayout: updateListLayout,
		deleteListLayoutByKey: deleteListLayoutByKey,

		pingListLayoutByKey: pingListLayoutByKey,

		// Input Form Layout

		getListEditLayout: getListEditLayout,
		getDefaultEditLayout: getDefaultEditLayout,
		getEditLayoutByKey: getEditLayoutByKey,
		getEditLayoutByUserCode: getEditLayoutByUserCode,
		createEditLayout: createEditLayout,
		updateEditLayout: updateEditLayout,
		deleteEditLayoutByKey: deleteEditLayoutByKey,

		// Configuration Layout

		getConfigurationList: getConfigurationList,
		createConfiguration: createConfiguration,
		updateConfiguration: updateConfiguration,
		deleteConfigurationByKey: deleteConfigurationByKey,

		getConfigurationExportLayoutList: getConfigurationExportLayoutList,
		createConfigurationExportLayout: createConfigurationExportLayout,
		updateConfigurationExportLayout: updateConfigurationExportLayout,
		deleteConfigurationExportLayoutByKey: deleteConfigurationExportLayoutByKey,

		getTransactionFieldList: getTransactionFieldList,
		createTransactionField: createTransactionField,
		updateTransactionField: updateTransactionField,

		getInstrumentFieldList: getInstrumentFieldList,
		createInstrumentField: createInstrumentField,
		updateInstrumentField: updateInstrumentField,

		getDashboardLayoutList: getDashboardLayoutList,
		getDashboardLayoutByKey: getDashboardLayoutByKey,
		getActiveDashboardLayout: getActiveDashboardLayout,
		getDefaultDashboardLayout: getDefaultDashboardLayout,
		createDashboardLayout: createDashboardLayout,
		updateDashboardLayout: updateDashboardLayout,
		deleteDashboardLayoutByKey: deleteDashboardLayoutByKey,


		getTemplateLayoutList: getTemplateLayoutList,
		getTemplateLayoutByKey: getTemplateLayoutByKey,
		getDefaultTemplateLayout: getDefaultTemplateLayout,
		createTemplateLayout: createTemplateLayout,
		updateTemplateLayout: updateTemplateLayout,
		deleteTemplateLayoutByKey: deleteTemplateLayoutByKey,


		getContextMenuLayoutList: getContextMenuLayoutList,
		getContextMenuLayoutByKey: getContextMenuLayoutByKey,
		createContextMenuLayout: createContextMenuLayout,
		updateContextMenuLayout: updateContextMenuLayout,
		deleteContextMenuLayoutByKey: deleteContextMenuLayoutByKey,

		getEntityTooltipList: getEntityTooltipList,
		createEntityTooltip: createEntityTooltip,
		updateEntityTooltip: updateEntityTooltip,

		getCrossEntityAttributeExtensionList: getCrossEntityAttributeExtensionList,
		getCrossEntityAttributeExtension: getCrossEntityAttributeExtension,
		createCrossEntityAttributeExtension: createCrossEntityAttributeExtension,
		updateCrossEntityAttributeExtension: updateCrossEntityAttributeExtension,
		deleteCrossEntityAttributeExtension: deleteCrossEntityAttributeExtension,

		getColumnSortDataList: getColumnSortDataList,
		getColumnSortData: getColumnSortData,
		createColumnSortData: createColumnSortData,
		updateColumnSortData: updateColumnSortData,
		deleteColumnSortData: deleteColumnSortData,


	}

}());