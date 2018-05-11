/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var cookieService = require('../../../../../../../core/services/cookieService');
    var configureRepositoryUrlService = require('../../../../services/configureRepositoryUrlService');
    var baseUrlService = require('../../../../services/baseUrlService');

    var baseUrl = baseUrlService.resolve();

    var getList = function (attribute_type_id) {
        return window.fetch(baseUrl + 'import/responsible-classifier-mapping/?page_size=1000?attribute_type=' + attribute_type_id,
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
    var create = function (map) {
        return window.fetch(baseUrl + 'import/responsible-classifier-mapping/',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            }).then(function (data) {
            return data.json();
        })
    };

    var getByKey = function (id) {
        return window.fetch(baseUrl + 'import/responsible-classifier-mapping/' + id + '/',
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

    var update = function (id, map) {
        return window.fetch(baseUrl + 'import/responsible-classifier-mapping/' + id + '/',
            {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': cookieService.getCookie('csrftoken'),
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(map)
            }).then(function (data) {
            return data.json();
        })
    };

    var deleteByKey = function (id) {
        return window.fetch(baseUrl + 'import/responsible-classifier-mapping/' + id + '/',
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
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());