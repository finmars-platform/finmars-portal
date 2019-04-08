/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var xhrService = require('../../../../../core/services/xhrService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getEntitiesSchemesList = function (contentType) {

        var queryFilter = '';

        if (contentType) {
            queryFilter = '?content_type=' + contentType
        }

        return xhrService.fetch(baseUrl + 'import/csv/scheme/' + queryFilter,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getEntitySchemesByModel = function (entityModel) {
        return xhrService.fetch(baseUrl + 'import/data_schema/?model=' + entityModel,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getSchemeFields = function (schemeId) {
        return xhrService.fetch(baseUrl + 'import/schema_fields/?schema_id=' + schemeId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getSchemeAttributes = function (schemeId) {
        return xhrService.fetch(baseUrl + 'import/schema_matching/?schema_id=' + schemeId,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var getList = function (options) {
        return xhrService.fetch(configureRepositoryUrlService.configureUrl(baseUrl + 'import/csv/scheme/', options),
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var create = function (scheme) {
        return xhrService.fetch(baseUrl + 'import/csv/scheme/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            })
    };

    var getByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/csv/scheme/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    var update = function (id, scheme) {
        return xhrService.fetch(baseUrl + 'import/csv/scheme/' + id + '/',
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            })
    };

    var deleteByKey = function (id) {
        return xhrService.fetch(baseUrl + 'import/csv/scheme/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            })
    };

    module.exports = {
        getEntitiesSchemesList: getEntitiesSchemesList,
        getEntitySchemesByModel: getEntitySchemesByModel,
        getSchemeFields: getSchemeFields,
        getSchemeAttributes: getSchemeAttributes,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());