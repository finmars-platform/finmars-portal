/**
 * Created by szhitenev on 15.03.2018.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getEntitiesSchemesList = function () {
        return window.fetch(baseUrl + 'import/data_schema/',
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

    var getEntitySchemesByModel = function (entityModel) {
        return window.fetch(baseUrl + 'import/data_schema/?model=' + entityModel,
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

    var getSchemeAttributes = function (schemeId) {
        return window.fetch(baseUrl + 'import/schema_matching/?schema_id=' + schemeId,
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

    var updateEntitySchemeMapping = function (schemeMapping) {
        return window.fetch(baseUrl + 'import/schema_fields/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(schemeMapping)
            }).then(function (data) {
                return data;
        })
    };

    var create = function (scheme) {
        return window.fetch(baseUrl + 'import/data_schema/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            }).then(function (data) {
            return new Promise(function (resolve, reject) {
                data.json().then(function (result) {
                    console.log('refined data', result);
                    resolve({
                        response: result,
                        status: data.status
                    })
                })
            });
        })
    };

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'import/data_schema/' + id + '/',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    var update = function (scheme) {
        return window.fetch(baseUrl + 'import/schema_fields/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(scheme)
            }).then(function (data) {
                return data
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'import/data_schema/' + id + '/',
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
            }).then(function (data) {
            return data.json();
        })
    };

    module.exports = {
        getEntitiesSchemesList: getEntitiesSchemesList,
        getEntitySchemesByModel: getEntitySchemesByModel,
        getSchemeAttributes: getSchemeAttributes,
        updateEntitySchemeMapping: updateEntitySchemeMapping,
        create: create,
        getByKey: getByKey,
        update: update,
        deleteByKey: deleteByKey
    }

}());